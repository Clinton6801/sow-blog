'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { format, isPast } from 'date-fns'
import Image from 'next/image'

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

const colorOptions = [
  { label: 'Blue (News)',      value: '#1e3a8a' },
  { label: 'Red (Sports)',     value: '#dc2626' },
  { label: 'Green (Academic)', value: '#16a34a' },
  { label: 'Purple (Arts)',    value: '#7c3aed' },
  { label: 'Teal (Opinion)',   value: '#0891b2' },
  { label: 'Gold (Events)',    value: '#f59e0b' },
]

export default function EventsManager({ initialEvents }: { initialEvents: Event[] }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [events, setEvents] = useState(initialEvents)
  const [loading, setLoading] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '', description: '', event_date: '',
    location: '', category: 'General', color: '#1e3a8a', image_url: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (res.ok) setForm(f => ({ ...f, image_url: data.url }))
      else setError(data.error || 'Upload failed.')
    } catch { setError('Upload failed.') }
    finally { setUploading(false) }
    e.target.value = ''
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
      setEvents(prev => [...prev, newEvent].sort((a, b) =>
        new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
      ))
      setForm({ title: '', description: '', event_date: '', location: '', category: 'General', color: '#1e3a8a', image_url: '' })
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
  const past     = events.filter(e =>  isPast(new Date(e.event_date)))

  return (
    <div className="max-w-3xl space-y-6">

      {/* ── ADD FORM ── */}
      <div className="border-2 border-sow-gold p-5">
        <h2 className="text-[10px] tracking-[2px] uppercase font-bold mb-4 text-amber-600">Add New Event</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left column */}
          <div className="space-y-3">
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
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange as any}
                rows={2} placeholder="Brief description of the event"
                className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sow-gold resize-none" />
            </div>
          </div>

          {/* Right column — colour + image */}
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Colour</label>
              <div className="flex items-center gap-2">
                <select name="color" value={form.color} onChange={handleChange}
                  className="flex-1 border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sow-gold bg-white">
                  {colorOptions.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <div className="w-8 h-8 rounded flex-shrink-0 border border-gray-200"
                  style={{ backgroundColor: form.color }} />
              </div>
            </div>

            <div>
              <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Event Image</label>

              {/* Preview */}
              {form.image_url ? (
                <div className="relative aspect-video overflow-hidden bg-gray-100 border border-gray-200 mb-2">
                  <Image src={form.image_url} alt="Event preview" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, image_url: '' }))}
                    className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 hover:bg-red-700">
                    Remove
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 hover:border-sow-gold transition-colors cursor-pointer p-6 text-center mb-2">
                  <p className="text-2xl mb-1">🖼</p>
                  <p className="text-xs text-gray-400">
                    {uploading ? 'Uploading...' : 'Click to upload event image'}
                  </p>
                  <p className="text-[10px] text-gray-300 mt-1">JPEG, PNG, WebP · Max 5MB</p>
                </div>
              )}

              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleImageUpload}
              />

              {/* Or paste URL */}
              <div>
                <label className="block text-[10px] text-gray-400 mb-1">Or paste image URL</label>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sow-gold" />
              </div>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-red-600 text-sm mt-3 bg-red-50 border border-red-200 px-3 py-2">{error}</p>
        )}
        <div className="mt-4 flex justify-end">
          <button onClick={handleAdd} disabled={loading === 'add'}
            className="bg-sow-gold text-ink text-sm tracking-widest uppercase font-bold px-5 py-2 hover:bg-amber-400 transition-colors disabled:opacity-50">
            {loading === 'add' ? 'Adding...' : '+ Add Event'}
          </button>
        </div>
      </div>

      {/* ── EVENTS LIST ── */}
      <div>
        <h2 className="text-[10px] tracking-[2px] uppercase font-bold mb-3 pb-2 border-b border-gray-200">
          Upcoming ({upcoming.length}) &nbsp;·&nbsp; Past ({past.length})
        </h2>
        <div className="space-y-3">
          {[...upcoming, ...past].map(event => (
            <div key={event.id}
              className={`flex gap-4 border rounded overflow-hidden group transition-all ${
                isPast(new Date(event.event_date)) ? 'opacity-50 bg-gray-50 border-gray-100' : 'bg-white border-gray-200'
              }`}>

              {/* Event image (if any) */}
              {event.image_url ? (
                <div className="w-24 h-20 flex-shrink-0 overflow-hidden bg-gray-100 relative">
                  <Image src={event.image_url} alt={event.title} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-3 flex-shrink-0 rounded-l" style={{ backgroundColor: event.color }} />
              )}

              <div className="flex-1 py-3 pr-3 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-bold text-sm leading-snug">{event.title}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">
                      {format(new Date(event.event_date), 'MMM d, yyyy')}
                      {event.location && <> · 📍 {event.location}</>}
                      &nbsp;·&nbsp; {event.category}
                      {isPast(new Date(event.event_date)) && ' · Past'}
                    </p>
                    {event.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{event.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(event.id)}
                    disabled={loading === event.id}
                    className="text-red-400 hover:text-red-600 text-xs font-bold flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all disabled:opacity-40">
                    {loading === event.id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {events.length === 0 && (
            <p className="text-gray-400 italic text-sm">No events yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
