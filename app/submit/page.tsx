'use client'
import Masthead from '@/components/layout/Masthead'
import Footer from '@/components/layout/Footer'
import { useState, useEffect, useRef } from 'react'
import type { Category } from '@/types'

export default function SubmitPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState({
    title: '', student_name: '', student_class: '', student_email: '',
    category_id: '', excerpt: '', content: '',
  })
  const [coverUrl, setCoverUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories)
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (res.ok) setCoverUrl(data.url)
    } finally { setUploading(false) }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, cover_image_url: coverUrl }),
      })
      if (res.ok) {
        setStatus('success')
        setMessage('Your article has been submitted! The editorial team will review it shortly.')
        setForm({ title: '', student_name: '', student_class: '', student_email: '', category_id: '', excerpt: '', content: '' })
        setCoverUrl('')
      } else {
        const data = await res.json()
        setStatus('error')
        setMessage(data.error || 'Submission failed. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Submission failed. Please try again.')
    }
  }

  return (
    <>
      <Masthead />
      <div className="h-1.5 bg-sow-red" />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="border-b-2 border-sow-red pb-4 mb-8">
          <span className="category-badge badge-sports mb-2 inline-block">Press Club</span>
          <h1 className="font-serif text-5xl font-black text-sow-blue">Submit a Story</h1>
          <p className="text-gray-600 italic mt-2 font-serif">
            Have a story the school should know about? Submit it here. All submissions are reviewed before publication.
          </p>
        </div>

        {status === 'success' ? (
          <div className="border-2 border-sow-green p-8 text-center bg-green-50">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="font-serif text-3xl font-black mb-3 text-sow-green">Story Submitted!</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <button onClick={() => setStatus('idle')} className="btn-primary">Submit Another Story</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1 text-sow-blue">Article Title *</label>
              <input name="title" required value={form.title} onChange={handleChange}
                placeholder="Enter your article headline"
                className="w-full border-2 border-gray-200 px-3 py-2.5 text-sm bg-paper outline-none focus:border-sow-blue transition-colors" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1 text-sow-blue">Category</label>
                <select name="category_id" value={form.category_id} onChange={handleChange}
                  className="w-full border-2 border-gray-200 px-3 py-2.5 text-sm bg-paper outline-none focus:border-sow-blue">
                  <option value="">Select a category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1 text-sow-blue">One-Line Summary</label>
                <input name="excerpt" value={form.excerpt} onChange={handleChange}
                  placeholder="Brief summary"
                  className="w-full border-2 border-gray-200 px-3 py-2.5 text-sm bg-paper outline-none focus:border-sow-blue" />
              </div>
            </div>

            {/* Cover image upload */}
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1 text-sow-blue">Cover Photo (optional)</label>
              <div className="border-2 border-dashed border-gray-200 p-4 hover:border-sow-blue transition-colors">
                {coverUrl ? (
                  <div className="relative">
                    <img src={coverUrl} alt="Cover preview" className="w-full aspect-video object-cover" />
                    <button type="button" onClick={() => setCoverUrl('')}
                      className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 font-bold hover:bg-red-700">
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-400 mb-2">Upload a photo to go with your article</p>
                    <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                      className="btn-outline text-xs disabled:opacity-50">
                      {uploading ? 'Uploading...' : '📸 Choose Photo'}
                    </button>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </div>
            </div>

            <div>
              <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1 text-sow-blue">Article Content *</label>
              <textarea name="content" required rows={12} value={form.content} onChange={handleChange}
                placeholder="Write your full article here. Aim for at least 3–4 paragraphs with clear, factual reporting."
                className="w-full border-2 border-gray-200 px-3 py-2.5 text-sm bg-paper outline-none focus:border-sow-blue resize-none leading-relaxed transition-colors" />
            </div>

            <div className="border-t-2 border-sow-blue/20 pt-5 bg-blue-50 p-4">
              <p className="text-[10px] tracking-[2px] uppercase font-bold mb-3 text-sow-blue">Your Details</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Full Name *</label>
                  <input name="student_name" required value={form.student_name} onChange={handleChange}
                    placeholder="e.g. Amina Bello"
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm bg-white outline-none focus:border-sow-blue" />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Class *</label>
                  <input name="student_class" required value={form.student_class} onChange={handleChange}
                    placeholder="e.g. SS2A"
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm bg-white outline-none focus:border-sow-blue" />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Email (optional)</label>
                  <input name="student_email" type="email" value={form.student_email} onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full border border-gray-200 px-3 py-2.5 text-sm bg-white outline-none focus:border-sow-blue" />
                </div>
              </div>
            </div>

            {status === 'error' && (
              <p className="text-sm text-red-600 border border-red-200 bg-red-50 px-4 py-2">{message}</p>
            )}

            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-gray-400 italic">All submissions are reviewed before publication.</p>
              <button type="submit" disabled={status === 'loading'}
                className="btn-primary disabled:opacity-50">
                {status === 'loading' ? 'Submitting...' : '📨 Submit Story'}
              </button>
            </div>
          </form>
        )}
      </main>
      <Footer />
    </>
  )
}
