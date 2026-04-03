'use client'
import Masthead from '@/components/layout/Masthead'
import Footer from '@/components/layout/Footer'
import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        const data = await res.json()
        setStatus('error')
        setErrMsg(data.error || 'Something went wrong.')
      }
    } catch {
      setStatus('error')
      setErrMsg('Something went wrong. Please try again.')
    }
  }

  return (
    <>
      <Masthead />
      <main className="max-w-4xl mx-auto px-4 py-10">

        <div className="border-b-2 border-ink pb-5 mb-8">
          <span className="category-badge mb-2 inline-block">Press Club</span>
          <h1 className="font-serif text-5xl font-black">Contact Us</h1>
          <p className="text-gray-600 italic mt-2 font-serif">
            Questions, feedback, or want to get involved? We'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Contact info */}
          <aside className="space-y-6">
            <div>
              <h3 className="text-[10px] tracking-[2px] uppercase font-bold mb-3 pb-1 border-b border-ink">
                Find Us
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><strong className="text-ink block">Location</strong>Press Club Office<br />Seat of Wisdom Group of Schools<br />Ibadan, Oyo State</p>
                <p className="pt-2"><strong className="text-ink block">Email</strong>pressclub@sowschools.edu.ng</p>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] tracking-[2px] uppercase font-bold mb-3 pb-1 border-b border-ink">
                Quick Links
              </h3>
              <ul className="space-y-1.5 text-sm">
                {[
                  ['Submit a Story', '/submit'],
                  ['About the Press Club', '/about'],
                  ['Latest Articles', '/'],
                ].map(([label, href]) => (
                  <li key={href}>
                    <a href={href} className="text-gray-600 hover:text-ink hover:underline">{label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Form */}
          <div className="md:col-span-2">
            {status === 'success' ? (
              <div className="border-2 border-ink p-8 text-center">
                <h2 className="font-serif text-3xl font-black mb-2">Message Received!</h2>
                <p className="text-gray-600 mb-4">Thank you for reaching out. The editorial team will get back to you shortly.</p>
                <button onClick={() => setStatus('idle')} className="btn-outline">Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Your Name *</label>
                    <input name="name" required value={form.name} onChange={handleChange}
                      placeholder="e.g. Amina Bello"
                      className="w-full border border-ink/40 px-3 py-2.5 text-sm bg-paper outline-none focus:border-ink" />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Email *</label>
                    <input name="email" type="email" required value={form.email} onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full border border-ink/40 px-3 py-2.5 text-sm bg-paper outline-none focus:border-ink" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Subject *</label>
                  <select name="subject" required value={form.subject} onChange={handleChange}
                    className="w-full border border-ink/40 px-3 py-2.5 text-sm bg-paper outline-none focus:border-ink">
                    <option value="">Select a subject</option>
                    <option>General Enquiry</option>
                    <option>Story Tip</option>
                    <option>Correction / Error Report</option>
                    <option>Join the Press Club</option>
                    <option>Feedback</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] tracking-[2px] uppercase font-bold mb-1">Message *</label>
                  <textarea name="message" required rows={6} value={form.message} onChange={handleChange}
                    placeholder="Write your message here..."
                    className="w-full border border-ink/40 px-3 py-2.5 text-sm bg-paper outline-none focus:border-ink resize-none" />
                </div>

                {status === 'error' && (
                  <p className="text-sm text-red-600 border border-red-200 bg-red-50 px-4 py-2">{errMsg}</p>
                )}

                <div className="flex justify-end">
                  <button type="submit" disabled={status === 'loading'} className="btn-primary disabled:opacity-50">
                    {status === 'loading' ? 'Sending...' : 'Send Message →'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
