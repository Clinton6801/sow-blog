'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteArticleButton({ articleId }: { articleId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('Permanently delete this article? This cannot be undone.')) return
    setLoading(true)
    await fetch(`/api/admin/articles/${articleId}`, { method: 'DELETE' })
    setLoading(false)
    router.refresh()
  }

  return (
    <button onClick={handleDelete} disabled={loading}
      className="text-xs text-red-500 hover:text-red-700 font-bold disabled:opacity-40 transition-colors">
      {loading ? '...' : 'Delete'}
    </button>
  )
}
