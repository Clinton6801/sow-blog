'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteDigestButton({ digestId }: { digestId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('Delete this digest?')) return
    setLoading(true)
    await fetch(`/api/admin/digest/${digestId}`, { method: 'DELETE' })
    setLoading(false)
    router.refresh()
  }

  return (
    <button onClick={handleDelete} disabled={loading}
      className="text-xs text-red-400 hover:text-red-600 font-bold disabled:opacity-40">
      {loading ? '...' : 'Delete'}
    </button>
  )
}
