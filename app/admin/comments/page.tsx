import { supabaseAdmin } from '@/lib/supabase'
import { format } from 'date-fns'
import CommentActions from './CommentActions'

export const revalidate = 0

export default async function AdminCommentsPage() {
  const { data: pending } = await supabaseAdmin
    .from('comments')
    .select('*, articles(title, slug)')
    .eq('approved', false)
    .order('created_at', { ascending: false })

  const { data: approved } = await supabaseAdmin
    .from('comments')
    .select('*, articles(title, slug)')
    .eq('approved', true)
    .order('created_at', { ascending: false })
    .limit(30)

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-black">Comment Moderation</h1>
        <p className="text-gray-500 text-sm mt-1">
          {pending?.length || 0} awaiting approval · {approved?.length || 0} approved (showing last 30)
        </p>
      </div>

      {/* Pending */}
      <div className="mb-8">
        <h2 className="text-[10px] tracking-[2px] uppercase font-bold mb-3 pb-2 border-b border-orange-200 text-orange-700">
          Awaiting Approval ({pending?.length || 0})
        </h2>

        {(!pending || pending.length === 0) ? (
          <div className="border border-green-100 bg-green-50 p-5 rounded text-center">
            <p className="text-green-700 font-bold text-sm">No pending comments — all clear!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map((c: any) => (
              <div key={c.id} className="border border-orange-100 bg-orange-50 rounded p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-bold text-sm">{c.commenter_name}</span>
                      {c.commenter_class && (
                        <span className="text-[10px] uppercase tracking-wide text-gray-500 border border-gray-300 px-1.5 py-0.5 rounded">
                          {c.commenter_class}
                        </span>
                      )}
                      <span className="text-[10px] text-gray-400">
                        {format(new Date(c.created_at), 'MMM d, yyyy · h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed mb-2">{c.content}</p>
                    {c.articles && (
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                        On: <span className="text-gray-600 font-semibold">{c.articles.title}</span>
                      </p>
                    )}
                  </div>
                  <CommentActions commentId={c.id} />
                </div>
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
          <div className="bg-white border border-gray-200 rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-2 text-[9px] tracking-[2px] uppercase text-gray-400 font-bold">Name</th>
                  <th className="text-left px-4 py-2 text-[9px] tracking-[2px] uppercase text-gray-400 font-bold">Comment</th>
                  <th className="text-left px-4 py-2 text-[9px] tracking-[2px] uppercase text-gray-400 font-bold">Article</th>
                  <th className="text-left px-4 py-2 text-[9px] tracking-[2px] uppercase text-gray-400 font-bold">Date</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {approved.map((c: any) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2.5 font-bold whitespace-nowrap">
                      {c.commenter_name}
                      {c.commenter_class && (
                        <span className="ml-1 text-[9px] text-gray-400 font-normal">· {c.commenter_class}</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-gray-600 max-w-xs">
                      <p className="line-clamp-2 text-xs">{c.content}</p>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-500 max-w-[140px] line-clamp-1">
                      {c.articles?.title || '—'}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-400 whitespace-nowrap">
                      {format(new Date(c.created_at), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-2.5">
                      <CommentActions commentId={c.id} approved />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
