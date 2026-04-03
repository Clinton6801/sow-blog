'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  commentId: string
  approved?: boolean
}

export default function CommentActions({ commentId, approved = false }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function handleAction(action: 'approve' | 'delete') {
    setLoading(action)
    await fetch(`/api/admin/comments/${commentId}`, {
      method: action === 'delete' ? 'DELETE' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: action === 'approve' ? JSON.stringify({ approved: true }) : undefined,
    })
    setLoading(null)
    router.refresh()
  }

  if (approved) {
    return (
      <button
        onClick={() => handleAction('delete')}
        disabled={!!loading}
        className="text-xs text-red-500 hover:text-red-700 font-bold disabled:opacity-40"
      >
        {loading === 'delete' ? '...' : 'Delete'}
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-1.5 min-w-[100px]">
      <button
        onClick={() => handleAction('approve')}
        disabled={!!loading}
        className="bg-green-700 text-white text-xs font-bold px-3 py-1.5 hover:bg-green-800 transition-colors disabled:opacity-50 rounded"
      >
        {loading === 'approve' ? '...' : '✓ Approve'}
      </button>
      <button
        onClick={() => handleAction('delete')}
        disabled={!!loading}
        className="border border-red-200 text-red-600 text-xs font-bold px-3 py-1.5 hover:bg-red-50 transition-colors disabled:opacity-50 rounded"
      >
        {loading === 'delete' ? '...' : '✕ Delete'}
      </button>
    </div>
  )
}
