'use client'
import { useState, useRef, useCallback } from 'react'

interface VideoUploaderProps {
  videoUrl: string
  videoType: string
  onVideoUrl: (url: string) => void
  onVideoType: (type: string) => void
}

export default function VideoUploader({ videoUrl, videoType, onVideoUrl, onVideoType }: VideoUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [tab, setTab] = useState<'upload' | 'link'>(videoUrl && videoType !== 'upload' ? 'link' : 'upload')
  const fileRef = useRef<HTMLInputElement>(null)

  async function uploadFile(file: File) {
    setUploading(true)
    setError('')
    setProgress(0)

    // Validate on client side first
    const allowed = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo']
    if (!allowed.includes(file.type)) {
      setError('Only MP4, WebM, MOV, OGG or AVI files are allowed.')
      setUploading(false)
      return
    }
    if (file.size > 200 * 1024 * 1024) {
      setError('Video must be under 200MB.')
      setUploading(false)
      return
    }

    // Simulate progress (XHR would be needed for real progress — this fakes it nicely)
    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(p + Math.random() * 8, 85))
    }, 400)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload-video', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      clearInterval(progressInterval)

      if (res.ok) {
        setProgress(100)
        onVideoUrl(data.url)
        onVideoType('upload')
        setTimeout(() => setProgress(0), 1000)
      } else {
        setError(data.error || 'Upload failed.')
        setProgress(0)
      }
    } catch {
      clearInterval(progressInterval)
      setError('Upload failed. Please try again.')
      setProgress(0)
    } finally {
      setUploading(false)
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) uploadFile(file)
    e.target.value = ''
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) uploadFile(file)
  }, [])

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(true)
  }

  function clearVideo() {
    onVideoUrl('')
    onVideoType('youtube')
    setError('')
    setProgress(0)
  }

  const fileSizeMb = (bytes: number) => (bytes / (1024 * 1024)).toFixed(1) + ' MB'

  return (
    <div className="space-y-3">
      {/* Tab switcher */}
      <div className="flex border border-gray-300">
        <button type="button" onClick={() => setTab('upload')}
          className={`flex-1 py-2 text-[10px] tracking-[1.5px] uppercase font-bold transition-colors ${
            tab === 'upload' ? 'bg-sow-blue text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
          }`}>
          📁 Upload Video File
        </button>
        <button type="button" onClick={() => setTab('link')}
          className={`flex-1 py-2 text-[10px] tracking-[1.5px] uppercase font-bold transition-colors border-l border-gray-300 ${
            tab === 'link' ? 'bg-sow-blue text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
          }`}>
          🔗 YouTube / Vimeo Link
        </button>
      </div>

      {/* UPLOAD TAB */}
      {tab === 'upload' && (
        <div className="space-y-3">
          {/* Current video preview */}
          {videoUrl && videoType === 'upload' ? (
            <div className="space-y-2">
              <video
                src={videoUrl}
                controls
                className="w-full rounded border border-gray-200 bg-black"
                style={{ maxHeight: '280px' }}
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-green-600 font-bold">✓ Video uploaded successfully</p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => fileRef.current?.click()}
                    className="text-xs text-sow-blue font-bold hover:underline">
                    Replace
                  </button>
                  <button type="button" onClick={clearVideo}
                    className="text-xs text-red-500 font-bold hover:underline">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Drop zone */
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={() => setDragOver(false)}
              onClick={() => !uploading && fileRef.current?.click()}
              className={`border-2 border-dashed rounded p-8 text-center cursor-pointer transition-all ${
                dragOver
                  ? 'border-sow-blue bg-blue-50 scale-[1.01]'
                  : 'border-gray-300 hover:border-sow-blue hover:bg-gray-50'
              } ${uploading ? 'cursor-not-allowed opacity-60' : ''}`}
            >
              {uploading ? (
                <div className="space-y-3">
                  <p className="text-3xl">⏳</p>
                  <p className="text-sm font-bold text-sow-blue">Uploading video...</p>
                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-sow-blue h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400">{Math.round(progress)}% — please wait, large files take a moment</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-4xl">🎬</p>
                  <p className="text-sm font-bold text-gray-600">
                    Drag & drop a video here, or click to browse
                  </p>
                  <p className="text-xs text-gray-400">MP4, WebM, MOV, OGG or AVI · Max 200MB</p>
                  <p className="text-xs text-gray-400">
                    💡 Tip: MP4 format works best across all browsers
                  </p>
                </div>
              )}
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="video/mp4,video/webm,video/ogg,video/quicktime,video/x-msvideo"
            className="hidden"
            onChange={handleFileInput}
          />
        </div>
      )}

      {/* LINK TAB */}
      {tab === 'link' && (
        <div className="space-y-3">
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Video Type</label>
            <select
              value={videoType !== 'upload' ? videoType : 'youtube'}
              onChange={e => onVideoType(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-sow-blue"
            >
              <option value="youtube">YouTube</option>
              <option value="vimeo">Vimeo</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Video URL</label>
            <input
              type="url"
              value={videoType !== 'upload' ? videoUrl : ''}
              onChange={e => { onVideoUrl(e.target.value); onVideoType(videoType !== 'upload' ? videoType : 'youtube') }}
              placeholder={videoType === 'vimeo' ? 'https://vimeo.com/123456789' : 'https://youtube.com/watch?v=...'}
              className="w-full border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-sow-blue"
            />
          </div>

          {/* YouTube/Vimeo preview hint */}
          {videoUrl && videoType !== 'upload' && (
            <div className="bg-blue-50 border border-blue-100 px-3 py-2">
              <p className="text-xs text-blue-700 font-bold">✓ Link saved — video will embed on the article page.</p>
              <button type="button" onClick={clearVideo} className="text-xs text-red-500 hover:underline mt-1">Remove video</button>
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-xs text-red-600 border border-red-200 bg-red-50 px-3 py-2">{error}</p>
      )}

      {/* Info box */}
      <div className="bg-amber-50 border border-amber-200 px-3 py-2">
        <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wide mb-0.5">Storage Note</p>
        <p className="text-[10px] text-amber-600">
          Uploaded videos are stored in Supabase Storage. For very long videos (assemblies, events), 
          consider uploading to YouTube first and using the link tab — it loads faster for viewers.
        </p>
      </div>
    </div>
  )
}
