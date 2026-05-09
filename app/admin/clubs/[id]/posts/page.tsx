import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import { format } from 'date-fns'
import DeleteClubPostButton from './DeleteClubPostButton'

interface Props { params: { id: string } }

export const revalidate = 0

export default async function ClubPostsPage({ params }: Props) {
  const { data: club } = await supabaseAdmin
    .from('clubs')
    .select('*')
    .eq('id', params.id)
    .maybeSingle()

  if (!club) notFound()

  const { data: posts } = await supabaseAdmin
    .from('club_posts')
    .select('*')
    .eq('club_id', params.id)
    .order('created_at', { ascending: false })

  const clubColor = club.color || '#1e3a8a'

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin/clubs" className="text-xs text-gray-400 hover:underline">← Clubs</Link>
          </div>
          <h1 className="font-serif text-2xl font-black flex items-center gap-2">
            <span style={{ color: clubColor }}>{club.emoji}</span>
            {club.name} — Posts
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{posts?.length || 0} posts</p>
        </div>
        <Link href={`/admin/clubs/${params.id}/posts/new`} className="btn-primary text-xs px-3 py-2">
          + New Post
        </Link>
      </div>

      {/* Posts table */}
      {(!posts || posts.length === 0) ? (
        <div className="text-center py-16 text-gray-400 border border-dashed border-gray-200 rounded">
          <p className="text-4xl mb-3">📋</p>
          <p className="italic mb-4">No posts yet for this club.</p>
          <Link href={`/admin/clubs/${params.id}/posts/new`} className="btn-primary text-sm">
            Write First Post
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-[10px] tracking-[2px] uppercase text-gray-400 font-bold">Title</th>
                <th className="text-left px-4 py-3 text-[10px] tracking-[2px] uppercase text-gray-400 font-bold">Status</th>
                <th className="text-left px-4 py-3 text-[10px] tracking-[2px] uppercase text-gray-400 font-bold">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((post: any) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-bold leading-snug line-clamp-1 max-w-xs">{post.title}</p>
                    {post.excerpt && <p className="text-xs text-gray-400 line-clamp-1">{post.excerpt}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[9px] tracking-[1px] uppercase font-bold px-2 py-1 rounded ${
                      post.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                    {format(new Date(post.created_at), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3 items-center">
                      <Link href={`/admin/clubs/${params.id}/posts/${post.id}/edit`}
                        className="text-xs text-sow-blue hover:underline font-bold">Edit</Link>
                      <Link href={`/clubs/${club.slug}/${post.id}`} target="_blank"
                        className="text-xs text-gray-400 hover:underline">View</Link>
                      <DeleteClubPostButton postId={post.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
