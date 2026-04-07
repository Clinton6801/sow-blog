import { supabaseAdmin } from '@/lib/supabase'
import { format } from 'date-fns'
import CommentActions from './CommentActions'

export const revalidate = 0

export default async function AdminCommentsPage() {
  const { data: pending } = await supabaseAdmin
    .from('comments').select('*, articles(title, slug)')
    .eq('approved', false).order('created_at', { ascending: false })

  const { data: approved } = await supabaseAdmin
    .from('comments').select('*, articles(title, slug)')
    .eq('approved', true).order('created_at', { ascending: false }).limit(30)

  return (
    <div className="p-4 md:p-6">
      <div className="mb-5">
        <h1 className="font-serif text-2xl md:text-3xl font-black">Comment Moderation</h1>
        <p className="text-gray-500 text-sm mt-0.5">{pending?.length || 0} awaiting approval</p>
      </div>

      {/* Pending */}
      <div className="mb-8">
        <h2 className="text-[10px] tracking-[2px] uppercase font-bold mb-3 pb-2 border-b border-orange-200 text-orange-700">
          Awaiting Approval ({pending?.length || 0})
        </h2>
        {(!pending || pending.length === 0) ? (
          <div className="border border-green-100 bg-green-50 p-5 rounded text-center">
            <p className="text-green-700 font-bold text-sm">No pending comments!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map((c: any) => (
              <div key={c.id} className="border border-orange-100 bg-orange-50 rounded p-4">
                <div className="flex items-start gap-2 mb-2 flex-wrap">
                  <span className="font-bold text-sm">{c.commenter_name}</span>
                  {c.commenter_class && (
                    <span className="text-[10px] uppercase tracking-wide text-gray-500 border border-gray-300 px-1.5 py-0.5 rounded">
                      {c.commenter_class}
                    </span>
                  )}
                  <span className="text-[10px] text-gray-400 ml-auto">
                    {format(new Date(c.created_at), 'MMM d, yyyy')}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed mb-2">{c.content}</p>
                {c.articles && (
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-3">
                    On: <span className="text-gray-600 font-semibold">{c.articles.title}</span>
                  </p>
                )}
                <CommentActions commentId={c.id} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approved */}
      {approved && approved.length > 0 && (
        <div>
          <h2 className="text-[10px] tracking-[2px] uppercase font-bold mb-3 pb-2 border-b border-gray-200 text-gray-500">
            Recently Approved
          </h2>
          <div className="space-y-2">
            {approved.map((c: any) => (
              <div key={c.id} className="flex items-start gap-3 p-3 bg-white border border-gray-200 rounded group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm">{c.commenter_name}</span>
                    {c.commenter_class && <span className="text-[10px] text-gray-400">{c.commenter_class}</span>}
                    <span className="text-[10px] text-gray-400 ml-auto">{format(new Date(c.created_at), 'MMM d')}</span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 mt-0.5">{c.content}</p>
                  {c.articles && <p className="text-[10px] text-gray-400 mt-0.5">On: {c.articles.title}</p>}
                </div>
                <CommentActions commentId={c.id} approved />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
