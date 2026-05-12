import Masthead from '@/components/layout/Masthead'
import Footer from '@/components/layout/Footer'
import CalendarGrid from './CalendarGrid'
import { supabase } from '@/lib/supabase'
import { format, isPast } from 'date-fns'

export const revalidate = 60

function buildGoogleCalendarUrl(event: any): string {
  const start = new Date(event.event_date)
  const end   = new Date(start.getTime() + 2 * 60 * 60 * 1000)
  const fmt   = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const params = new URLSearchParams({
    action:   'TEMPLATE',
    text:     event.title,
    dates:    `${fmt(start)}/${fmt(end)}`,
    details:  event.description || '',
    location: event.location || 'Seat of Wisdom Group of Schools, Ibadan',
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export default async function EventsPage() {
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: true })

  const all      = events || []
  const upcoming = all.filter(e => !isPast(new Date(e.event_date)))
  const past     = all.filter(e =>  isPast(new Date(e.event_date)))

  return (
    <>
      <Masthead />
      <div className="h-1.5 bg-sow-gold" />
      <main className="max-w-6xl mx-auto px-4 py-8">

        <div className="border-b-2 border-sow-gold pb-4 mb-8">
          <span className="category-badge badge-events mb-2 inline-block">Calendar</span>
          <h1 className="font-serif text-5xl font-black" style={{ color: 'var(--text-primary)' }}>
            School Events
          </h1>
          <p className="font-serif italic mt-1" style={{ color: 'var(--text-muted)' }}>
            Stay up to date with what's happening at SOW Schools
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: upcoming list */}
          <div className="lg:col-span-1 space-y-6">
            <section>
              <div className="section-heading section-gold mb-4">
                <span className="section-heading-label">Upcoming ({upcoming.length})</span>
                <div className="section-heading-rule" />
              </div>

              {upcoming.length === 0 ? (
                <p className="text-sm italic" style={{ color: 'var(--text-faint)' }}>
                  No upcoming events scheduled.
                </p>
              ) : (
                <div className="space-y-3">
                  {upcoming.map((event: any) => (
                    <div key={event.id}
                      className="border overflow-hidden hover:shadow-sm transition-shadow group"
                      style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-surface)' }}>
                      <div className="flex">
                        {/* Date block */}
                        <div className="flex-shrink-0 w-14 flex flex-col items-center justify-center text-white py-3 px-1"
                          style={{ backgroundColor: event.color || '#1e3a8a' }}>
                          <span className="text-xl font-black font-serif leading-none">
                            {format(new Date(event.event_date), 'd')}
                          </span>
                          <span className="text-[9px] uppercase tracking-wider mt-0.5">
                            {format(new Date(event.event_date), 'MMM')}
                          </span>
                        </div>
                        {/* Content */}
                        <div className="flex-1 px-3 py-2.5 min-w-0">
                          <h3 className="font-serif font-bold text-sm leading-snug group-hover:text-sow-blue transition-colors"
                            style={{ color: 'var(--text-primary)' }}>
                            {event.title}
                          </h3>
                          <div className="flex flex-wrap gap-2 mt-0.5 text-[10px] uppercase tracking-wide"
                            style={{ color: 'var(--text-faint)' }}>
                            {event.location && <span>📍 {event.location}</span>}
                            {event.campus && <span>🏫 {event.campus}</span>}
                          </div>
                          <a href={buildGoogleCalendarUrl(event)} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-1.5 text-[9px] tracking-[1px] uppercase font-bold hover:underline"
                            style={{ color: event.color || '#1e3a8a' }}>
                            + Save to Calendar
                          </a>
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
                <div className="section-heading section-default mb-3">
                  <span className="section-heading-label">Past Events</span>
                  <div className="section-heading-rule" />
                </div>
                <div className="space-y-1.5 opacity-60">
                  {past.slice(0, 6).map((event: any) => (
                    <div key={event.id} className="flex items-center gap-3 py-2 border-b"
                      style={{ borderColor: 'var(--border-light)' }}>
                      <div className="w-1.5 h-5 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: event.color || '#888' }} />
                      <span className="text-xs font-bold w-12 flex-shrink-0"
                        style={{ color: 'var(--text-faint)' }}>
                        {format(new Date(event.event_date), 'MMM d')}
                      </span>
                      <span className="text-xs line-through flex-1 truncate"
                        style={{ color: 'var(--text-faint)' }}>
                        {event.title}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right: calendar grid */}
          <div className="lg:col-span-2">
            <div className="section-heading section-gold mb-4">
              <span className="section-heading-label">Monthly View</span>
              <div className="section-heading-rule" />
            </div>
            <CalendarGrid events={all} />
            <p className="text-[10px] mt-3 italic" style={{ color: 'var(--text-faint)' }}>
              Click any event on the calendar to view details and save to Google Calendar.
            </p>
          </div>
        </div>

        {all.length === 0 && (
          <div className="text-center py-16" style={{ color: 'var(--text-faint)' }}>
            <p className="text-5xl mb-4">📅</p>
            <p className="italic">No events scheduled yet. Check back soon!</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
