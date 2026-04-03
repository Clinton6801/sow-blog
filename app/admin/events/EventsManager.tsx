'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format, isPast } from 'date-fns'

interface Event {
  id: string
  title: string
  description: string | null
  event_date: string
  location: string | null
  category: string
  color: string
}

const colorOptions = [
  { label: 'Blue (News)',     value: '#1e3a8a' },
  { label: 'Red (Sports)',    value: '#dc2626' },
  { label: 'Green (Academic)',value: '#16a34a' },
  { label: 'Purple (Arts)',   value: '#7c3aed' },
  { label: 'Teal (Opinion)',  value: '#0891b2' },
  { label: 'Gold (Events)',   value: '#f59e0b' },
]

export default function EventsManager({ initialEvents }: { initialEvents: Event[] }) {
  const router = useRouter()
  const [events, setEvents] = useState(initialEvents)
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '', description: '', event_date: '', location: '', category: 'General', color: '#1e3a8a',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleAdd() {
    if (!form.title || !form.event_date) { setError('Title and date are required.'); return }
    setLoading('add')
    setError('')
    const res = await fetch('/api/admin/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const newEvent = await res.json()
      setEvents(prev => [...prev, newEvent].sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()))
      setForm({ title: '', description: '', event_date: '', location: '', category: 'General', color: '#1e3a8a' })
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error || 'Failed to add event.')
    }
    setLoading(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this event?')) return
    setLoading(id)
    await fetch(`/api/admin/events/${id}`, { method: 'DELETE' })
    setEvents(prev => prev.filter(e => e.id !== id))
    setLoading(null)
  }

  const upcoming = events.filter(e => !isPast(new Date(e.event_date)))
  const past = events.filter(e => isPast(new Date(e.event_date)))

  return (
    <div className="max-w-3xl space-y-6">
      {/* Add form */}
      <div className="border-2 border-sow-gold p-5">
        <h2 className="text-[10px] tracking-[2px] uppercase font-bold mb-4 text-amber-600">Add New Event</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Event Title *</label>
            <input name="title" value={form.title} onChange={handleChange}
              placeholder="e.g. Inter-House Sports Day"
              className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sow-gold" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Date *</label>
            <input name="event_date" type="date" value={form.event_date} onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sow-gold" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Location</label>
            <input name="location" value={form.location} onChange={handleChange}
              placeholder="e.g. School Hall"
              className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sow-gold" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Category</label>
            <input name="category" value={form.category} onChange={handleChange}
              placeholder="e.g. Sports, Academics, Arts"
              className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sow-gold" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange as any} rows={2}
              placeholder="Brief description of the event"
              className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sow-gold resize-none" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Colour</label>
            <select name="color" value={form.color} onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sow-gold">
              {colorOptions.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <div className="w-10 h-10 rounded flex-shrink-0 mr-2" style={{ backgroundColor: form.color }} />
            <span className="text-xs text-gray-400">Preview colour</span>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm mt-3 bg-red-50 border border-red-200 px-3 py-2">{error}</p>}
        <div className="mt-4 flex justify-end">
          <button onClick={handleAdd} disabled={loading === 'add'}
            className="bg-sow-gold text-ink text-sm tracking-widest uppercase font-bold px-4 py-2 hover:bg-amber-400 transition-colors disabled:opacity-50">
            {loading === 'add' ? 'Adding...' : '+ Add Event'}
          </button>
        </div>
      </div>

      {/* Upcoming events */}
      <div>
        <h2 className="text-[10px] tracking-[2px] uppercase font-bold mb-3 pb-2 border-b border-gray-200">
          Upcoming ({upcoming.length}) · Past ({past.length})
        </h2>
        <div className="space-y-2">
          {[...upcoming, ...past].map(event => (
            <div key={event.id}
              className={`flex items-center gap-3 p-3 border rounded group ${isPast(new Date(event.event_date)) ? 'opacity-50 bg-gray-50' : 'bg-white border-gray-200'}`}>
              <div className="w-3 h-10 rounded flex-shrink-0" style={{ backgroundColor: event.color }} />
              <div className="flex-1">
                <p className="font-bold text-sm">{event.title}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                  {format(new Date(event.event_date), 'MMM d, yyyy')}
                  {event.location && <> · 📍 {event.location}</>}
                  · {event.category}
                  {isPast(new Date(event.event_date)) && ' · Past'}
                </p>
              </div>
              <button onClick={() => handleDelete(event.id)} disabled={loading === event.id}
                className="text-red-400 hover:text-red-600 text-xs font-bold opacity-0 group-hover:opacity-100 transition-all disabled:opacity-40">
                {loading === event.id ? '...' : 'Delete'}
              </button>
            </div>
          ))}
          {events.length === 0 && <p className="text-gray-400 italic text-sm">No events yet.</p>}
        </div>
      </div>
    </div>
  )
}
