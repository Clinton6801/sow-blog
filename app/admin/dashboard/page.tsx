import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'

export const revalidate = 0

async function getStats() {
  const [articles, submissions, comments, subscribers] = await Promise.all([
    supabaseAdmin.from('articles').select('id, status', { count: 'exact' }),
    supabaseAdmin.from('submissions').select('id, status', { count: 'exact' }),
    supabaseAdmin.from('comments').select('id, approved', { count: 'exact' }),
    supabaseAdmin.from('newsletter_subscribers').select('id', { count: 'exact' }).eq('active', true),
  ])
  return {
    totalArticles: articles.count || 0,
    published: articles.data?.filter(a => a.status === 'published').length || 0,
    drafts: articles.data?.filter(a => a.status === 'draft').length || 0,
    pendingSubmissions: submissions.data?.filter(s => s.status === 'pending').length || 0,
    pendingComments: comments.data?.filter(c => !c.approved).length || 0,
    subscribers: subscribers.count || 0,
  }
}

async function getRecentSubmissions() {
  const { data } = await supabaseAdmin
    .from('submissions').select('*, categories(*)')
    .eq('status', 'pending').order('created_at', { ascending: false }).limit(5)
  return data || []
}

export default async function AdminDashboard() {
  const [stats, recentSubmissions] = await Promise.all([getStats(), getRecentSubmissions()])

  const statCards = [
    { label: 'Published',       value: stats.published,          color: 'bg-green-50 border-green-200',   text: 'text-green-800', href: '/admin/articles' },
    { label: 'Drafts',          value: stats.drafts,             color: 'bg-yellow-50 border-yellow-200', text: 'text-yellow-800', href: '/admin/articles' },
    { label: 'Submissions',     value: stats.pendingSubmissions, color: 'bg-orange-50 border-orange-200', text: 'text-orange-800', href: '/admin/submissions' },
    { label: 'Comments',        value: stats.pendingComments,    color: 'bg-blue-50 border-blue-200',     text: 'text-blue-800',   href: '/admin/comments' },
    { label: 'Subscribers',     value: stats.subscribers,        color: 'bg-purple-50 border-purple-200', text: 'text-purple-800', href: '/admin/newsletter' },
    { label: 'Total Articles',  value: stats.totalArticles,      color: 'bg-gray-50 border-gray-200',     text: 'text-gray-800',   href: '/admin/articles' },
  ]

  const quickActions = [
    { label: '✏️ Write New Article',          href: '/admin/articles/new',  primary: true },
    { label: `📥 Review Submissions (${stats.pendingSubmissions})`, href: '/admin/submissions', primary: false },
    { label: `💬 Moderate Comments (${stats.pendingComments})`,    href: '/admin/comments',    primary: false },
    { label: '⭐ Add Genius of Week',          href: '/admin/genius',        primary: false },
    { label: '🖼 Manage Gallery',              href: '/admin/gallery',       primary: false },
    { label: '📅 Manage Events',              href: '/admin/events',        primary: false },
  ]

  return (
    <div className="p-4 md:p-6 max-w-5xl">
      <div className="mb-5">
        <h1 className="font-serif text-2xl md:text-3xl font-black">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">Welcome to The SOW Chronicle admin panel.</p>
      </div>

      {/* Stats grid — 2 cols on mobile, 3 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {statCards.map(card => (
          <Link key={card.label} href={card.href}
            className={`border rounded p-3 md:p-4 hover:shadow-sm transition-shadow ${card.color}`}>
            <p className={`text-2xl md:text-3xl font-black font-serif ${card.text}`}>{card.value}</p>
            <p className="text-xs text-gray-500 mt-0.5 uppercase tracking-wide">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Quick actions */}
        <div>
          <h2 className="text-[10px] tracking-[2px] uppercase font-bold mb-3 pb-2 border-b border-gray-200">
            Quick Actions
          </h2>
          <div className="space-y-2">
            {quickActions.map(a => (
              <Link key={a.href} href={a.href}
                className={`flex items-center justify-between p-3 text-sm font-bold tracking-wide transition-colors ${
                  a.primary
                    ? 'bg-sow-blue text-white hover:bg-blue-900'
                    : 'border border-gray-200 text-ink hover:bg-gray-50'
                }`}>
                <span>{a.label}</span>
                <span className={a.primary ? 'text-white/60' : 'text-gray-300'}>→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent pending submissions */}
        <div>
          <h2 className="text-[10px] tracking-[2px] uppercase font-bold mb-3 pb-2 border-b border-gray-200">
            Pending Submissions
          </h2>
          {recentSubmissions.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No pending submissions.</p>
          ) : (
            <div className="space-y-2">
              {recentSubmissions.map((s: any) => (
                <div key={s.id} className="p-3 border border-orange-100 bg-orange-50 rounded">
                  <p className="text-sm font-bold leading-snug line-clamp-1">{s.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {s.student_name} · {s.student_class}
                    {s.categories && <> · {s.categories.name}</>}
                  </p>
                </div>
              ))}
              <Link href="/admin/submissions"
                className="text-xs text-sow-blue hover:underline font-bold block mt-1">
                View all →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
