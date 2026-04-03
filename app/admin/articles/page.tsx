import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import { format } from 'date-fns'
import DeleteArticleButton from './DeleteArticleButton'

export const revalidate = 0

export default async function AdminArticlesPage() {
  const { data: articles } = await supabaseAdmin
    .from('articles')
    .select('*, categories(*)')
    .order('created_at', { ascending: false })

  const statusColor: Record<string, string> = {
    published: 'bg-green-100 text-green-800',
    draft:     'bg-yellow-100 text-yellow-800',
    archived:  'bg-gray-100 text-gray-600',
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl font-black">Articles</h1>
          <p className="text-gray-500 text-sm mt-1">{articles?.length || 0} total</p>
        </div>
        <Link href="/admin/articles/new" className="btn-primary text-sm">+ New Article</Link>
      </div>

      <div className="bg-white border border-gray-200 rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-[10px] tracking-[2px] uppercase text-gray-400 font-bold">Title</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[2px] uppercase text-gray-400 font-bold">Category</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[2px] uppercase text-gray-400 font-bold">Status</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[2px] uppercase text-gray-400 font-bold">Views</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[2px] uppercase text-gray-400 font-bold">Date</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {articles?.map((article: any) => (
              <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-bold leading-snug line-clamp-1 max-w-xs">{article.title}</p>
                  {article.featured && (
                    <span className="text-[9px] tracking-wide uppercase text-amber-600 font-bold">★ Featured</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{article.categories?.name || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`text-[9px] tracking-[1px] uppercase font-bold px-2 py-1 rounded ${statusColor[article.status]}`}>
                    {article.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">{article.views}</td>
                <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                  {format(new Date(article.created_at), 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3 items-center">
                    <Link href={`/admin/articles/${article.id}/edit`}
                      className="text-xs text-sow-blue hover:underline font-bold">Edit</Link>
                    <Link href={`/article/${article.slug}`} target="_blank"
                      className="text-xs text-gray-400 hover:underline">View</Link>
                    <DeleteArticleButton articleId={article.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!articles || articles.length === 0) && (
          <div className="text-center py-12 text-gray-400">
            <p className="italic">No articles yet.</p>
            <Link href="/admin/articles/new" className="text-sm text-sow-blue font-bold hover:underline mt-2 inline-block">
              Write your first article →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
