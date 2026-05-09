'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Club {
  id: string
  name: string
  slug: string
  tagline: string | null
  color: string | null
  emoji: string | null
  active: boolean
  sort_order: number
}

export default function ClubsManager({ initialClubs }: { initialClubs: Club[] }) {
  const router = useRouter()
  const [clubs, setClubs] = useState<Club[]>(initialClubs)
  const [loading, setLoading] = useState<string | null>(null)

  async function toggleActive(id: string, active: boolean) {
    setLoading(id)
    await fetch(`/api/admin/clubs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !active }),
    })
    setClubs(prev => prev.map(c => c.id === id ? { ...c, active: !active } : c))
    setLoading(null)
  }

  async function deleteClub(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This will also delete all posts from this club.`)) return
    setLoading(id + '-del')
    await fetch(`/api/admin/clubs/${id}`, { method: 'DELETE' })
    setClubs(prev => prev.filter(c => c.id !== id))
    setLoading(null)
  }

  if (clubs.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 border border-dashed border-gray-200 rounded">
        <p className="text-4xl mb-3">🏫</p>
        <p className="italic mb-4">No clubs yet.</p>
        <Link href="/admin/clubs/new" className="btn-primary text-sm">Create First Club</Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {clubs.map(club => (
        <div key={club.id}
          className={`border rounded p-4 flex items-center gap-4 ${club.active ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-70'}`}>
          {/* Color swatch + emoji */}
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
            style={{ backgroundColor: club.color || '#1e3a8a' }}>
            {club.emoji || '🏫'}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-bold text-sm">{club.name}</p>
              <span className="text-[9px] text-gray-400 font-mono">{club.slug}</span>
            </div>
            {club.tagline && <p className="text-xs text-gray-500 truncate">{club.tagline}</p>}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Active toggle */}
            <button
              onClick={() => toggleActive(club.id, club.active)}
              disabled={loading === club.id}
              className={`text-[9px] tracking-wide uppercase font-bold px-2 py-1 rounded transition-colors ${
                club.active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}>
              {club.active ? 'Active' : 'Hidden'}
            </button>

            <Link href={`/admin/clubs/${club.id}/posts`}
              className="text-xs text-sow-blue font-bold hover:underline">
              Posts
            </Link>
            <Link href={`/admin/clubs/${club.id}/edit`}
              className="text-xs text-gray-500 font-bold hover:underline">
              Edit
            </Link>
            <button
              onClick={() => deleteClub(club.id, club.name)}
              disabled={loading === club.id + '-del'}
              className="text-xs text-red-400 hover:text-red-600 font-bold transition-colors">
              {loading === club.id + '-del' ? '...' : 'Delete'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
