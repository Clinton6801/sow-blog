'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props { submission: any }

export default function SubmissionActions({ submission }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)
  const [note, setNote] = useState('')

  async function handleAction(action: 'approve' | 'reject') {
    setLoading(action)
    await fetch(`/api/admin/submissions/${submission.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: action === 'approve' ? 'approved' : 'rejected', admin_note: note }),
    })
    setLoading(null)
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-2 min-w-[140px]">
      <textarea
        placeholder="Admin note (optional)"
        value={note}
        onChange={e => setNote(e.target.value)}
        rows={2}
        className="border border-gray-200 px-2 py-1.5 text-xs resize-none outline-none focus:border-ink rounded"
      />
      <button
        onClick={() => handleAction('approve')}
        disabled={!!loading}
        className="bg-green-700 text-white text-xs font-bold tracking-wide uppercase px-3 py-2 hover:bg-green-800 transition-colors disabled:opacity-50 rounded"
      >
        {loading === 'approve' ? '...' : '✓ Approve & Publish'}
      </button>
      <button
        onClick={() => handleAction('reject')}
        disabled={!!loading}
        className="bg-white text-red-700 border border-red-200 text-xs font-bold tracking-wide uppercase px-3 py-2 hover:bg-red-50 transition-colors disabled:opacity-50 rounded"
      >
        {loading === 'reject' ? '...' : '✕ Reject'}
      </button>
    </div>
  )
}
