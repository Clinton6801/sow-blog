'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Category } from '@/types'

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
  const router = useRouter()
  const [categories, setCategories] = useState(initialCategories)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function addCategory() {
    if (!newName.trim()) return
    setLoading('add')
    setError('')
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim(), slug: slugify(newName), description: newDesc.trim() }),
    })
    if (res.ok) {
      setNewName('')
      setNewDesc('')
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error || 'Failed to add category.')
    }
    setLoading(null)
  }

  async function deleteCategory(id: string) {
    if (!confirm('Delete this category? Articles in it will become uncategorised.')) return
    setLoading(id)
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    setCategories(prev => prev.filter(c => c.id !== id))
    setLoading(null)
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Add new */}
      <div className="border-2 border-sow-blue p-5">
        <h2 className="text-[10px] tracking-[2px] uppercase font-bold mb-3 text-sow-blue">Add New Category</h2>
        <div className="space-y-2">
          <input type="text" value={newName} onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addCategory()}
            placeholder="Category name (e.g. Science & Tech)"
            className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sow-blue" />
          <input type="text" value={newDesc} onChange={e => setNewDesc(e.target.value)}
            placeholder="Short description (optional)"
            className="w-full border border-gray-300 px-3 py-2 text-sm outline-none focus:border-sow-blue" />
          {newName && (
            <p className="text-[10px] text-gray-400">Slug: <code>{slugify(newName)}</code></p>
          )}
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button onClick={addCategory} disabled={loading === 'add' || !newName.trim()}
            className="btn-primary text-sm disabled:opacity-50">
            {loading === 'add' ? 'Adding...' : '+ Add Category'}
          </button>
        </div>
      </div>

      {/* List */}
      <div>
        <h2 className="text-[10px] tracking-[2px] uppercase font-bold mb-3 pb-2 border-b border-gray-200">
          Current Categories ({categories.length})
        </h2>
        <div className="space-y-2">
          {categories.map(cat => (
            <div key={cat.id} className="flex items-center gap-3 p-3 border border-gray-200 bg-white hover:border-sow-blue transition-colors group">
              <div className="flex-1">
                <p className="font-bold text-sm">{cat.name}</p>
                <div className="flex gap-3 text-[10px] text-gray-400">
                  <code>/{cat.slug}</code>
                  {cat.description && <span>· {cat.description}</span>}
                </div>
              </div>
              <button onClick={() => deleteCategory(cat.id)} disabled={loading === cat.id}
                className="text-red-400 hover:text-red-600 text-xs font-bold opacity-0 group-hover:opacity-100 transition-all disabled:opacity-40">
                {loading === cat.id ? '...' : 'Delete'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
