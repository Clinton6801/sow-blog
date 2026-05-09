'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteClubPostButton({ postId }: { postId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('Delete this post?')) return
    setLoading(true)
    await fetch(`/api/admin/clubs/posts/${postId}`, { method: 'DELETE' })
    setLoading(false)
    router.refresh()
  }

  return (
    <button onClick={handleDelete} disabled={loading}
      className="text-xs text-red-400 hover:text-red-600 font-bold transition-colors disabled:opacity-40">
      {loading ? '...' : 'Delete'}
    </button>
  )
}
