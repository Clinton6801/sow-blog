'use client'

interface VideoEmbedProps {
  url: string
  type: 'youtube' | 'vimeo' | 'upload'
  title?: string
}

function getYouTubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

function getVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(\d+)/)
  return m ? m[1] : null
}

export default function VideoEmbed({ url, type, title }: VideoEmbedProps) {
  if (!url) return null

  return (
    <div className="my-6">
      {/* Label */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[9px] tracking-[2px] uppercase font-bold bg-sow-blue text-white px-2 py-0.5">
          🎬 Video
        </span>
        {title && <span className="text-sm text-gray-500 italic">{title}</span>}
      </div>

      {/* 16:9 container */}
      <div className="relative w-full bg-black" style={{ paddingBottom: '56.25%' }}>

        {/* Uploaded video — plays directly */}
        {type === 'upload' && (
          <video
            className="absolute inset-0 w-full h-full"
            controls
            preload="metadata"
            src={url}
            playsInline
          >
            <p className="text-white text-sm p-4">
              Your browser does not support video playback.{' '}
              <a href={url} className="underline text-sow-gold">Download the video</a> instead.
            </p>
          </video>
        )}

        {/* YouTube embed */}
        {type === 'youtube' && (() => {
          const id = getYouTubeId(url)
          if (!id) return (
            <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
              Invalid YouTube URL
            </div>
          )
          return (
            <iframe
              className="absolute inset-0 w-full h-full border-0"
              src={`https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`}
              title={title || 'Video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )
        })()}

        {/* Vimeo embed */}
        {type === 'vimeo' && (() => {
          const id = getVimeoId(url)
          if (!id) return (
            <div className="absolute inset-0 flex items-center justify-center text-white text-sm">
              Invalid Vimeo URL
            </div>
          )
          return (
            <iframe
              className="absolute inset-0 w-full h-full border-0"
              src={`https://player.vimeo.com/video/${id}?byline=0&portrait=0`}
              title={title || 'Video'}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          )
        })()}
      </div>

      {/* Download link for uploaded videos */}
      {type === 'upload' && (
        <div className="mt-2 flex justify-end">
          <a
            href={url}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] tracking-[1.5px] uppercase font-bold text-sow-blue hover:underline flex items-center gap-1"
          >
            ⬇ Download Video
          </a>
        </div>
      )}
    </div>
  )
}
