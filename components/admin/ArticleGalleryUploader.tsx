'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'

export interface GalleryImage {
  url: string
  caption: string
}

interface ArticleGalleryUploaderProps {
  images: GalleryImage[]
  onChange: (images: GalleryImage[]) => void
}

export default function ArticleGalleryUploader({ images, onChange }: ArticleGalleryUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string[]>([])
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function uploadFiles(files: FileList | File[]) {
    const fileArray = Array.from(files)
    if (!fileArray.length) return

    setUploading(true)
    setError('')
    setUploadProgress(fileArray.map(f => `Uploading ${f.name}...`))

    const uploaded: GalleryImage[] = []

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i]
      setUploadProgress(prev => {
        const next = [...prev]
        next[i] = `Uploading ${file.name}...`
        return next
      })

      try {
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
        const data = await res.json()

        if (res.ok) {
          uploaded.push({ url: data.url, caption: '' })
          setUploadProgress(prev => {
            const next = [...prev]
            next[i] = `✅ ${file.name}`
            return next
          })
        } else {
          setUploadProgress(prev => {
            const next = [...prev]
            next[i] = `❌ ${file.name}: ${data.error}`
            return next
          })
        }
      } catch {
        setUploadProgress(prev => {
          const next = [...prev]
          next[i] = `❌ ${file.name}: upload failed`
          return next
        })
      }
    }

    onChange([...images, ...uploaded])
    setUploading(false)
    setTimeout(() => setUploadProgress([]), 2000)
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) uploadFiles(e.target.files)
    e.target.value = ''
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files) uploadFiles(e.dataTransfer.files)
  }

  function updateCaption(idx: number, caption: string) {
    const next = images.map((img, i) => i === idx ? { ...img, caption } : img)
    onChange(next)
  }

  function removeImage(idx: number) {
    onChange(images.filter((_, i) => i !== idx))
  }

  function moveImage(from: number, to: number) {
    if (to < 0 || to >= images.length) return
    const next = [...images]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  // Drag-to-reorder handlers
  function onDragStart(idx: number) { setDraggingIdx(idx) }
  function onDropImage(idx: number) {
    if (draggingIdx === null || draggingIdx === idx) { setDraggingIdx(null); return }
    moveImage(draggingIdx, idx)
    setDraggingIdx(null)
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => !uploading && fileRef.current?.click()}
        className={`border-2 border-dashed rounded p-6 text-center cursor-pointer transition-all ${
          dragOver
            ? 'border-sow-blue bg-blue-50 scale-[1.01]'
            : 'border-gray-300 hover:border-sow-blue hover:bg-gray-50'
        } ${uploading ? 'cursor-not-allowed opacity-60' : ''}`}
      >
        {uploading ? (
          <div className="space-y-2">
            <p className="text-2xl">⏳</p>
            <p className="text-sm font-bold text-sow-blue">Uploading images...</p>
            <div className="text-left max-w-xs mx-auto space-y-1">
              {uploadProgress.map((msg, i) => (
                <p key={i} className="text-xs text-gray-500">{msg}</p>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-3xl">🖼</p>
            <p className="text-sm font-bold text-gray-600">
              Drag & drop images here, or click to select
            </p>
            <p className="text-xs text-gray-400">
              Select multiple at once · JPEG, PNG, WebP · Max 5MB each
            </p>
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        className="hidden"
        onChange={handleFileInput}
      />

      {error && (
        <p className="text-xs text-red-600 border border-red-100 bg-red-50 px-3 py-2">{error}</p>
      )}

      {/* Uploaded images grid */}
      {images.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] tracking-[2px] uppercase font-bold text-gray-500">
            {images.length} image{images.length !== 1 ? 's' : ''} — drag to reorder, add captions below each
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {images.map((img, idx) => (
              <div
                key={img.url + idx}
                draggable
                onDragStart={() => onDragStart(idx)}
                onDragOver={e => e.preventDefault()}
                onDrop={() => onDropImage(idx)}
                className={`border-2 rounded overflow-hidden cursor-grab active:cursor-grabbing transition-all ${
                  draggingIdx === idx ? 'opacity-40 border-sow-blue scale-95' : 'border-gray-200 hover:border-sow-blue'
                }`}
              >
                {/* Image */}
                <div className="relative aspect-video bg-gray-100 overflow-hidden group">
                  <Image src={img.url} alt={img.caption || `Image ${idx + 1}`} fill className="object-cover" />

                  {/* Overlay controls */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => moveImage(idx, idx - 1)}
                      disabled={idx === 0}
                      className="bg-white/80 text-ink text-xs font-bold px-2 py-1 hover:bg-white disabled:opacity-30 rounded"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="bg-red-600 text-white text-xs font-bold px-2 py-1 hover:bg-red-700 rounded"
                    >
                      ✕
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(idx, idx + 1)}
                      disabled={idx === images.length - 1}
                      className="bg-white/80 text-ink text-xs font-bold px-2 py-1 hover:bg-white disabled:opacity-30 rounded"
                    >
                      →
                    </button>
                  </div>

                  {/* Position badge */}
                  <div className="absolute top-1 left-1 bg-sow-blue text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                    {idx + 1}
                  </div>
                </div>

                {/* Caption input */}
                <div className="p-1.5 bg-white">
                  <input
                    type="text"
                    value={img.caption}
                    onChange={e => updateCaption(idx, e.target.value)}
                    placeholder="Add a caption (optional)"
                    className="w-full text-xs border border-gray-200 px-2 py-1 outline-none focus:border-sow-blue rounded"
                  />
                </div>
              </div>
            ))}

            {/* Add more button */}
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-200 hover:border-sow-blue rounded aspect-video flex flex-col items-center justify-center cursor-pointer transition-colors group"
            >
              <span className="text-2xl text-gray-300 group-hover:text-sow-blue transition-colors">+</span>
              <span className="text-[10px] text-gray-400 group-hover:text-sow-blue mt-1">Add more</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
