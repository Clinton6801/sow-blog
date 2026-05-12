'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { format } from 'date-fns'

interface Honour {
  id: string
  student_name: string
  student_class: string
  campus: string | null
  title: string
  description: string | null
  category: string
  achieved_at: string | null
  photo_url: string | null
  featured: boolean
  published: boolean
}

const CATEGORIES = [
  { value: 'exam',        label: '📝 Exam Excellence' },
  { value: 'competition', label: '🏆 Competition Win' },
  { value: 'certificate', label: '📜 Certificate' },
  { value: 'award',       label: '🥇 Award' },
  { value: 'sport',       label: '⚽ Sports Achievement' },
  { value: 'leadership',  label: '👑 Leadership' },
  { value: 'other',       label: '⭐ Other' },
]

const CAMPUSES = ['Main Campus', 'Alexandrite Campus', 'All Campuses']

const emptyForm = {
  student_name: '', student_class: '', campus: '',
  title: '', description: '', category: 'exam',
  achieved_at: '', photo_url: '', featured: false, published: true,
}

export default function HonoursManager({ initialHonours }: { initialHonours: Honour[] }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [honours, setHonours] = useState<Honour[]>(initialHonours)
  const [form, setForm] = useState({ ...emptyForm })
  const [loading, setLoading] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok) setForm(f => ({ ...f, photo_url: data.url }))
      else setError(data.error || 'Upload failed.')
    } catch { setError('Upload failed.') }
    finally { setUploading(false) }
    e.target.value = ''
  }

  async function handleAdd() {
    if (!form.student_name || !form.title) { setError('Student name and title are required.'); return }
    setLoading('add'); setError('')
    const res = await fetch('/api/admin/honours', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const newItem = await res.json()
      setHonours(prev => [newItem, ...prev])
      setForm({ ...emptyForm })
      setShowForm(false)
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error || 'Failed to add.')
    }
    setLoading(null)
  }

  async function toggleFeatured(id: string, featured: boolean) {
    setLoading(id + '-feat')
    await fetch(`/api/admin/honours/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured: !featured }),
    })
    setHonours(prev => prev.map(h => h.id === id ? { ...h, featured: !featured } : h))
    setLoading(null)
  }

  async function togglePublished(id: string, published: boolean) {
    setLoading(id + '-pub')
    await fetch(`/api/admin/honours/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !published }),
    })
    setHonours(prev => prev.map(h => h.id === id ? { ...h, published: !published } : h))
    setLoading(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this achievement?')) return
    setLoading(id + '-del')
    await fetch(`/api/admin/honours/${id}`, { method: 'DELETE' })
    setHonours(prev => prev.filter(h => h.id !== id))
    setLoading(null)
  }

  return (
    <div className="max-w-4xl space-y-6">

      {/* Add button */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">{honours.length} achievements recorded</p>
        <button onClick={() => setShowForm(s => !s)} className="btn-primary text-sm">
          {showForm ? '✕ Cancel' : '+ Add Achievement'}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="border-2 border-sow-gold p-5 space-y-4">
          <h2 className="text-[10px] tracking-[2px] uppercase font-bold text-amber-600">New Achievement</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Student Name *</label>
                <input name="student_name" value={form.student_name} onChange={handleChange}
                  placeholder="e.g. Amina Bello"
                  className="w-full border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-sow-gold" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Class</label>
                  <input name="student_class" value={form.student_class} onChange={handleChange}
                    placeholder="e.g. SS2A"
                    className="w-full border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-sow-gold" />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Campus</label>
                  <select name="campus" value={form.campus} onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-sow-gold">
                    <option value="">All / N/A</option>
                    {CAMPUSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Achievement Title *</label>
                <input name="title" value={form.title} onChange={handleChange}
                  placeholder="e.g. 1st Place — State Mathematics Olympiad"
                  className="w-full border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-sow-gold" />
              </div>
              <div>
                <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={2}
                  placeholder="More detail about the achievement"
                  className="w-full border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-sow-gold resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Category</label>
                  <select name="category" value={form.category} onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-sow-gold">
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Date Achieved</label>
                  <input type="date" name="achieved_at" value={form.achieved_at} onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-sow-gold" />
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 accent-sow-gold" />
                  <span className="text-sm font-bold">Hall of Fame</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="published" checked={form.published} onChange={handleChange} className="w-4 h-4 accent-ink" />
                  <span className="text-sm font-bold">Published</span>
                </label>
              </div>
            </div>

            {/* Photo upload */}
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Student Photo</label>
              {form.photo_url ? (
                <div className="relative aspect-square overflow-hidden bg-gray-100 border border-gray-200 mb-2 max-w-[200px]">
                  <Image src={form.photo_url} alt="Preview" fill className="object-cover" />
                  <button type="button" onClick={() => setForm(f => ({ ...f, photo_url: '' }))}
                    className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 hover:bg-red-700">
                    Remove
                  </button>
                </div>
              ) : (
                <div onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 hover:border-sow-gold transition-colors cursor-pointer p-8 text-center mb-2">
                  <p className="text-3xl mb-2">📸</p>
                  <p className="text-xs text-gray-400">{uploading ? 'Uploading...' : 'Click to upload photo'}</p>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>
          </div>

          {error && <p className="text-red-600 text-sm bg-red-50 border border-red-200 px-3 py-2">{error}</p>}
          <div className="flex justify-end">
            <button onClick={handleAdd} disabled={loading === 'add'}
              className="btn-gold disabled:opacity-50">
              {loading === 'add' ? 'Saving...' : '+ Add to Honours Board'}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {honours.length === 0 ? (
        <div className="text-center py-12 text-gray-400 border border-dashed border-gray-200 rounded">
          <p className="text-4xl mb-3">🏆</p>
          <p className="italic">No achievements yet. Add the first one above.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {honours.map(h => (
            <div key={h.id}
              className={`flex items-center gap-4 border rounded p-3 ${h.published ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
              {/* Photo */}
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-500">
                {h.photo_url
                  ? <Image src={h.photo_url} alt={h.student_name} width={40} height={40} className="w-full h-full object-cover" />
                  : h.student_name.split(' ').map(n => n[0]).join('').slice(0, 2)
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm">{h.student_name}
                  <span className="font-normal text-gray-400 ml-2 text-xs">{h.student_class}{h.campus ? ` · ${h.campus}` : ''}</span>
                </p>
                <p className="text-xs text-gray-600 truncate">{h.title}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-end">
                {h.featured && <span className="text-[9px] bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded">Hall of Fame</span>}
                <button onClick={() => toggleFeatured(h.id, h.featured)} disabled={loading === h.id + '-feat'}
                  className="text-[9px] uppercase font-bold px-2 py-1 rounded border transition-colors hover:bg-amber-50 border-amber-200 text-amber-600">
                  {h.featured ? 'Unfeature' : 'Feature'}
                </button>
                <button onClick={() => togglePublished(h.id, h.published)} disabled={loading === h.id + '-pub'}
                  className={`text-[9px] uppercase font-bold px-2 py-1 rounded transition-colors ${h.published ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                  {h.published ? 'Published' : 'Draft'}
                </button>
                <button onClick={() => handleDelete(h.id)} disabled={loading === h.id + '-del'}
                  className="text-xs text-red-400 hover:text-red-600 font-bold">
                  {loading === h.id + '-del' ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
