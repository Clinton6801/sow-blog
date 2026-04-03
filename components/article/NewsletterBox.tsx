'use client'
import { useState } from 'react'

export default function NewsletterBox() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setMessage("You're subscribed! Thank you.")
        setEmail('')
        setName('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong.')
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="bg-sow-blue text-white p-5">
      {/* Gold top stripe */}
      <div className="h-1 bg-sow-gold -mx-5 -mt-5 mb-4" />
      <h3 className="font-serif text-xl font-black mb-1 text-sow-gold">Stay Informed</h3>
      <p className="text-sm text-blue-200 mb-4">
        Get the latest stories from The SOW Chronicle directly in your inbox.
      </p>

      {status === 'success' ? (
        <p className="text-sm font-bold text-green-300 bg-green-900/30 border border-green-500/30 px-4 py-3">
          {message}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <input type="text" value={name} onChange={e => setName(e.target.value)}
            placeholder="Your name (optional)"
            className="w-full bg-white/10 border border-white/20 px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:border-sow-gold" />
          <div className="flex border border-white/20 focus-within:border-sow-gold transition-colors">
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-white/40 outline-none" />
            <button type="submit" disabled={status === 'loading'}
              className="bg-sow-gold text-ink px-4 py-2 text-[10px] tracking-[2px] uppercase font-bold hover:bg-amber-400 transition-colors disabled:opacity-50 whitespace-nowrap">
              {status === 'loading' ? '...' : 'Subscribe'}
            </button>
          </div>
          {status === 'error' && <p className="text-xs text-red-300">{message}</p>}
        </form>
      )}
    </div>
  )
}
