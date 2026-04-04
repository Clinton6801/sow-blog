'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { format } from 'date-fns'

interface Photo {
  id: string
  title: string
  description: string | null
  image_url: string
  event_name: string | null
  taken_at: string | null
  uploaded_by: string
}

interface Props {
  photos: Photo[]
  eventName: string
}

export default function GalleryLightbox({ photos, eventName }: Props) {
  const [active, setActive] = useState<number | null>(null)

  const close  = useCallback(() => setActive(null), [])
  const prev   = useCallback(() => setActive(i => i !== null ? (i - 1 + photos.length) % photos.length : null), [photos.length])
  const next   = useCallback(() => setActive(i => i !== null ? (i + 1) % photos.length : null), [photos.length])

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

  const current = active !== null ? photos[active] : null

  return (
    <>
      {/* Photo grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {photos.map((photo, i) => (
          <div key={photo.id}
            className="group relative cursor-pointer overflow-hidden bg-gray-100 border-2 border-transparent hover:border-sow-purple transition-all"
            onClick={() => setActive(i)}>
            <div className="aspect-square relative overflow-hidden">
              <Image
                src={photo.image_url}
                alt={photo.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-sow-purple/0 group-hover:bg-sow-purple/30 transition-colors flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <span className="text-white text-2xl">🔍</span>
              <span className="text-white text-xs font-bold">View</span>
            </div>
            {/* Download button */}
            <a
              href={photo.image_url}
              download={`${photo.title}.jpg`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-sow-purple"
            >
              ⬇
            </a>
            {/* Title on hover */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-xs font-bold line-clamp-1">{photo.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox modal */}
      {current && active !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
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
          <div className="absolute top-4 left-4 text-white/60 text-sm font-bold">
            {active + 1} / {photos.length}
          </div>

          {/* Prev */}
          <button
            onClick={e => { e.stopPropagation(); prev() }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl font-bold z-10 w-12 h-12 flex items-center justify-center bg-black/30 hover:bg-black/60 transition-colors"
          >
            ‹
          </button>

          {/* Image */}
          <div
            className="relative max-w-5xl max-h-[80vh] w-full mx-16"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={current.image_url}
              alt={current.title}
              width={1200}
              height={800}
              className="max-h-[80vh] w-full object-contain"
              priority
            />

            {/* Caption */}
            <div className="bg-black/60 px-4 py-3 flex items-start justify-between gap-4">
              <div>
                <p className="text-white font-bold text-sm">{current.title}</p>
                {current.description && (
                  <p className="text-white/60 text-xs mt-0.5">{current.description}</p>
                )}
                <div className="flex gap-3 mt-1 text-[10px] text-white/40 uppercase tracking-wide">
                  <span>{eventName}</span>
                  {current.taken_at && <span>{format(new Date(current.taken_at), 'MMM d, yyyy')}</span>}
                  <span>📷 {current.uploaded_by}</span>
                </div>
              </div>
              {/* Download */}
              <a
                href={current.image_url}
                download={`${current.title}.jpg`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 bg-sow-purple text-white text-[10px] tracking-[1.5px] uppercase font-bold px-3 py-2 hover:bg-purple-700 transition-colors whitespace-nowrap"
                onClick={e => e.stopPropagation()}
              >
                ⬇ Download
              </a>
            </div>
          </div>

          {/* Next */}
          <button
            onClick={e => { e.stopPropagation(); next() }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl font-bold z-10 w-12 h-12 flex items-center justify-center bg-black/30 hover:bg-black/60 transition-colors"
          >
            ›
          </button>

          {/* Keyboard hint */}
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/30 text-xs">
            ← → arrow keys to navigate · Esc to close
          </p>
        </div>
      )}
    </>
  )
}
