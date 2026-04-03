'use client'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { format } from 'date-fns'

interface Genius {
  id: string
  student_name: string
  student_class: string
  subject: string
  achievement: string
  photo_url: string | null
  week_of: string
  active: boolean
}

export default function GeniusManager({ initialGeniuses }: { initialGeniuses: Genius[] }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [geniuses, setGeniuses] = useState(initialGeniuses)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    student_name: '', student_class: '', subject: '',
    achievement: '', photo_url: '', week_of: new Date().toISOString().split('T')[0], active: true,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }))
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
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
  }

  async function handleAdd() {
    if (!form.student_name || !form.student_class || !form.subject || !form.achievement) {
      setError('Name, class, subject, and achievement are required.')
      return
    }
    setLoading('add')
    setError('')
    const res = await fetch('/api/admin/genius', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const added = await res.json()
      setGeniuses(prev => [added, ...prev])
      setForm({ student_name: '', student_class: '', subject: '', achievement: '', photo_url: '', week_of: new Date().toISOString().split('T')[0], active: true })
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error || 'Failed to add.')
    }
    setLoading(null)
  }

  async function toggleActive(id: string, active: boolean) {
    setLoading(id + '-toggle')
    await fetch(`/api/admin/genius/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active }),
    })
    setGeniuses(prev => prev.map(g => g.id === id ? { ...g, active: !active } : g))
    setLoading(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this entry?')) return
    setLoading(id + '-del')
    await fetch(`/api/admin/genius/${id}`, { method: 'DELETE' })
    setGeniuses(prev => prev.filter(g => g.id !== id))
    setLoading(null)
  }

  return (
    <div className="max-w-4xl space-y-8">
      {/* Add form */}
      <div className="border-2 border-sow-gold p-5">
        <h2 className="text-[10px] tracking-[2px] uppercase font-bold mb-4 text-amber-600">Add New Genius</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Student Name *</label>
              <input name="student_name" value={form.student_name} onChange={handleChange}
                placeholder="e.g. Chidera Okonkwo"
                className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sow-gold" />
            </div>
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Class *</label>
              <input name="student_class" value={form.student_class} onChange={handleChange}
                placeholder="e.g. SS2A, JSS3B"
                className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sow-gold" />
            </div>
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Subject / Field *</label>
              <input name="subject" value={form.subject} onChange={handleChange}
                placeholder="e.g. Mathematics, Science, Drama"
                className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sow-gold" />
            </div>
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Week Of</label>
              <input name="week_of" type="date" value={form.week_of} onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sow-gold" />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="active" checked={form.active} onChange={handleChange} className="accent-sow-gold w-4 h-4" />
              <span className="text-sm font-bold">Show on homepage immediately</span>
            </label>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Achievement / Quote *</label>
              <textarea name="achievement" value={form.achievement} onChange={handleChange} rows={4}
                placeholder="Describe what this student achieved this week..."
                className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sow-gold resize-none" />
            </div>

            <div>
              <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Student Photo</label>
              {form.photo_url ? (
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-sow-gold">
                  <Image src={form.photo_url} alt="Preview" fill className="object-cover" />
                  <button type="button" onClick={() => setForm(f => ({ ...f, photo_url: '' }))}
                    className="absolute inset-0 bg-black/50 text-white text-xs font-bold flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    Remove
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="border-2 border-dashed border-gray-300 w-24 h-24 rounded-full flex items-center justify-center text-xs text-gray-400 hover:border-sow-gold transition-colors disabled:opacity-50">
                  {uploading ? '...' : '📷 Photo'}
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            </div>
          </div>
        </div>

        {error && <p className="text-red-600 text-sm mt-3 bg-red-50 border border-red-200 px-3 py-2">{error}</p>}
        <div className="mt-4 flex justify-end">
          <button onClick={handleAdd} disabled={loading === 'add'}
            className="bg-sow-gold text-ink text-sm tracking-widest uppercase font-bold px-5 py-2 hover:bg-amber-400 transition-colors disabled:opacity-50">
            {loading === 'add' ? 'Adding...' : '⭐ Add Genius'}
          </button>
        </div>
      </div>

      {/* Entries list */}
      <div>
        <h2 className="text-[10px] tracking-[2px] uppercase font-bold mb-3 pb-2 border-b border-gray-200">
          All Entries ({geniuses.length})
        </h2>
        <div className="space-y-3">
          {geniuses.map(g => (
            <div key={g.id}
              className={`flex items-center gap-4 p-4 border rounded group transition-all ${g.active ? 'border-sow-gold bg-amber-50' : 'border-gray-200 bg-white'}`}>
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-sow-blue to-sow-purple flex items-center justify-center">
                {g.photo_url ? (
                  <Image src={g.photo_url} alt={g.student_name} width={48} height={48} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-black text-sm">
                    {g.student_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm">{g.student_name}</p>
                  {g.active && <span className="text-[9px] bg-sow-gold text-ink font-bold px-1.5 py-0.5 rounded">ACTIVE</span>}
                </div>
                <p className="text-[10px] uppercase tracking-wide text-sow-blue">{g.student_class} · {g.subject}</p>
                <p className="text-xs text-gray-500 line-clamp-1 mt-0.5 italic">"{g.achievement}"</p>
                <p className="text-[9px] text-gray-400 mt-0.5">{format(new Date(g.week_of), 'MMM d, yyyy')}</p>
              </div>

              <div className="flex flex-col gap-1.5 flex-shrink-0">
                <button onClick={() => toggleActive(g.id, g.active)}
                  disabled={loading === g.id + '-toggle'}
                  className={`text-[10px] font-bold px-3 py-1 rounded border transition-colors ${g.active ? 'border-gray-300 text-gray-500 hover:border-red-300 hover:text-red-500' : 'border-sow-gold text-amber-600 hover:bg-sow-gold hover:text-ink'}`}>
                  {loading === g.id + '-toggle' ? '...' : g.active ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => handleDelete(g.id)}
                  disabled={loading === g.id + '-del'}
                  className="text-[10px] font-bold px-3 py-1 border border-red-200 text-red-400 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-40">
                  {loading === g.id + '-del' ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
          {geniuses.length === 0 && <p className="text-gray-400 italic text-sm">No entries yet.</p>}
        </div>
      </div>
    </div>
  )
}
