'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import ImageUploader from '@/components/admin/ImageUploader'
import ArticleGalleryUploader, { GalleryImage } from '@/components/admin/ArticleGalleryUploader'
import { getReadingTime } from '@/lib/readingTime'

const RichEditor = dynamic(() => import('@/components/admin/RichEditor'), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-300 min-h-[280px] flex items-center justify-center text-gray-400 text-sm bg-gray-50">
      Loading editor...
    </div>
  ),
})

interface ClubPostFormProps {
  clubId: string
  clubName: string
  initial?: {
    id?: string
    title?: string
    excerpt?: string
    content?: string
    cover_url?: string
    author_name?: string
    published?: boolean
    gallery_images?: GalleryImage[]
  }
}

export default function ClubPostForm({ clubId, clubName, initial = {} }: ClubPostFormProps) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: initial.title || '',
    excerpt: initial.excerpt || '',
    content: initial.content || '',
    cover_url: initial.cover_url || '',
    author_name: initial.author_name || '',
    published: initial.published !== false,
    gallery_images: initial.gallery_images || [] as GalleryImage[],
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  async function handleSave(published?: boolean) {
    if (!form.title || !form.content) {
      setError('Title and content are required.')
      return
    }
    setSaving(true)
    setError('')
    const payload = {
      ...form,
      club_id: clubId,
      published: published !== undefined ? published : form.published,
      reading_time: getReadingTime(form.content),
    }
    try {
      const url = initial.id ? `/api/admin/clubs/posts/${initial.id}` : '/api/admin/clubs/posts'
      const method = initial.id ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        router.push(`/admin/clubs/${clubId}/posts`)
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
    <div className="p-4 md:p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-gray-400 mb-0.5">{clubName}</p>
          <h1 className="font-serif text-2xl font-black">{initial.id ? 'Edit Post' : 'New Post'}</h1>
        </div>
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
        <div>
          <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Title *</label>
          <input name="title" value={form.title} onChange={handleChange} required
            placeholder="Post headline"
            className="w-full border border-gray-300 px-3 py-2.5 text-xl font-serif font-bold bg-white outline-none focus:border-ink" />
        </div>

        <div>
          <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Summary</label>
          <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={2}
            placeholder="A short summary of this post"
            className="w-full border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-ink resize-none" />
        </div>

        <div>
          <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Content *</label>
          <RichEditor value={form.content} onChange={html => setForm(f => ({ ...f, content: html }))} />
        </div>

        <div>
          <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Cover Image</label>
          <ImageUploader value={form.cover_url} onChange={url => setForm(f => ({ ...f, cover_url: url }))} />
        </div>

        <div>
          <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-2">
            Photo Gallery
            <span className="font-normal normal-case tracking-normal text-gray-400 ml-2">— optional, shown at bottom of post</span>
          </label>
          <ArticleGalleryUploader
            images={form.gallery_images}
            onChange={imgs => setForm(f => ({ ...f, gallery_images: imgs }))}
          />
        </div>

        <div>
          <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Author Name</label>
          <input name="author_name" value={form.author_name} onChange={handleChange}
            placeholder="e.g. STEM Club Team"
            className="w-full border border-gray-300 px-3 py-2 text-sm bg-white outline-none focus:border-ink" />
        </div>
      </div>
    </div>
  )
}
