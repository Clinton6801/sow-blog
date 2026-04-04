'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import ImageUploader from './ImageUploader'
import TagsInput from './TagsInput'
import { getReadingTime } from '@/lib/readingTime'
import type { Category } from '@/types'

const RichEditor = dynamic(() => import('./RichEditor'), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-300 min-h-[320px] flex items-center justify-center text-gray-400 text-sm bg-gray-50">
      Loading editor...
    </div>
  ),
})

interface ArticleFormProps {
  initial?: {
    id?: string
    title?: string
    slug?: string
    excerpt?: string
    content?: string
    cover_image_url?: string
    category_id?: string
    author_name?: string
    author_role?: string
    status?: string
    featured?: boolean
  }
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function ArticleForm({ initial = {} }: ArticleFormProps) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState({
    title: initial.title || '',
    slug: initial.slug || '',
    excerpt: initial.excerpt || '',
    content: initial.content || '',
    cover_image_url: initial.cover_image_url || '',
    category_id: initial.category_id || '',
    author_name: initial.author_name || 'Editorial Team',
    author_role: initial.author_role || 'Staff Writer',
    status: initial.status || 'draft',
    featured: initial.featured || false,
    tags: (initial as any).tags || [],
    video_url: (initial as any).video_url || '',
    video_type: (initial as any).video_type || 'youtube',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories)
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value
    setForm(f => ({ ...f, title, slug: initial.slug ? f.slug : slugify(title) }))
  }

  async function handleSave(publishStatus?: string) {
    setSaving(true)
    setError('')
    const payload = {
      ...form,
      status: publishStatus || form.status,
      reading_time: getReadingTime(form.content),
    }
    try {
      const url = initial.id ? `/api/admin/articles/${initial.id}` : '/api/admin/articles'
      const method = initial.id ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        router.push('/admin/articles')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to save article.')
      }
    } catch {
      setError('Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl font-black">
          {initial.id ? 'Edit Article' : 'New Article'}
        </h1>
        <div className="flex gap-2">
          <button onClick={() => handleSave('draft')} disabled={saving} className="btn-outline text-sm disabled:opacity-50">
            Save Draft
          </button>
          <button onClick={() => handleSave('published')} disabled={saving} className="btn-primary text-sm disabled:opacity-50">
            {saving ? 'Saving...' : 'Publish'}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-red-600 text-sm border border-red-200 bg-red-50 px-4 py-2 mb-4">{error}</p>
      )}

      <div className="space-y-5">
        <div>
          <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Title *</label>
          <input
            name="title" value={form.title} onChange={handleTitleChange} required
            placeholder="Article headline"
            className="w-full border border-gray-300 px-3 py-2.5 text-xl font-serif font-bold bg-white outline-none focus:border-ink"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Slug *</label>
            <input
              name="slug" value={form.slug} onChange={handleChange} required
              placeholder="url-friendly-slug"
              className="w-full border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-ink font-mono"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Category</label>
            <select name="category_id" value={form.category_id} onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-ink">
              <option value="">Select category</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Excerpt / Summary</label>
          <textarea
            name="excerpt" value={form.excerpt} onChange={handleChange} rows={2}
            placeholder="A short summary shown on cards and homepage"
            className="w-full border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-ink resize-none"
          />
        </div>

        <div>
          <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Content *</label>
          <RichEditor value={form.content} onChange={html => setForm(f => ({ ...f, content: html }))} />
        </div>

        <div>
          <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Cover Image</label>
          <ImageUploader value={form.cover_image_url} onChange={url => setForm(f => ({ ...f, cover_image_url: url }))} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Author Name</label>
            <input name="author_name" value={form.author_name} onChange={handleChange}
              placeholder="Editorial Team"
              className="w-full border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-ink" />
          </div>
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Author Role</label>
            <input name="author_role" value={form.author_role} onChange={handleChange}
              placeholder="Staff Writer"
              className="w-full border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-ink" />
          </div>
        </div>

        <div>
          <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">
            Video (optional) <span className="font-normal normal-case tracking-normal text-gray-400">— paste a YouTube or Vimeo link</span>
          </label>
          <div className="flex gap-2">
            <select name="video_type" value={form.video_type as string} onChange={handleChange}
              className="border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-ink flex-shrink-0">
              <option value="youtube">YouTube</option>
              <option value="vimeo">Vimeo</option>
              <option value="upload">Direct URL</option>
            </select>
            <input name="video_url" value={form.video_url as string} onChange={handleChange}
              placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
              className="flex-1 border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-ink" />
          </div>
          {(form.video_url as string) && (
            <p className="text-[10px] text-green-600 mt-1">✓ Video will appear below the cover image in the article.</p>
          )}
        </div>

        <div>
          <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Tags / Keywords</label>
          <TagsInput
            value={form.tags as string[]}
            onChange={tags => setForm(f => ({ ...f, tags }))}
          />
        </div>

        <div className="flex items-center gap-6">
          <div>
            <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Status</label>
            <select name="status" value={form.status} onChange={handleChange}
              className="border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-ink">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer mt-4">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4 accent-ink" />
            <span className="text-sm font-bold">Feature on homepage</span>
          </label>
        </div>
      </div>
    </div>
  )
}
