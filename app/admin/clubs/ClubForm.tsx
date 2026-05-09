'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ClubFormProps {
  initial?: {
    id?: string
    name?: string
    slug?: string
    tagline?: string
    description?: string
    color?: string
    emoji?: string
    patron?: string
    meeting_day?: string
    member_count?: number
    active?: boolean
    sort_order?: number
  }
}

const PRESET_CLUBS = [
  { name: 'Press Club', slug: 'press', color: '#1e3a8a', emoji: '📰' },
  { name: 'STEM Club', slug: 'stem', color: '#15803d', emoji: '🔬' },
  { name: 'Literary Club', slug: 'literary', color: '#7c3aed', emoji: '📚' },
  { name: 'Debate Club', slug: 'debate', color: '#dc2626', emoji: '🎤' },
  { name: 'Drama Club', slug: 'drama', color: '#d97706', emoji: '🎭' },
  { name: 'Music Club', slug: 'music', color: '#0e7490', emoji: '🎵' },
]

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function ClubForm({ initial = {} }: ClubFormProps) {
  const router = useRouter()
  const [form, setForm] = useState({
    name: initial.name || '',
    slug: initial.slug || '',
    tagline: initial.tagline || '',
    description: initial.description || '',
    color: initial.color || '#1e3a8a',
    emoji: initial.emoji || '🏫',
    patron: initial.patron || '',
    meeting_day: initial.meeting_day || '',
    member_count: initial.member_count || '',
    active: initial.active !== false,
    sort_order: initial.sort_order || 0,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value
    setForm(f => ({ ...f, name, slug: initial.slug ? f.slug : slugify(name) }))
  }

  function applyPreset(preset: typeof PRESET_CLUBS[0]) {
    setForm(f => ({
      ...f,
      name: preset.name,
      slug: preset.slug,
      color: preset.color,
      emoji: preset.emoji,
    }))
  }

  async function handleSave() {
    if (!form.name || !form.slug) {
      setError('Name and slug are required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const url = initial.id ? `/api/admin/clubs/${initial.id}` : '/api/admin/clubs'
      const method = initial.id ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, member_count: form.member_count ? Number(form.member_count) : null }),
      })
      if (res.ok) {
        router.push('/admin/clubs')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to save.')
      }
    } catch {
      setError('Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-black">{initial.id ? 'Edit Club' : 'New Club'}</h1>
        <div className="flex gap-2">
          <button onClick={() => router.back()} className="btn-outline text-sm">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary text-sm disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Club'}
          </button>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm border border-red-200 bg-red-50 px-4 py-2 mb-4">{error}</p>}

      {/* Quick presets */}
      {!initial.id && (
        <div className="mb-5">
          <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-2">Quick Presets</label>
          <div className="flex flex-wrap gap-2">
            {PRESET_CLUBS.map(p => (
              <button key={p.slug} type="button" onClick={() => applyPreset(p)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border-2 hover:opacity-80 transition-opacity text-white"
                style={{ backgroundColor: p.color, borderColor: p.color }}>
                {p.emoji} {p.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Club Name *</label>
            <input name="name" value={form.name} onChange={handleNameChange} required
              placeholder="e.g. STEM Club"
              className="w-full border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-ink" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Slug *</label>
            <input name="slug" value={form.slug} onChange={handleChange} required
              placeholder="e.g. stem"
              className="w-full border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-ink font-mono" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Tagline</label>
          <input name="tagline" value={form.tagline} onChange={handleChange}
            placeholder="Short one-line description"
            className="w-full border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-ink" />
        </div>

        <div>
          <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3}
            placeholder="Full description of the club's purpose and activities"
            className="w-full border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-ink resize-none" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Brand Color</label>
            <div className="flex items-center gap-2">
              <input type="color" name="color" value={form.color} onChange={handleChange}
                className="w-10 h-9 border border-gray-300 cursor-pointer p-0.5" />
              <input name="color" value={form.color} onChange={handleChange}
                className="flex-1 border border-gray-300 px-2 py-2 text-xs bg-white outline-none font-mono" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Emoji</label>
            <input name="emoji" value={form.emoji} onChange={handleChange}
              placeholder="🏫"
              className="w-full border border-gray-300 px-3 py-2 text-lg bg-white outline-none focus:border-ink" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Sort Order</label>
            <input type="number" name="sort_order" value={form.sort_order} onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-ink" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Patron / Teacher</label>
            <input name="patron" value={form.patron} onChange={handleChange}
              placeholder="e.g. Mr. Adeyemi"
              className="w-full border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-ink" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Meeting Day</label>
            <input name="meeting_day" value={form.meeting_day} onChange={handleChange}
              placeholder="e.g. Fridays 2pm"
              className="w-full border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-ink" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Members</label>
            <input type="number" name="member_count" value={form.member_count} onChange={handleChange}
              placeholder="e.g. 24"
              className="w-full border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-ink" />
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="active" checked={form.active} onChange={handleChange} className="w-4 h-4 accent-ink" />
          <span className="text-sm font-bold">Active (visible on public site)</span>
        </label>
      </div>
    </div>
  )
}
