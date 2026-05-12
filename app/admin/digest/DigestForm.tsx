'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import ImageUploader from '@/components/admin/ImageUploader'

const RichEditor = dynamic(() => import('@/components/admin/RichEditor'), {
  ssr: false,
  loading: () => <div className="border border-gray-300 min-h-[200px] flex items-center justify-center text-gray-400 text-sm bg-gray-50">Loading editor...</div>,
})

const TERMS = ['First Term', 'Second Term', 'Third Term']

interface DigestFormProps {
  initial?: {
    id?: string
    title?: string
    term?: string
    academic_year?: string
    intro?: string
    content?: string
    cover_url?: string
    highlights?: string[]
    stats?: Record<string, string | number>
    published?: boolean
  }
}

export default function DigestForm({ initial = {} }: DigestFormProps) {
  const router = useRouter()
  const [form, setForm] = useState({
    title:         initial.title || '',
    term:          initial.term || 'First Term',
    academic_year: initial.academic_year || `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
    intro:         initial.intro || '',
    content:       initial.content || '',
    cover_url:     initial.cover_url || '',
    published:     initial.published !== false,
  })
  const [highlights, setHighlights] = useState<string[]>(initial.highlights || [''])
  const [stats, setStats] = useState<{ label: string; value: string }[]>(
    initial.stats
      ? Object.entries(initial.stats).map(([label, value]) => ({ label, value: String(value) }))
      : [{ label: 'Articles Published', value: '' }, { label: 'Events Held', value: '' }]
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }))
  }

  function updateHighlight(i: number, val: string) {
    setHighlights(prev => prev.map((h, idx) => idx === i ? val : h))
  }
  function addHighlight() { setHighlights(prev => [...prev, '']) }
  function removeHighlight(i: number) { setHighlights(prev => prev.filter((_, idx) => idx !== i)) }

  function updateStat(i: number, field: 'label' | 'value', val: string) {
    setStats(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s))
  }
  function addStat() { setStats(prev => [...prev, { label: '', value: '' }]) }
  function removeStat(i: number) { setStats(prev => prev.filter((_, idx) => idx !== i)) }

  async function handleSave(published?: boolean) {
    if (!form.title) { setError('Title is required.'); return }
    setSaving(true); setError('')

    const statsObj = stats.reduce((acc, s) => {
      if (s.label && s.value) acc[s.label] = s.value
      return acc
    }, {} as Record<string, string>)

    const payload = {
      ...form,
      published: published !== undefined ? published : form.published,
      highlights: highlights.filter(Boolean),
      stats: statsObj,
    }

    try {
      const url    = initial.id ? `/api/admin/digest/${initial.id}` : '/api/admin/digest'
      const method = initial.id ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        router.push('/admin/digest')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to save.')
      }
    } catch { setError('Failed to save.') }
    finally { setSaving(false) }
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-black">{initial.id ? 'Edit Digest' : 'New Term Digest'}</h1>
        <div className="flex gap-2">
          <button onClick={() => handleSave(false)} disabled={saving} className="btn-outline text-sm disabled:opacity-50">
            Save Draft
          </button>
          <button onClick={() => handleSave(true)} disabled={saving} className="btn-primary text-sm disabled:opacity-50">
            {saving ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm border border-red-200 bg-red-50 px-4 py-2 mb-4">{error}</p>}

      <div className="space-y-5">
        {/* Title + term */}
        <div>
          <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Digest Title *</label>
          <input name="title" value={form.title} onChange={handleChange} required
            placeholder="e.g. First Term 2025/2026 — Highlights & Achievements"
            className="w-full border border-gray-300 px-3 py-2.5 text-xl font-serif font-bold bg-white outline-none focus:border-ink" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Term</label>
            <select name="term" value={form.term} onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-ink">
              {TERMS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Academic Year</label>
            <input name="academic_year" value={form.academic_year} onChange={handleChange}
              placeholder="e.g. 2025/2026"
              className="w-full border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-ink" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Cover Image</label>
          <ImageUploader value={form.cover_url} onChange={url => setForm(f => ({ ...f, cover_url: url }))} />
        </div>

        <div>
          <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Opening Paragraph</label>
          <textarea name="intro" value={form.intro} onChange={handleChange} rows={3}
            placeholder="A warm opening message from the editorial team..."
            className="w-full border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-ink resize-none" />
        </div>

        {/* Highlights */}
        <div>
          <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-2">
            Term Highlights
            <span className="font-normal normal-case tracking-normal text-gray-400 ml-2">— key bullet points</span>
          </label>
          <div className="space-y-2">
            {highlights.map((h, i) => (
              <div key={i} className="flex gap-2">
                <input value={h} onChange={e => updateHighlight(i, e.target.value)}
                  placeholder={`Highlight ${i + 1} — e.g. 12 students won state-level competitions`}
                  className="flex-1 border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-ink" />
                <button type="button" onClick={() => removeHighlight(i)}
                  className="text-red-400 hover:text-red-600 px-2 font-bold text-sm">✕</button>
              </div>
            ))}
            <button type="button" onClick={addHighlight}
              className="text-xs text-sow-teal font-bold hover:underline">+ Add highlight</button>
          </div>
        </div>

        {/* Stats */}
        <div>
          <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-2">
            Term Stats
            <span className="font-normal normal-case tracking-normal text-gray-400 ml-2">— numbers shown as big counters</span>
          </label>
          <div className="space-y-2">
            {stats.map((s, i) => (
              <div key={i} className="flex gap-2">
                <input value={s.label} onChange={e => updateStat(i, 'label', e.target.value)}
                  placeholder="Label (e.g. Articles Published)"
                  className="flex-1 border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-ink" />
                <input value={s.value} onChange={e => updateStat(i, 'value', e.target.value)}
                  placeholder="Value (e.g. 47)"
                  className="w-28 border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-ink" />
                <button type="button" onClick={() => removeStat(i)}
                  className="text-red-400 hover:text-red-600 px-2 font-bold text-sm">✕</button>
              </div>
            ))}
            <button type="button" onClick={addStat}
              className="text-xs text-sow-teal font-bold hover:underline">+ Add stat</button>
          </div>
        </div>

        {/* Full content */}
        <div>
          <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">
            Full Content
            <span className="font-normal normal-case tracking-normal text-gray-400 ml-2">— optional longer write-up</span>
          </label>
          <RichEditor value={form.content} onChange={html => setForm(f => ({ ...f, content: html }))} />
        </div>
      </div>
    </div>
  )
}
