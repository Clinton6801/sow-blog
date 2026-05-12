'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Category } from '@/types'

interface Props {
  categories: Category[]
  current: { q?: string; category?: string; author?: string; from?: string; to?: string; campus?: string }
}

export default function SearchFilters({ categories, current }: Props) {
  const router = useRouter()
  const [form, setForm] = useState({
    q:        current.q        || '',
    category: current.category || '',
    author:   current.author   || '',
    from:     current.from     || '',
    to:       current.to       || '',
    campus:   current.campus   || '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (form.q)        params.set('q',        form.q)
    if (form.category) params.set('category', form.category)
    if (form.author)   params.set('author',   form.author)
    if (form.from)     params.set('from',     form.from)
    if (form.to)       params.set('to',       form.to)
    if (form.campus)   params.set('campus',   form.campus)
    router.push(`/search?${params.toString()}`)
  }

  function handleClear() {
    setForm({ q: '', category: '', author: '', from: '', to: '', campus: '' })
    router.push('/search')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sticky top-4">
      <div className="bg-sow-blue text-white px-3 py-2">
        <p className="text-[10px] tracking-[2px] uppercase font-bold">Filter Articles</p>
      </div>

      <div className="space-y-3 p-3 border" style={{ borderColor: 'var(--border-light)' }}>
        <div>
          <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Keywords</label>
          <input name="q" value={form.q} onChange={handleChange}
            placeholder="Search terms..."
            className="w-full border px-2.5 py-2 text-sm outline-none focus:border-sow-blue"
            style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }} />
        </div>

        <div>
          <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Category</label>
          <select name="category" value={form.category} onChange={handleChange}
            className="w-full border px-2.5 py-2 text-sm outline-none focus:border-sow-blue"
            style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>
            <option value="">All categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Campus</label>
          <select name="campus" value={form.campus} onChange={handleChange}
            className="w-full border px-2.5 py-2 text-sm outline-none focus:border-sow-blue"
            style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}>
            <option value="">All campuses</option>
            <option value="Main Campus">Main Campus</option>
            <option value="Alexandrite Campus">Alexandrite Campus</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Author</label>
          <input name="author" value={form.author} onChange={handleChange}
            placeholder="Author name..."
            className="w-full border px-2.5 py-2 text-sm outline-none focus:border-sow-blue"
            style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }} />
        </div>

        <div>
          <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Date From</label>
          <input name="from" type="date" value={form.from} onChange={handleChange}
            className="w-full border px-2.5 py-2 text-sm outline-none focus:border-sow-blue"
            style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }} />
        </div>

        <div>
          <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Date To</label>
          <input name="to" type="date" value={form.to} onChange={handleChange}
            className="w-full border px-2.5 py-2 text-sm outline-none focus:border-sow-blue"
            style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }} />
        </div>

        <button type="submit"
          className="w-full bg-sow-blue text-white text-[10px] tracking-[2px] uppercase font-bold py-2.5 hover:bg-blue-900 transition-colors">
          Apply Filters
        </button>
        <button type="button" onClick={handleClear}
          className="w-full border text-[10px] tracking-[2px] uppercase font-bold py-2 hover:opacity-70 transition-opacity"
          style={{ borderColor: 'var(--border-medium)', color: 'var(--text-muted)' }}>
          Clear All
        </button>
      </div>
    </form>
  )
}
