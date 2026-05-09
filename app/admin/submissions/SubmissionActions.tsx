'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props { submission: any }

export default function SubmissionActions({ submission }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<'approve' | 'reject' | 'edit' | null>(null)
  const [note, setNote] = useState('')
  const [showNote, setShowNote] = useState(false)

  async function handleApprove() {
    setLoading('approve')
    const res = await fetch(`/api/admin/submissions/${submission.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved', admin_note: note }),
    })
    if (res.ok) {
      router.refresh()
    }
    setLoading(null)
  }

  async function handleReject() {
    if (!note.trim()) {
      setShowNote(true)
      return
    }
    setLoading('reject')
    await fetch(`/api/admin/submissions/${submission.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'rejected', admin_note: note }),
    })
    setLoading(null)
    router.refresh()
  }

  function handleEditFirst() {
    // Build query params to pre-fill the article form
    const params = new URLSearchParams({
      title: submission.title,
      content: submission.content,
      excerpt: submission.excerpt || '',
      author_name: submission.student_name,
      author_role: `Student · ${submission.student_class}`,
      category_id: submission.category_id || '',
      from_submission: submission.id,
    })
    router.push(`/admin/articles/new?${params.toString()}`)
  }

  return (
    <div className="space-y-2">
      {showNote && (
        <textarea
          placeholder="Rejection reason (required)"
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={2}
          className="w-full border border-gray-200 px-2 py-1.5 text-xs resize-none outline-none focus:border-ink rounded"
        />
      )}
      {!showNote && (
        <textarea
          placeholder="Admin note (optional)"
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={2}
          className="w-full border border-gray-200 px-2 py-1.5 text-xs resize-none outline-none focus:border-ink rounded"
        />
      )}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleApprove}
          disabled={!!loading}
          className="bg-green-700 text-white text-xs font-bold tracking-wide uppercase px-3 py-2 hover:bg-green-800 transition-colors disabled:opacity-50 rounded"
        >
          {loading === 'approve' ? '...' : '✓ Approve & Publish'}
        </button>
        <button
          onClick={handleEditFirst}
          disabled={!!loading}
          className="bg-sow-blue text-white text-xs font-bold tracking-wide uppercase px-3 py-2 hover:bg-blue-900 transition-colors disabled:opacity-50 rounded"
        >
          ✏ Edit First
        </button>
        <button
          onClick={handleReject}
          disabled={!!loading}
          className="bg-white text-red-700 border border-red-200 text-xs font-bold tracking-wide uppercase px-3 py-2 hover:bg-red-50 transition-colors disabled:opacity-50 rounded"
        >
          {loading === 'reject' ? '...' : '✕ Reject'}
        </button>
      </div>
    </div>
  )
}
