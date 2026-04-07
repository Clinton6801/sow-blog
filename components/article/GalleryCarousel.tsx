'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface CarouselPhoto {
  id: string
  title: string
  image_url: string
  event_name: string | null
  event_slug?: string | null
}

interface Props {
  photos: CarouselPhoto[]
}

export default function GalleryCarousel({ photos }: Props) {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const go = useCallback((idx: number) => {
    if (transitioning) return
    setTransitioning(true)
    setCurrent((idx + photos.length) % photos.length)
    setTimeout(() => setTransitioning(false), 400)
  }, [photos.length, transitioning])

  const next = useCallback(() => go(current + 1), [current, go])
  const prev = useCallback(() => go(current - 1), [current, go])

  // Auto-advance every 4 seconds
  useEffect(() => {
    if (paused) return
    timerRef.current = setTimeout(next, 4000)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [current, paused, next])

  // Touch swipe
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev()
    touchStartX.current = null
  }

  // Keyboard
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next])

  if (!photos.length) return null

  const photo = photos[current]

  return (
    <section className="my-8">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="bg-sow-purple text-white text-[10px] tracking-[2.5px] uppercase font-black px-3 py-1">
            📷 Photo Highlights
          </span>
          <div className="flex-1 border-t-2 border-sow-purple w-16 hidden sm:block" />
        </div>
        <Link href="/gallery"
          className="text-[10px] tracking-[1.5px] uppercase font-bold text-sow-purple hover:underline whitespace-nowrap">
          Full Gallery →
        </Link>
      </div>

      {/* Carousel */}
      <div
        className="relative overflow-hidden bg-black select-none"
        style={{ aspectRatio: '16/7' }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* All images stacked, only current visible */}
        {photos.map((p, i) => (
          <div
            key={p.id}
            className="absolute inset-0 transition-opacity duration-500"
            style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
          >
            <Image
              src={p.image_url}
              alt={p.title}
              fill
              className="object-cover"
              priority={i === 0}
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          </div>
        ))}

        {/* Caption */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-4 md:p-6">
          <p className="text-white font-serif font-black text-lg md:text-2xl leading-tight drop-shadow-lg line-clamp-2">
            {photo.title}
          </p>
          {photo.event_name && (
            <p className="text-sow-gold text-[10px] tracking-[2px] uppercase font-bold mt-1">
              📷 {photo.event_name}
            </p>
          )}
        </div>

        {/* Prev / Next buttons */}
        <button
          onClick={prev}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-black/40 hover:bg-black/70 text-white flex items-center justify-center text-xl font-bold transition-colors"
          aria-label="Previous"
        >
          ‹
        </button>
        <button
          onClick={next}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 md:w-10 md:h-10 bg-black/40 hover:bg-black/70 text-white flex items-center justify-center text-xl font-bold transition-colors"
          aria-label="Next"
        >
          ›
        </button>

        {/* Pause indicator */}
        {paused && (
          <div className="absolute top-3 right-3 z-10 bg-black/40 text-white text-[9px] tracking-wide uppercase px-2 py-1">
            ⏸ Paused
          </div>
        )}

        {/* Dot indicators */}
        <div className="absolute bottom-3 right-4 z-10 flex gap-1.5 items-center">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current
                  ? 'bg-sow-gold w-5 h-2'
                  : 'bg-white/40 hover:bg-white/70 w-2 h-2'
              }`}
              aria-label={`Go to photo ${i + 1}`}
            />
          ))}
        </div>

        {/* Progress bar */}
        {!paused && (
          <div className="absolute top-0 left-0 right-0 h-0.5 z-10 bg-white/10">
            <div
              key={current}
              className="h-full bg-sow-gold"
              style={{ animation: 'progress-bar 4s linear forwards' }}
            />
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-1.5 mt-1.5 overflow-x-auto pb-1">
        {photos.map((p, i) => (
          <button
            key={p.id}
            onClick={() => go(i)}
            className={`flex-shrink-0 w-14 h-10 overflow-hidden transition-all border-2 ${
              i === current ? 'border-sow-purple opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
            }`}
          >
            <Image src={p.image_url} alt={p.title} width={56} height={40} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </section>
  )
}
