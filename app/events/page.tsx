import Masthead from '@/components/layout/Masthead'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { format, isPast } from 'date-fns'

export const revalidate = 60

export default async function EventsPage() {
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: true })

  const upcoming = events?.filter(e => !isPast(new Date(e.event_date))) || []
  const past     = events?.filter(e =>  isPast(new Date(e.event_date))) || []

  return (
    <>
      <Masthead />
      <div className="h-1.5 bg-sow-gold" />
      <main className="max-w-6xl mx-auto px-4 py-8">

        <div className="border-b-2 border-sow-gold pb-4 mb-8">
          <span className="category-badge badge-events mb-2 inline-block">Calendar</span>
          <h1 className="font-serif text-5xl font-black text-sow-blue">School Events</h1>
          <p className="text-gray-500 italic mt-1">Stay up to date with what's happening at SOW Schools</p>
        </div>

        {/* Upcoming */}
        <section className="mb-10">
          <div className="section-heading section-gold mb-4">
            <span className="section-heading-label">Upcoming Events ({upcoming.length})</span>
            <div className="section-heading-rule" />
          </div>

          {upcoming.length === 0 ? (
            <p className="text-gray-400 italic">No upcoming events scheduled.</p>
          ) : (
            <div className="space-y-4">
              {upcoming.map((event: any) => (
                <div key={event.id}
                  className="border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group bg-white">
                  <div className="flex flex-col sm:flex-row">

                    {/* Event image */}
                    {event.image_url && (
                      <div className="sm:w-56 w-full flex-shrink-0 overflow-hidden bg-gray-100 relative">
                        <div className="aspect-video sm:aspect-auto sm:h-full relative">
                          <Image
                            src={event.image_url}
                            alt={event.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex flex-1 min-w-0">
                      {/* Colour date block */}
                      <div
                        className="flex-shrink-0 w-16 sm:w-20 flex flex-col items-center justify-center text-white py-4 px-2"
                        style={{ backgroundColor: event.color || '#1e3a8a' }}>
                        <span className="text-2xl sm:text-3xl font-black font-serif leading-none">
                          {format(new Date(event.event_date), 'd')}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider mt-0.5">
                          {format(new Date(event.event_date), 'MMM')}
                        </span>
                        <span className="text-[9px] opacity-70">
                          {format(new Date(event.event_date), 'yyyy')}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 px-4 py-4 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-serif font-bold text-lg leading-snug group-hover:text-sow-blue transition-colors">
                              {event.title}
                            </h3>
                            {event.description && (
                              <p className="text-sm text-gray-600 mt-1 leading-relaxed line-clamp-2">
                                {event.description}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-3 mt-2 text-[10px] text-gray-400 uppercase tracking-wide">
                              {event.location && <span>📍 {event.location}</span>}
                              <span>🏷 {event.category}</span>
                            </div>
                          </div>
                          <span
                            className="text-[9px] tracking-[1px] uppercase font-bold px-2 py-1 text-white flex-shrink-0 hidden sm:inline"
                            style={{ backgroundColor: event.color || '#1e3a8a' }}>
                            {event.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past events */}
        {past.length > 0 && (
          <section>
            <div className="section-heading section-default mb-4">
              <span className="section-heading-label">Past Events</span>
              <div className="section-heading-rule" />
            </div>
            <div className="space-y-2 opacity-60">
              {past.slice(0, 8).map((event: any) => (
                <div key={event.id}
                  className="flex items-center gap-4 py-3 border-b border-gray-100">
                  {/* Small image thumbnail if available */}
                  {event.image_url && (
                    <div className="w-10 h-10 flex-shrink-0 overflow-hidden bg-gray-200 relative">
                      <Image src={event.image_url} alt={event.title} fill className="object-cover" />
                    </div>
                  )}
                  <div
                    className="w-2 h-8 flex-shrink-0 rounded"
                    style={{ backgroundColor: event.color || '#888' }} />
                  <span className="text-sm font-bold text-gray-400 w-16 flex-shrink-0">
                    {format(new Date(event.event_date), 'MMM d')}
                  </span>
                  <span className="text-sm text-gray-400 line-through flex-1 min-w-0 truncate">
                    {event.title}
                  </span>
                  {event.location && (
                    <span className="text-xs text-gray-300 hidden sm:block">{event.location}</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {(!events || events.length === 0) && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-4">📅</p>
            <p className="italic">No events scheduled yet. Check back soon!</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
