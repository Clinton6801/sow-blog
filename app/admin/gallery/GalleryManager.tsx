'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { format } from 'date-fns'

interface Photo {
  id: string; title: string; description: string | null
  image_url: string; event_name: string | null; taken_at: string | null
  uploaded_by: string; created_at: string; event_id: string | null
}
interface GalleryEvent {
  id: string; name: string; slug: string; description: string | null
  event_date: string | null; cover_url: string | null; created_at: string
}

function slugify(t: string) {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now()
}

export default function GalleryManager({ initialPhotos, initialEvents }: { initialPhotos: Photo[]; initialEvents: GalleryEvent[] }) {
  const router = useRouter()
  const filesRef = useRef<HTMLInputElement>(null)
  const [photos, setPhotos] = useState(initialPhotos)
  const [events, setEvents] = useState(initialEvents)
  const [tab, setTab] = useState<'events' | 'photos'>('events')

  // Event form
  const [eventForm, setEventForm] = useState({ name: '', description: '', event_date: '' })
  const [creatingEvent, setCreatingEvent] = useState(false)

  // Photo upload state
  const [selectedEvent, setSelectedEvent] = useState('')
  const [uploadQueue, setUploadQueue] = useState<{ file: File; preview: string; title: string; progress: string }[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')

  // Create event
  async function createEvent() {
    if (!eventForm.name.trim()) { setError('Event name is required.'); return }
    setCreatingEvent(true)
    const res = await fetch('/api/admin/gallery/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...eventForm, slug: slugify(eventForm.name) }),
    })
    if (res.ok) {
      const ev = await res.json()
      setEvents(prev => [ev, ...prev])
      setEventForm({ name: '', description: '', event_date: '' })
      setError('')
      router.refresh()
    } else {
      const d = await res.json()
      setError(d.error || 'Failed to create event.')
    }
    setCreatingEvent(false)
  }

  // Select files for upload
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    const items = files.map(f => ({
      file: f,
      preview: URL.createObjectURL(f),
      title: f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
      progress: 'pending',
    }))
    setUploadQueue(prev => [...prev, ...items])
    e.target.value = ''
  }

  function updateTitle(idx: number, title: string) {
    setUploadQueue(prev => prev.map((item, i) => i === idx ? { ...item, title } : item))
  }

  function removeFromQueue(idx: number) {
    setUploadQueue(prev => prev.filter((_, i) => i !== idx))
  }

  // Upload all queued photos
  async function uploadAll() {
    if (!uploadQueue.length) return
    setUploading(true)
    setError('')

    for (let i = 0; i < uploadQueue.length; i++) {
      const item = uploadQueue[i]
      setUploadQueue(prev => prev.map((x, idx) => idx === i ? { ...x, progress: 'uploading' } : x))

      try {
        const formData = new FormData()
        formData.append('file', item.file)
        const uploadRes = await fetch('/api/admin/upload', { method: 'POST', body: formData })
        const uploadData = await uploadRes.json()

        if (!uploadRes.ok) throw new Error(uploadData.error)

        const photoRes = await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: item.title,
            image_url: uploadData.url,
            event_id: selectedEvent || null,
            event_name: events.find(e => e.id === selectedEvent)?.name || null,
            uploaded_by: 'Admin',
          }),
        })

        if (!photoRes.ok) throw new Error('Failed to save photo.')

        const newPhoto = await photoRes.json()
        setPhotos(prev => [newPhoto, ...prev])
        setUploadQueue(prev => prev.map((x, idx) => idx === i ? { ...x, progress: 'done' } : x))
      } catch (err: any) {
        setUploadQueue(prev => prev.map((x, idx) => idx === i ? { ...x, progress: 'error' } : x))
      }
    }

    setUploading(false)
    setTimeout(() => setUploadQueue([]), 1500)
    router.refresh()
  }

  async function deletePhoto(id: string) {
    if (!confirm('Delete this photo?')) return
    setLoading(id)
    await fetch(`/api/gallery/${id}`, { method: 'DELETE' })
    setPhotos(prev => prev.filter(p => p.id !== id))
    setLoading(null)
  }

  async function deleteEvent(id: string) {
    if (!confirm('Delete this event and all its photos?')) return
    setLoading('ev-' + id)
    await fetch(`/api/admin/gallery/events/${id}`, { method: 'DELETE' })
    setEvents(prev => prev.filter(e => e.id !== id))
    setLoading(null)
  }

  return (
    <div className="max-w-5xl space-y-6">
      {/* Tabs */}
      <div className="flex border-b-2 border-sow-purple">
        {(['events', 'photos'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-bold tracking-wide capitalize transition-colors ${tab === t ? 'bg-sow-purple text-white' : 'text-gray-500 hover:text-sow-purple'}`}>
            {t === 'events' ? '📁 Event Albums' : '🖼 All Photos'}
          </button>
        ))}
      </div>

      {/* ── EVENT ALBUMS TAB ── */}
      {tab === 'events' && (
        <div className="space-y-6">
          {/* Create event */}
          <div className="border-2 border-sow-purple p-5">
            <h2 className="text-[10px] tracking-[2px] uppercase font-bold mb-4 text-sow-purple">Create New Album</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Album Name *</label>
                <input value={eventForm.name} onChange={e => setEventForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Sports Day 2026"
                  className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sow-purple" />
              </div>
              <div>
                <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Event Date</label>
                <input type="date" value={eventForm.event_date} onChange={e => setEventForm(f => ({ ...f, event_date: e.target.value }))}
                  className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sow-purple" />
              </div>
              <div className="md:col-span-3">
                <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Description</label>
                <input value={eventForm.description} onChange={e => setEventForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description of the event"
                  className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sow-purple" />
              </div>
            </div>
            {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
            <div className="mt-3 flex justify-end">
              <button onClick={createEvent} disabled={creatingEvent}
                className="bg-sow-purple text-white text-[10px] tracking-[2px] uppercase font-bold px-4 py-2 hover:bg-purple-800 transition-colors disabled:opacity-50">
                {creatingEvent ? 'Creating...' : '+ Create Album'}
              </button>
            </div>
          </div>

          {/* Existing events */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map(ev => {
              const evPhotos = photos.filter(p => p.event_id === ev.id)
              return (
                <div key={ev.id} className="border border-gray-200 overflow-hidden group">
                  <div className="p-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold">{ev.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {evPhotos.length} photo{evPhotos.length !== 1 ? 's' : ''}
                        {ev.event_date && <> · {format(new Date(ev.event_date), 'MMM d, yyyy')}</>}
                      </p>
                      {ev.description && <p className="text-xs text-gray-500 mt-1">{ev.description}</p>}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <a href={`/gallery/${ev.slug}`} target="_blank"
                        className="text-xs text-sow-blue font-bold hover:underline">View</a>
                      <button onClick={() => deleteEvent(ev.id)} disabled={loading === 'ev-' + ev.id}
                        className="text-xs text-red-400 hover:text-red-600 font-bold opacity-0 group-hover:opacity-100 transition-all disabled:opacity-40">
                        Delete
                      </button>
                    </div>
                  </div>
                  {/* Mini photo strip */}
                  {evPhotos.length > 0 && (
                    <div className="flex gap-1 px-4 pb-3 overflow-x-auto">
                      {evPhotos.slice(0, 6).map(p => (
                        <div key={p.id} className="w-12 h-12 flex-shrink-0 overflow-hidden bg-gray-100">
                          <Image src={p.image_url} alt={p.title} width={48} height={48} className="object-cover w-full h-full" />
                        </div>
                      ))}
                      {evPhotos.length > 6 && (
                        <div className="w-12 h-12 flex-shrink-0 bg-gray-100 flex items-center justify-center text-xs text-gray-400 font-bold">
                          +{evPhotos.length - 6}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
            {events.length === 0 && <p className="text-gray-400 italic text-sm col-span-2">No albums yet.</p>}
          </div>
        </div>
      )}

      {/* ── PHOTOS TAB ── */}
      {tab === 'photos' && (
        <div className="space-y-6">
          {/* Upload section */}
          <div className="border-2 border-sow-purple p-5">
            <h2 className="text-[10px] tracking-[2px] uppercase font-bold mb-4 text-sow-purple">Upload Photos</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Add to Album (optional)</label>
                <select value={selectedEvent} onChange={e => setSelectedEvent(e.target.value)}
                  className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sow-purple bg-white">
                  <option value="">No album (standalone)</option>
                  {events.map(ev => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <button onClick={() => filesRef.current?.click()}
                  className="border-2 border-dashed border-sow-purple text-sow-purple text-sm font-bold px-4 py-2 hover:bg-sow-purple hover:text-white transition-colors w-full">
                  📷 Select Photos (multiple)
                </button>
                <input ref={filesRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
              </div>
            </div>

            {/* Upload queue */}
            {uploadQueue.length > 0 && (
              <div className="space-y-2 mb-4 max-h-64 overflow-y-auto pr-1">
                {uploadQueue.map((item, i) => (
                  <div key={i} className={`flex items-center gap-3 p-2 border rounded ${
                    item.progress === 'done' ? 'border-green-200 bg-green-50' :
                    item.progress === 'error' ? 'border-red-200 bg-red-50' :
                    item.progress === 'uploading' ? 'border-blue-200 bg-blue-50' :
                    'border-gray-200'
                  }`}>
                    <div className="w-10 h-10 flex-shrink-0 overflow-hidden rounded">
                      <img src={item.preview} alt="" className="w-full h-full object-cover" />
                    </div>
                    <input value={item.title} onChange={e => updateTitle(i, e.target.value)}
                      className="flex-1 border border-gray-200 px-2 py-1 text-xs outline-none focus:border-sow-purple rounded" />
                    <span className="text-xs flex-shrink-0 font-bold">
                      {item.progress === 'done' ? '✅' :
                       item.progress === 'error' ? '❌' :
                       item.progress === 'uploading' ? '⏳' : '⏸'}
                    </span>
                    {item.progress === 'pending' && (
                      <button onClick={() => removeFromQueue(i)} className="text-red-400 text-xs font-bold hover:text-red-600">×</button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {uploadQueue.length > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">{uploadQueue.length} photo{uploadQueue.length !== 1 ? 's' : ''} queued · Edit titles before uploading</p>
                <button onClick={uploadAll} disabled={uploading}
                  className="bg-sow-purple text-white text-[10px] tracking-[2px] uppercase font-bold px-5 py-2 hover:bg-purple-800 transition-colors disabled:opacity-50">
                  {uploading ? 'Uploading...' : `⬆ Upload All (${uploadQueue.length})`}
                </button>
              </div>
            )}
          </div>

          {/* All photos grid */}
          <div>
            <h2 className="text-[10px] tracking-[2px] uppercase font-bold mb-3 pb-2 border-b border-gray-200">
              All Photos ({photos.length})
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {photos.map(photo => (
                <div key={photo.id} className="group relative border border-gray-200 overflow-hidden">
                  <div className="aspect-square relative overflow-hidden bg-gray-100">
                    <Image src={photo.image_url} alt={photo.title} fill className="object-cover" />
                  </div>
                  <div className="p-1.5 bg-white">
                    <p className="text-[10px] font-bold line-clamp-1">{photo.title}</p>
                    {photo.event_id && (
                      <p className="text-[9px] text-sow-purple">📁 {events.find(e => e.id === photo.event_id)?.name || 'Album'}</p>
                    )}
                  </div>
                  <button onClick={() => deletePhoto(photo.id)} disabled={loading === photo.id}
                    className="absolute top-1 right-1 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 disabled:opacity-40">
                    {loading === photo.id ? '...' : '✕'}
                  </button>
                </div>
              ))}
              {photos.length === 0 && <p className="text-gray-400 italic text-sm col-span-5">No photos yet.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
