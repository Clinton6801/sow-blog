'use client'
import { useState } from 'react'
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  isSameMonth, isSameDay, isToday, isPast, addMonths, subMonths,
} from 'date-fns'

interface Event {
  id: string
  title: string
  description: string | null
  event_date: string
  location: string | null
  category: string
  color: string
  image_url: string | null
}

interface CalendarViewProps {
  events: Event[]
}

function buildGoogleCalendarUrl(event: Event): string {
  const start = new Date(event.event_date)
  // Default to 1-hour event
  const end = new Date(start.getTime() + 60 * 60 * 1000)
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: event.description || '',
    location: event.location || 'Seat of Wisdom Group of Schools, Ibadan',
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export default function CalendarView({ events }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [view, setView] = useState<'calendar' | 'list'>('calendar')

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Pad start to Monday
  const startPad = (monthStart.getDay() + 6) % 7
  const paddedDays: (Date | null)[] = [
    ...Array(startPad).fill(null),
    ...days,
  ]

  function eventsOnDay(day: Date) {
    return events.filter(e => isSameDay(new Date(e.event_date), day))
  }

  const selectedEvents = selectedDay ? eventsOnDay(selectedDay) : []
  const upcoming = events.filter(e => !isPast(new Date(e.event_date)))
  const past = events.filter(e => isPast(new Date(e.event_date)))

  return (
    <div>
      {/* View toggle */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex gap-1 border border-gray-200 p-0.5 rounded">
          <button onClick={() => setView('calendar')}
            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors rounded ${
              view === 'calendar' ? 'bg-sow-blue text-white' : 'text-gray-500 hover:text-ink'
            }`}>
            📅 Calendar
          </button>
          <button onClick={() => setView('list')}
            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors rounded ${
              view === 'list' ? 'bg-sow-blue text-white' : 'text-gray-500 hover:text-ink'
            }`}>
            📋 List
          </button>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
          {upcoming.length} upcoming · {past.length} past
        </p>
      </div>

      {view === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar grid */}
          <div className="lg:col-span-2">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-3">
              <button onClick={() => setCurrentMonth(m => subMonths(m, 1))}
                className="w-8 h-8 flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-bold"
                style={{ color: 'var(--text-primary)' }}>
                ‹
              </button>
              <h2 className="font-serif font-black text-lg" style={{ color: 'var(--text-primary)' }}>
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <button onClick={() => setCurrentMonth(m => addMonths(m, 1))}
                className="w-8 h-8 flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-bold"
                style={{ color: 'var(--text-primary)' }}>
                ›
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-1">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                <div key={d} className="text-center text-[10px] font-bold uppercase tracking-wide py-1"
                  style={{ color: 'var(--text-faint)' }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 border-l border-t" style={{ borderColor: 'var(--border-light)' }}>
              {paddedDays.map((day, i) => {
                if (!day) return (
                  <div key={`pad-${i}`} className="border-r border-b min-h-[60px] md:min-h-[80px]"
                    style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-subtle)' }} />
                )
                const dayEvents = eventsOnDay(day)
                const isSelected = selectedDay && isSameDay(day, selectedDay)
                const today = isToday(day)
                const inMonth = isSameMonth(day, currentMonth)

                return (
                  <div key={day.toISOString()}
                    onClick={() => setSelectedDay(isSameDay(day, selectedDay || new Date(0)) ? null : day)}
                    className="border-r border-b min-h-[60px] md:min-h-[80px] p-1 cursor-pointer transition-colors"
                    style={{
                      borderColor: 'var(--border-light)',
                      backgroundColor: isSelected ? 'var(--sow-blue)' : today ? 'var(--bg-subtle)' : 'var(--bg-surface)',
                      opacity: inMonth ? 1 : 0.3,
                    }}>
                    <div className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full mb-1 ${
                      today && !isSelected ? 'bg-sow-gold text-ink' : ''
                    }`}
                      style={{ color: isSelected ? 'white' : 'var(--text-primary)' }}>
                      {format(day, 'd')}
                    </div>
                    <div className="space-y-0.5">
                      {dayEvents.slice(0, 2).map(e => (
                        <div key={e.id}
                          className="text-[9px] font-bold px-1 py-0.5 truncate text-white leading-tight"
                          style={{ backgroundColor: e.color || '#1e3a8a' }}>
                          {e.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-[9px] font-bold" style={{ color: isSelected ? 'white' : 'var(--text-faint)' }}>
                          +{dayEvents.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <p className="text-[10px] mt-2" style={{ color: 'var(--text-faint)' }}>
              Click a day to see events. Today is highlighted in gold.
            </p>
          </div>

          {/* Selected day / upcoming panel */}
          <div>
            {selectedDay && selectedEvents.length > 0 ? (
              <div>
                <h3 className="font-serif font-black text-base mb-3" style={{ color: 'var(--text-primary)' }}>
                  {format(selectedDay, 'EEEE, MMMM d')}
                </h3>
                <div className="space-y-3">
                  {selectedEvents.map(e => (
                    <EventCard key={e.id} event={e} />
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-serif font-black text-base mb-3" style={{ color: 'var(--text-primary)' }}>
                  Upcoming Events
                </h3>
                {upcoming.length === 0 ? (
                  <p className="text-sm italic" style={{ color: 'var(--text-faint)' }}>No upcoming events.</p>
                ) : (
                  <div className="space-y-3">
                    {upcoming.slice(0, 5).map(e => (
                      <EventCard key={e.id} event={e} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* List view */
        <div className="space-y-8">
          {upcoming.length > 0 && (
            <section>
              <div className="section-heading section-gold mb-4">
                <span className="section-heading-label">Upcoming ({upcoming.length})</span>
                <div className="section-heading-rule" />
              </div>
              <div className="space-y-3">
                {upcoming.map(e => <EventCard key={e.id} event={e} expanded />)}
              </div>
            </section>
          )}
          {past.length > 0 && (
            <section className="opacity-60">
              <div className="section-heading section-default mb-4">
                <span className="section-heading-label">Past Events</span>
                <div className="section-heading-rule" />
              </div>
              <div className="space-y-2">
                {past.slice(0, 10).map(e => (
                  <div key={e.id} className="flex items-center gap-3 py-2 border-b"
                    style={{ borderColor: 'var(--border-light)' }}>
                    <div className="w-2 h-6 flex-shrink-0 rounded" style={{ backgroundColor: e.color }} />
                    <span className="text-xs font-bold w-16 flex-shrink-0" style={{ color: 'var(--text-faint)' }}>
                      {format(new Date(e.event_date), 'MMM d')}
                    </span>
                    <span className="text-sm line-through flex-1" style={{ color: 'var(--text-faint)' }}>{e.title}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
          {events.length === 0 && (
            <div className="text-center py-16" style={{ color: 'var(--text-faint)' }}>
              <p className="text-5xl mb-4">📅</p>
              <p className="italic">No events scheduled yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function EventCard({ event, expanded = false }: { event: Event; expanded?: boolean }) {
  const gcUrl = buildGoogleCalendarUrl(event)
  const isPastEvent = isPast(new Date(event.event_date))

  return (
    <div className="border overflow-hidden" style={{ borderColor: 'var(--border-light)', borderLeft: `4px solid ${event.color}` }}>
      <div className="p-3" style={{ backgroundColor: 'var(--bg-surface)' }}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm leading-snug" style={{ color: 'var(--text-primary)' }}>{event.title}</p>
            <div className="flex flex-wrap gap-2 mt-1 text-[10px] uppercase tracking-wide" style={{ color: 'var(--text-faint)' }}>
              <span>{format(new Date(event.event_date), 'EEE, MMM d yyyy')}</span>
              {event.location && <span>📍 {event.location}</span>}
            </div>
            {expanded && event.description && (
              <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {event.description}
              </p>
            )}
          </div>
          <span className="text-[9px] tracking-[1px] uppercase font-bold px-2 py-1 text-white flex-shrink-0"
            style={{ backgroundColor: event.color }}>
            {event.category}
          </span>
        </div>

        {/* Add to calendar — only for upcoming */}
        {!isPastEvent && (
          <div className="mt-2 flex gap-2 flex-wrap">
            <a href={gcUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-1 border transition-colors hover:bg-sow-blue hover:text-white hover:border-sow-blue"
              style={{ borderColor: 'var(--border-medium)', color: 'var(--text-secondary)' }}>
              📅 Add to Google Calendar
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
