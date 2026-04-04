import { notFound } from 'next/navigation'
import Masthead from '@/components/layout/Masthead'
import Footer from '@/components/layout/Footer'
import GalleryLightbox from './GalleryLightbox'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'
import Link from 'next/link'

interface Props { params: { eventSlug: string } }

export const revalidate = 60

export default async function EventGalleryPage({ params }: Props) {
  const { data: event } = await supabase
    .from('gallery_events')
    .select('*')
    .eq('slug', params.eventSlug)
    .maybeSingle()

  if (!event) notFound()

  const { data: photos } = await supabase
    .from('gallery_photos')
    .select('*')
    .eq('event_id', event.id)
    .order('sort_order', { ascending: true })

  const photoList = photos || []

  return (
    <>
      <Masthead />
      <div className="h-1.5 bg-sow-purple" />
      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <nav className="text-[10px] tracking-[1.5px] uppercase text-gray-400 mb-4">
          <Link href="/gallery" className="hover:text-sow-purple">Gallery</Link>
          <span className="mx-2">›</span>
          <span className="text-sow-purple">{event.name}</span>
        </nav>

        {/* Header */}
        <div className="border-b-2 border-sow-purple pb-4 mb-6">
          <h1 className="font-serif text-4xl font-black text-sow-purple">{event.name}</h1>
          <div className="flex items-center gap-4 mt-1 flex-wrap">
            {event.event_date && (
              <p className="text-gray-500 text-sm">
                📅 {format(new Date(event.event_date), 'MMMM d, yyyy')}
              </p>
            )}
            <p className="text-gray-500 text-sm">📷 {photoList.length} photo{photoList.length !== 1 ? 's' : ''}</p>
          </div>
          {event.description && (
            <p className="text-gray-600 italic mt-2 font-serif">{event.description}</p>
          )}
        </div>

        {/* Download all button */}
        {photoList.length > 0 && (
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <p className="text-sm text-gray-500">Click any photo to view full size. Right-click to save.</p>
            <div className="flex gap-2">
              <a
                href={`/api/gallery/download?event=${event.id}`}
                className="flex items-center gap-2 bg-sow-purple text-white text-[10px] tracking-[2px] uppercase font-bold px-4 py-2 hover:bg-purple-800 transition-colors"
              >
                ⬇ Download All ({photoList.length})
              </a>
            </div>
          </div>
        )}

        {/* Lightbox gallery grid */}
        {photoList.length > 0 ? (
          <GalleryLightbox photos={photoList} eventName={event.name} />
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-4">📷</p>
            <p className="italic">No photos in this album yet.</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
