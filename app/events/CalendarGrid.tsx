'use client'
import { useState } from 'react'
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  isSameMonth, isSameDay, isToday, isPast, addMonths, subMonths,
} from 'date-fns'

interface Event {
  id: string
  title: string
  event_date: string
  location: string | null
  category: string
  color: string
  description: string | null
  campus: string | null
}

interface CalendarGridProps {
  events: Event[]
}

function buildGoogleCalendarUrl(event: Event): string {
  const start = new Date(event.event_date)
  const end   = new Date(start.getTime() + 2 * 60 * 60 * 1000) // +2 hours default
  const fmt   = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text:   event.title,
    dates:  `${fmt(start)}/${fmt(end)}`,
    details: event.description || '',
    location: event.location || 'Seat of Wisdom Group of Schools, Ibadan',
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export default function CalendarGrid({ events }: CalendarGridProps) {
  const [current, setCurrent] = useState(new Date())
  const [selected, setSelected] = useState<Event | null>(null)

  const monthStart = startOfMonth(current)
  const monthEnd   = endOfMonth(current)
  const days       = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Pad start so grid aligns to Monday (0=Sun → shift)
  const startPad = (monthStart.getDay() + 6) % 7 // Mon=0
  const paddedDays = [...Array(startPad).fill(null), ...days]

  function eventsOnDay(day: Date) {
    return events.filter(e => isSameDay(new Date(e.event_date), day))
  }

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setCurrent(d => subMonths(d, 1))}
          className="px-3 py-1.5 border-2 border-sow-blue text-sow-blue font-bold text-sm hover:bg-sow-blue hover:text-white transition-colors">
          ← Prev
        </button>
        <h2 className="font-serif text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
          {format(current, 'MMMM yyyy')}
        </h2>
        <button onClick={() => setCurrent(d => addMonths(d, 1))}
          className="px-3 py-1.5 border-2 border-sow-blue text-sow-blue font-bold text-sm hover:bg-sow-blue hover:text-white transition-colors">
          Next →
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
          <div key={d} className="text-center text-[10px] tracking-[2px] uppercase font-bold py-2"
            style={{ color: 'var(--text-faint)' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar cells */}
      <div className="grid grid-cols-7 border-l border-t" style={{ borderColor: 'var(--border-light)' }}>
        {paddedDays.map((day, i) => {
          if (!day) return (
            <div key={`pad-${i}`} className="border-r border-b min-h-[80px] md:min-h-[100px]"
              style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-subtle)' }} />
          )
          const dayEvents = eventsOnDay(day)
          const past = isPast(day) && !isToday(day)
          return (
            <div key={day.toISOString()}
              className="border-r border-b min-h-[80px] md:min-h-[100px] p-1 relative"
              style={{
                borderColor: 'var(--border-light)',
                backgroundColor: isToday(day) ? 'var(--sow-blue)' + '10' : 'var(--bg-surface)',
                opacity: past ? 0.5 : 1,
              }}>
              {/* Day number */}
              <div className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full mb-1 ${
                isToday(day) ? 'bg-sow-blue text-white' : ''
              }`} style={{ color: isToday(day) ? '#fff' : 'var(--text-muted)' }}>
                {format(day, 'd')}
              </div>
              {/* Events */}
              <div className="space-y-0.5">
                {dayEvents.slice(0, 2).map(ev => (
                  <button key={ev.id} onClick={() => setSelected(ev)}
                    className="w-full text-left text-[9px] font-bold px-1 py-0.5 truncate text-white leading-tight rounded-sm hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: ev.color || '#1e3a8a' }}>
                    {ev.title}
                  </button>
                ))}
                {dayEvents.length > 2 && (
                  <button onClick={() => setSelected(dayEvents[2])}
                    className="text-[9px] font-bold w-full text-left px-1"
                    style={{ color: 'var(--text-faint)' }}>
                    +{dayEvents.length - 2} more
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Event detail popup */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => setSelected(null)}>
          <div className="max-w-sm w-full rounded-lg overflow-hidden shadow-2xl"
            style={{ backgroundColor: 'var(--bg-surface)' }}
            onClick={e => e.stopPropagation()}>
            {/* Colour header */}
            <div className="px-5 py-4 text-white" style={{ backgroundColor: selected.color || '#1e3a8a' }}>
              <p className="text-[9px] tracking-[2px] uppercase font-bold opacity-70 mb-1">{selected.category}</p>
              <h3 className="font-serif text-xl font-black leading-tight">{selected.title}</h3>
              <p className="text-sm opacity-80 mt-1">
                📅 {format(new Date(selected.event_date), 'EEEE, MMMM d, yyyy')}
              </p>
              {selected.location && <p className="text-sm opacity-80">📍 {selected.location}</p>}
              {selected.campus && <p className="text-sm opacity-80">🏫 {selected.campus}</p>}
            </div>
            <div className="p-5">
              {selected.description && (
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                  {selected.description}
                </p>
              )}
              <div className="flex gap-2 flex-wrap">
                <a href={buildGoogleCalendarUrl(selected)} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white transition-opacity hover:opacity-80"
                  style={{ backgroundColor: selected.color || '#1e3a8a' }}>
                  📅 Add to Google Calendar
                </a>
                <button onClick={() => setSelected(null)}
                  className="px-3 py-2 text-xs font-bold border-2 transition-colors hover:bg-gray-50"
                  style={{ borderColor: 'var(--border-medium)', color: 'var(--text-muted)' }}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
