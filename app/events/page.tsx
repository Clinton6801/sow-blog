import Masthead from '@/components/layout/Masthead'
import Footer from '@/components/layout/Footer'
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
          <div className="section-heading section-gold">
            <span className="section-heading-label">Upcoming Events ({upcoming.length})</span>
            <div className="section-heading-rule" />
          </div>

          {upcoming.length === 0 ? (
            <p className="text-gray-400 italic">No upcoming events scheduled.</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((event: any) => (
                <div key={event.id} className="flex gap-0 border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow group">
                  {/* Date block */}
                  <div className="flex-shrink-0 w-20 flex flex-col items-center justify-center text-white py-4"
                    style={{ backgroundColor: event.color || '#1e3a8a' }}>
                    <span className="text-2xl font-black font-serif leading-none">
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
                  <div className="flex-1 px-4 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-serif font-bold text-lg leading-snug group-hover:text-sow-blue transition-colors">
                          {event.title}
                        </h3>
                        {event.description && (
                          <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{event.description}</p>
                        )}
                        <div className="flex gap-3 mt-1.5 text-[10px] text-gray-400 uppercase tracking-wide">
                          {event.location && <span>📍 {event.location}</span>}
                          <span>🏷 {event.category}</span>
                        </div>
                      </div>
                      <span className="text-[9px] tracking-[1px] uppercase font-bold px-2 py-1 text-white flex-shrink-0"
                        style={{ backgroundColor: event.color || '#1e3a8a' }}>
                        {event.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Past */}
        {past.length > 0 && (
          <section>
            <div className="section-heading section-default">
              <span className="section-heading-label">Past Events</span>
              <div className="section-heading-rule" />
            </div>
            <div className="space-y-2 opacity-60">
              {past.slice(0, 5).map((event: any) => (
                <div key={event.id} className="flex items-center gap-4 py-2 border-b border-gray-100">
                  <span className="text-sm font-bold text-gray-400 w-20 flex-shrink-0">
                    {format(new Date(event.event_date), 'MMM d')}
                  </span>
                  <span className="text-sm line-through text-gray-400">{event.title}</span>
                  <span className="text-xs text-gray-300 ml-auto">{event.location}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
