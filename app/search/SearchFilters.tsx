'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Category } from '@/types'

interface Props {
  categories: Category[]
  current: { q?: string; category?: string; author?: string; from?: string; to?: string }
}

export default function SearchFilters({ categories, current }: Props) {
  const router = useRouter()
  const [form, setForm] = useState({
    q:        current.q        || '',
    category: current.category || '',
    author:   current.author   || '',
    from:     current.from     || '',
    to:       current.to       || '',
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
    router.push(`/search?${params.toString()}`)
  }

  function handleClear() {
    setForm({ q: '', category: '', author: '', from: '', to: '' })
    router.push('/search')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sticky top-4">
      <div className="bg-sow-blue text-white px-3 py-2">
        <p className="text-[10px] tracking-[2px] uppercase font-bold">Filter Articles</p>
      </div>

      <div className="space-y-3 p-3 border border-gray-200">
        <div>
          <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Keywords</label>
          <input name="q" value={form.q} onChange={handleChange}
            placeholder="Search terms..."
            className="w-full border border-gray-200 px-2.5 py-2 text-sm outline-none focus:border-sow-blue" />
        </div>

        <div>
          <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Category</label>
          <select name="category" value={form.category} onChange={handleChange}
            className="w-full border border-gray-200 px-2.5 py-2 text-sm outline-none focus:border-sow-blue bg-white">
            <option value="">All categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Author</label>
          <input name="author" value={form.author} onChange={handleChange}
            placeholder="Author name..."
            className="w-full border border-gray-200 px-2.5 py-2 text-sm outline-none focus:border-sow-blue" />
        </div>

        <div>
          <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Date From</label>
          <input name="from" type="date" value={form.from} onChange={handleChange}
            className="w-full border border-gray-200 px-2.5 py-2 text-sm outline-none focus:border-sow-blue" />
        </div>

        <div>
          <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Date To</label>
          <input name="to" type="date" value={form.to} onChange={handleChange}
            className="w-full border border-gray-200 px-2.5 py-2 text-sm outline-none focus:border-sow-blue" />
        </div>

        <button type="submit"
          className="w-full bg-sow-blue text-white text-[10px] tracking-[2px] uppercase font-bold py-2.5 hover:bg-blue-900 transition-colors">
          Apply Filters
        </button>
        <button type="button" onClick={handleClear}
          className="w-full border border-gray-200 text-gray-500 text-[10px] tracking-[2px] uppercase font-bold py-2 hover:bg-gray-50 transition-colors">
          Clear All
        </button>
      </div>
    </form>
  )
}
