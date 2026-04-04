import Masthead from '@/components/layout/Masthead'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'

export const revalidate = 60

export default async function GalleryPage() {
  // Get all events with photo count
  const { data: events } = await supabase
    .from('gallery_events')
    .select('*, gallery_photos(id, image_url)')
    .order('created_at', { ascending: false })

  // Get standalone photos (no event)
  const { data: standalone } = await supabase
    .from('gallery_photos')
    .select('*')
    .is('event_id', null)
    .order('created_at', { ascending: false })

  return (
    <>
      <Masthead />
      <div className="h-1.5 bg-sow-purple" />
      <main className="max-w-6xl mx-auto px-4 py-8">

        <div className="border-b-2 border-sow-purple pb-4 mb-8">
          <span className="category-badge badge-arts mb-2 inline-block">Gallery</span>
          <h1 className="font-serif text-5xl font-black text-sow-purple">Photo Gallery</h1>
          <p className="text-gray-500 italic mt-1">Moments from Seat of Wisdom Group of Schools</p>
        </div>

        {/* Event albums */}
        {events && events.length > 0 && (
          <section className="mb-10">
            <div className="section-heading section-purple mb-6">
              <span className="section-heading-label">Event Albums</span>
              <div className="section-heading-rule" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((event: any) => {
                const photos = event.gallery_photos || []
                const cover = event.cover_url || photos[0]?.image_url
                return (
                  <Link key={event.id} href={`/gallery/${event.slug}`}
                    className="group block border-2 border-transparent hover:border-sow-purple transition-all overflow-hidden">
                    {/* Cover */}
                    <div className="relative aspect-video bg-gradient-to-br from-sow-blue to-sow-purple overflow-hidden">
                      {cover ? (
                        <Image src={cover} alt={event.name} fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white/30 text-4xl">📷</span>
                        </div>
                      )}
                      {/* Photo count badge */}
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded">
                        {photos.length} photo{photos.length !== 1 ? 's' : ''}
                      </div>
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-sow-purple/0 group-hover:bg-sow-purple/20 transition-colors flex items-center justify-center">
                        <span className="text-white font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity bg-sow-purple px-4 py-2">
                          View Album →
                        </span>
                      </div>
                    </div>
                    {/* Info */}
                    <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-100">
                      <h3 className="font-serif font-black text-base leading-tight group-hover:text-sow-purple transition-colors">
                        {event.name}
                      </h3>
                      <div className="flex items-center justify-between mt-1">
                        {event.event_date && (
                          <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                            {format(new Date(event.event_date), 'MMM d, yyyy')}
                          </p>
                        )}
                        {photos.length > 0 && (
                          <div className="flex -space-x-1">
                            {photos.slice(0, 3).map((p: any, i: number) => (
                              <div key={i} className="w-5 h-5 rounded-full overflow-hidden border border-white">
                                <Image src={p.image_url} alt="" width={20} height={20} className="object-cover" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* Standalone photos */}
        {standalone && standalone.length > 0 && (
          <section>
            <div className="section-heading section-default mb-6">
              <span className="section-heading-label">Other Photos</span>
              <div className="section-heading-rule" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {standalone.map((photo: any) => (
                <a key={photo.id} href={photo.image_url} download target="_blank" rel="noopener noreferrer"
                  className="group relative aspect-square overflow-hidden bg-gray-100 block">
                  <Image src={photo.image_url} alt={photo.title} fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end justify-between p-2 opacity-0 group-hover:opacity-100">
                    <p className="text-white text-xs font-bold line-clamp-1">{photo.title}</p>
                    <span className="text-white text-lg">⬇</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {(!events || events.length === 0) && (!standalone || standalone.length === 0) && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-4">📷</p>
            <p className="italic">No photos yet. Check back soon!</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
