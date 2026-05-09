'use client'
import { useState } from 'react'
import { format } from 'date-fns'
import type { Comment } from '@/types'

interface CommentsProps {
  articleId: string
  initialComments: Comment[]
}

export default function Comments({ articleId, initialComments }: CommentsProps) {
  const [comments] = useState<Comment[]>(initialComments)
  const [name, setName] = useState('')
  const [studentClass, setStudentClass] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !content) return
    setStatus('loading')
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article_id: articleId, commenter_name: name, commenter_class: studentClass, content }),
      })
      if (res.ok) {
        setStatus('success')
        setMessage('Your comment has been submitted and is awaiting approval. Thank you!')
        setName('')
        setStudentClass('')
        setContent('')
      } else {
        setStatus('error')
        setMessage('Could not submit your comment. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Could not submit your comment. Please try again.')
    }
  }

  return (
    <section className="mt-10 pt-6 border-t-2" style={{ borderColor: 'var(--border-medium)' }}>
      <div className="section-heading section-default">
        <span className="section-heading-label">Comments ({comments.length})</span>
        <div className="section-heading-rule" />
      </div>

      {/* Existing comments */}
      {comments.length === 0 ? (
        <p className="text-sm italic mb-6" style={{ color: 'var(--text-muted)' }}>No comments yet. Be the first to respond.</p>
      ) : (
        <div className="space-y-4 mb-8">
          {comments.map((c) => (
            <div key={c.id} className="border-l-2 pl-4" style={{ borderColor: 'var(--border-medium)' }}>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{c.commenter_name}</span>
                {c.commenter_class && (
                  <span className="text-[10px] tracking-wide uppercase" style={{ color: 'var(--text-muted)' }}>{c.commenter_class}</span>
                )}
                <span className="text-[10px]" style={{ color: 'var(--text-faint)' }}>
                  {format(new Date(c.created_at), 'MMM d, yyyy')}
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{c.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Leave a comment */}
      <div className="p-5 border" style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-medium)' }}>
        <h4 className="text-[10px] tracking-[2px] uppercase font-bold mb-4 pb-2 border-b" style={{ color: 'var(--text-primary)', borderColor: 'var(--border-medium)' }}>
          Leave a Comment
        </h4>

        {status === 'success' ? (
          <p className="text-sm font-bold text-green-700 bg-green-50 border border-green-200 px-4 py-3">
            {message}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name *"
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
                className="border px-3 py-2 text-sm outline-none focus:border-sow-blue"
              />
              <input
                type="text"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                placeholder="Your class (e.g. SS2A)"
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
                className="border px-3 py-2 text-sm outline-none focus:border-sow-blue"
              />
            </div>
            <textarea
              required
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your comment..."
              style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-medium)', color: 'var(--text-primary)' }}
              className="w-full border px-3 py-2 text-sm outline-none focus:border-sow-blue resize-none"
            />
            {status === 'error' && (
              <p className="text-xs text-red-600">{message}</p>
            )}
            <div className="flex items-center justify-between">
              <p className="text-[10px] italic" style={{ color: 'var(--text-faint)' }}>Comments are reviewed before publication.</p>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-primary disabled:opacity-50"
              >
                {status === 'loading' ? 'Submitting...' : 'Submit Comment'}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
