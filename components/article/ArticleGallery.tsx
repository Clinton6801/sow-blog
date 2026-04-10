'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface GalleryImage {
  url: string
  caption: string
}

interface ArticleGalleryProps {
  images: GalleryImage[]
  title: string
}

export default function ArticleGallery({ images, title }: ArticleGalleryProps) {
  const [active, setActive] = useState<number | null>(null)

  const close = useCallback(() => setActive(null), [])
  const prev  = useCallback(() => setActive(i => i !== null ? (i - 1 + images.length) % images.length : null), [images.length])
  const next  = useCallback(() => setActive(i => i !== null ? (i + 1) % images.length : null), [images.length])

  useEffect(() => {
    if (active === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape')     close()
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [active, close, prev, next])

  if (!images || images.length === 0) return null

  const current = active !== null ? images[active] : null

  // Layout variants based on count
  const gridClass =
    images.length === 1 ? 'grid-cols-1' :
    images.length === 2 ? 'grid-cols-2' :
    images.length === 3 ? 'grid-cols-3' :
    'grid-cols-2 md:grid-cols-3'

  return (
    <div className="my-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <span className="bg-sow-purple text-white text-[9px] tracking-[2px] uppercase font-black px-2 py-1">
          📷 Article Gallery
        </span>
        <span className="text-xs text-gray-400">{images.length} photo{images.length !== 1 ? 's' : ''} · Click to enlarge</span>
      </div>

      {/* Grid */}
      <div className={`grid gap-2 ${gridClass}`}>
        {images.map((img, i) => (
          <div
            key={i}
            className="group relative overflow-hidden bg-gray-100 cursor-pointer border-2 border-transparent hover:border-sow-purple transition-all"
            style={{ aspectRatio: images.length === 1 ? '16/9' : '4/3' }}
            onClick={() => setActive(i)}
          >
            <Image
              src={img.url}
              alt={img.caption || `${title} — photo ${i + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-sow-purple/0 group-hover:bg-sow-purple/20 transition-colors flex items-center justify-center">
              <span className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg">
                🔍
              </span>
            </div>
            {/* Caption preview */}
            {img.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs line-clamp-1">{img.caption}</p>
              </div>
            )}
            {/* Number badge */}
            <div className="absolute top-1.5 left-1.5 bg-black/50 text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {i + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {current && active !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={close}
        >
          {/* Close */}
          <button
            onClick={close}
            className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl font-bold z-10 w-10 h-10 flex items-center justify-center"
          >
            ×
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 text-white/60 text-sm font-bold z-10">
            {active + 1} / {images.length}
          </div>

          {/* Prev */}
          {images.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); prev() }}
              className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 hover:bg-black/80 text-white flex items-center justify-center text-2xl font-bold transition-colors rounded"
            >
              ‹
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-w-4xl max-h-[85vh] w-full"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={current.url}
              alt={current.caption || title}
              width={1200}
              height={800}
              className="max-h-[75vh] w-full object-contain"
              priority
            />

            {/* Caption + download */}
            <div className="bg-black/70 px-4 py-3 flex items-center justify-between gap-4 mt-1">
              <div>
                {current.caption ? (
                  <p className="text-white text-sm">{current.caption}</p>
                ) : (
                  <p className="text-white/40 text-xs italic">No caption</p>
                )}
                <p className="text-white/30 text-[10px] mt-0.5">{title}</p>
              </div>
              <a
                href={current.url}
                download
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="flex-shrink-0 bg-sow-purple text-white text-[10px] tracking-[1.5px] uppercase font-bold px-3 py-2 hover:bg-purple-700 transition-colors whitespace-nowrap"
              >
                ⬇ Download
              </a>
            </div>
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); next() }}
              className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-black/50 hover:bg-black/80 text-white flex items-center justify-center text-2xl font-bold transition-colors rounded"
            >
              ›
            </button>
          )}

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setActive(i) }}
                  className={`w-10 h-8 overflow-hidden border-2 transition-all flex-shrink-0 ${
                    i === active ? 'border-sow-purple opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
                  }`}
                >
                  <Image src={img.url} alt="" width={40} height={32} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Keyboard hint */}
          <p className="absolute bottom-16 left-1/2 -translate-x-1/2 text-white/20 text-xs whitespace-nowrap">
            ← → keys to navigate · Esc to close
          </p>
        </div>
      )}
    </div>
  )
}
