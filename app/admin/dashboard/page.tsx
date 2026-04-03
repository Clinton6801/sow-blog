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
    .from('submissions')
    .select('*, categories(*)')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(5)
  return data || []
}

export default async function AdminDashboard() {
  const [stats, recentSubmissions] = await Promise.all([getStats(), getRecentSubmissions()])

  const statCards = [
    { label: 'Published Articles', value: stats.published, color: 'bg-green-50 border-green-200', textColor: 'text-green-800' },
    { label: 'Drafts', value: stats.drafts, color: 'bg-yellow-50 border-yellow-200', textColor: 'text-yellow-800' },
    { label: 'Pending Submissions', value: stats.pendingSubmissions, color: 'bg-orange-50 border-orange-200', textColor: 'text-orange-800' },
    { label: 'Awaiting Comment Approval', value: stats.pendingComments, color: 'bg-blue-50 border-blue-200', textColor: 'text-blue-800' },
    { label: 'Newsletter Subscribers', value: stats.subscribers, color: 'bg-purple-50 border-purple-200', textColor: 'text-purple-800' },
    { label: 'Total Articles', value: stats.totalArticles, color: 'bg-gray-50 border-gray-200', textColor: 'text-gray-800' },
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-black">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome to The SOW Chronicle admin panel.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className={`border rounded p-4 ${card.color}`}>
            <p className={`text-3xl font-black font-serif ${card.textColor}`}>{card.value}</p>
            <p className="text-xs text-gray-600 mt-1 uppercase tracking-wide">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-[10px] tracking-[2px] uppercase font-bold mb-3 pb-2 border-b border-gray-200">Quick Actions</h2>
          <div className="space-y-2">
            <Link href="/admin/articles/new" className="flex items-center justify-between p-3 border border-ink bg-ink text-paper hover:bg-gray-800 transition-colors text-sm font-bold tracking-wide">
              <span>Write New Article</span>
              <span>→</span>
            </Link>
            <Link href="/admin/submissions" className="flex items-center justify-between p-3 border border-ink hover:bg-gray-50 transition-colors text-sm font-bold tracking-wide">
              <span>Review Submissions ({stats.pendingSubmissions})</span>
              <span>→</span>
            </Link>
            <Link href="/admin/articles" className="flex items-center justify-between p-3 border border-gray-200 hover:bg-gray-50 transition-colors text-sm tracking-wide">
              <span>Manage Articles</span>
              <span className="text-gray-400">→</span>
            </Link>
            <Link href="/admin/newsletter" className="flex items-center justify-between p-3 border border-gray-200 hover:bg-gray-50 transition-colors text-sm tracking-wide">
              <span>Newsletter Subscribers ({stats.subscribers})</span>
              <span className="text-gray-400">→</span>
            </Link>
          </div>
        </div>

        {/* Recent pending submissions */}
        <div>
          <h2 className="text-[10px] tracking-[2px] uppercase font-bold mb-3 pb-2 border-b border-gray-200">
            Pending Student Submissions
          </h2>
          {recentSubmissions.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No pending submissions.</p>
          ) : (
            <div className="space-y-2">
              {recentSubmissions.map((s: any) => (
                <div key={s.id} className="p-3 border border-orange-100 bg-orange-50">
                  <p className="text-sm font-bold leading-snug">{s.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    By {s.student_name} · {s.student_class}
                    {s.categories && <> · {s.categories.name}</>}
                  </p>
                </div>
              ))}
              <Link href="/admin/submissions" className="text-xs text-gray-500 hover:text-ink underline block mt-1">
                View all submissions →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
