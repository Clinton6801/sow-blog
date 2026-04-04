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
      <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 */ }}>
        {type === 'youtube' && (() => {
          const id = getYouTubeId(url)
          if (!id) return <p className="text-red-500 text-sm">Invalid YouTube URL</p>
          return (
            <iframe
              className="absolute inset-0 w-full h-full border-0"
              src={`https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`}
              title={title || 'YouTube video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )
        })()}

        {type === 'vimeo' && (() => {
          const id = getVimeoId(url)
          if (!id) return <p className="text-red-500 text-sm">Invalid Vimeo URL</p>
          return (
            <iframe
              className="absolute inset-0 w-full h-full border-0"
              src={`https://player.vimeo.com/video/${id}?byline=0&portrait=0`}
              title={title || 'Vimeo video'}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          )
        })()}

        {type === 'upload' && (
          <video
            className="absolute inset-0 w-full h-full bg-black"
            controls
            preload="metadata"
            src={url}
            title={title}
          />
        )}
      </div>

      {title && (
        <p className="text-xs text-gray-500 mt-2 text-center italic">{title}</p>
      )}
    </div>
  )
}
