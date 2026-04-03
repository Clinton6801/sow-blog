'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { format } from 'date-fns'

interface Photo {
  id: string
  title: string
  description: string | null
  image_url: string
  event_name: string | null
  taken_at: string | null
  uploaded_by: string
  created_at: string
}

export default function GalleryManager({ initialPhotos }: { initialPhotos: Photo[] }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [photos, setPhotos] = useState(initialPhotos)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '', description: '', image_url: '', event_name: '', taken_at: '', uploaded_by: 'Admin',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (res.ok) setForm(f => ({ ...f, image_url: data.url }))
      else setError(data.error || 'Upload failed.')
    } catch { setError('Upload failed.') }
    finally { setUploading(false) }
  }

  async function handleAdd() {
    if (!form.title || !form.image_url) { setError('Title and image are required.'); return }
    setLoading('add')
    setError('')
    const res = await fetch('/api/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setForm({ title: '', description: '', image_url: '', event_name: '', taken_at: '', uploaded_by: 'Admin' })
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error || 'Failed to add photo.')
    }
    setLoading(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this photo?')) return
    setLoading(id)
    await fetch(`/api/gallery/${id}`, { method: 'DELETE' })
    setPhotos(prev => prev.filter(p => p.id !== id))
    setLoading(null)
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Add photo form */}
      <div className="border-2 border-sow-purple p-5">
        <h2 className="text-[10px] tracking-[2px] uppercase font-bold mb-4 text-sow-purple">Add New Photo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Title *</label>
              <input name="title" value={form.title} onChange={handleChange}
                placeholder="e.g. Sports Day 2026"
                className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sow-purple" />
            </div>
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Event Name</label>
              <input name="event_name" value={form.event_name} onChange={handleChange}
                placeholder="e.g. Inter-House Sports"
                className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sow-purple" />
            </div>
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Date Taken</label>
              <input name="taken_at" type="date" value={form.taken_at} onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sow-purple" />
            </div>
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Photographer</label>
              <input name="uploaded_by" value={form.uploaded_by} onChange={handleChange}
                placeholder="Admin"
                className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sow-purple" />
            </div>
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange as any} rows={2}
                placeholder="Brief caption for this photo"
                className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sow-purple resize-none" />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-[10px] tracking-[2px] uppercase font-bold">Photo *</label>
            {form.image_url && (
              <div className="relative aspect-video bg-gray-100 overflow-hidden">
                <Image src={form.image_url} alt="Preview" fill className="object-cover" />
                <button type="button" onClick={() => setForm(f => ({ ...f, image_url: '' }))}
                  className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 font-bold hover:bg-red-700">
                  Remove
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                className="btn-outline text-xs px-3 py-2 disabled:opacity-50 border-sow-purple text-sow-purple hover:bg-sow-purple hover:text-white">
                {uploading ? 'Uploading...' : '↑ Upload'}
              </button>
              <input type="url" name="image_url" value={form.image_url} onChange={handleChange}
                placeholder="Or paste image URL"
                className="flex-1 border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sow-purple" />
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
          </div>
        </div>

        {error && <p className="text-red-600 text-sm mt-3 border border-red-100 bg-red-50 px-3 py-2">{error}</p>}

        <div className="mt-4 flex justify-end">
          <button onClick={handleAdd} disabled={loading === 'add' || uploading}
            className="btn-primary disabled:opacity-50" style={{ backgroundColor: '#7c3aed' }}>
            {loading === 'add' ? 'Adding...' : '+ Add Photo'}
          </button>
        </div>
      </div>

      {/* Photo grid */}
      <div>
        <h2 className="text-[10px] tracking-[2px] uppercase font-bold mb-3 pb-2 border-b border-gray-200">
          Gallery Photos ({photos.length})
        </h2>
        {photos.length === 0 ? (
          <p className="text-gray-400 italic text-sm">No photos yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {photos.map(photo => (
              <div key={photo.id} className="group relative border border-gray-200 overflow-hidden">
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  <Image src={photo.image_url} alt={photo.title} fill className="object-cover" />
                </div>
                <div className="p-2 bg-white">
                  <p className="text-xs font-bold line-clamp-1">{photo.title}</p>
                  {photo.event_name && <p className="text-[10px] text-gray-400">{photo.event_name}</p>}
                  {photo.taken_at && (
                    <p className="text-[10px] text-gray-400">{format(new Date(photo.taken_at), 'MMM d, yyyy')}</p>
                  )}
                </div>
                <button onClick={() => handleDelete(photo.id)} disabled={loading === photo.id}
                  className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 disabled:opacity-40">
                  {loading === photo.id ? '...' : 'Delete'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
