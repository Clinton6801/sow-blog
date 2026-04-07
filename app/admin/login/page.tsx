'use client'
import { useState, Suspense } from 'react' // Added Suspense import
import { useRouter, useSearchParams } from 'next/navigation'

// 1. Move your original logic into a separate component function
function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || '/admin/dashboard'

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push(from)
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error || 'Incorrect password.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-blackletter text-5xl text-ink">The SOW Chronicle</h1>
          <p className="text-[10px] tracking-[3px] uppercase text-gray-400 mt-1">Admin Panel</p>
        </div>

        <div className="border-2 border-ink p-8">
          <h2 className="font-serif text-2xl font-black mb-1">Sign In</h2>
          <p className="text-sm text-gray-500 mb-6">Enter the admin password to continue.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoFocus
                placeholder="Enter admin password"
                className="w-full border border-ink/40 px-3 py-2.5 text-sm bg-paper outline-none focus:border-ink"
              />
            </div>

            {error && (
              <p className="text-xs text-red-600 border border-red-200 bg-red-50 px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Seat of Wisdom Schools Press Club
        </p>
      </div>
    </div>
  )
}

// 2. Export the main page wrapped in Suspense
export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper" />}>
      <LoginContent />
    </Suspense>
  )
}