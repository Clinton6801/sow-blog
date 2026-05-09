import { notFound } from 'next/navigation'
import Masthead from '@/components/layout/Masthead'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'

interface Props { params: { slug: string } }

export const revalidate = 60

export default async function ClubPage({ params }: Props) {
  const { data: club } = await supabase
    .from('clubs')
    .select('*')
    .eq('slug', params.slug)
    .eq('active', true)
    .maybeSingle()

  if (!club) notFound()

  const { data: posts } = await supabase
    .from('club_posts')
    .select('*')
    .eq('club_id', club.id)
    .eq('published', true)
    .order('created_at', { ascending: false })

  const postList = posts || []
  const clubColor = club.color || '#1e3a8a'

  return (
    <>
      <Masthead />
      <div className="h-1.5" style={{ backgroundColor: clubColor }} />
      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <nav className="text-[10px] tracking-[1.5px] uppercase mb-4" style={{ color: 'var(--text-faint)' }}>
          <Link href="/clubs" className="hover:underline" style={{ color: clubColor }}>Clubs</Link>
          <span className="mx-2">›</span>
          <span>{club.name}</span>
        </nav>

        {/* Club header */}
        <div className="border-b-2 pb-6 mb-8" style={{ borderColor: clubColor }}>
          <div className="flex items-start gap-5">
            {/* Club icon / cover */}
            <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center text-4xl rounded-lg"
              style={{ backgroundColor: clubColor }}>
              <span>{club.emoji || '🏫'}</span>
            </div>
            <div className="flex-1">
              <span className="text-[9px] tracking-[2px] uppercase font-bold px-2 py-0.5 text-white inline-block mb-2"
                style={{ backgroundColor: clubColor }}>
                School Club
              </span>
              <h1 className="font-serif text-4xl font-black" style={{ color: 'var(--text-primary)' }}>{club.name}</h1>
              {club.tagline && (
                <p className="font-serif italic mt-1" style={{ color: 'var(--text-secondary)' }}>{club.tagline}</p>
              )}
              {club.description && (
                <p className="text-sm mt-3 leading-relaxed max-w-2xl" style={{ color: 'var(--text-secondary)' }}>{club.description}</p>
              )}
              <div className="flex flex-wrap gap-4 mt-3 text-[10px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                {club.patron && <span>👤 Patron: <strong style={{ color: 'var(--text-primary)' }}>{club.patron}</strong></span>}
                {club.meeting_day && <span>📅 Meets: <strong style={{ color: 'var(--text-primary)' }}>{club.meeting_day}</strong></span>}
                {club.member_count && <span>👥 <strong style={{ color: 'var(--text-primary)' }}>{club.member_count}</strong> members</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Posts */}
        <div className="section-heading mb-5" style={{ '--accent': clubColor } as any}>
          <span className="text-white text-[10px] tracking-[2.5px] uppercase font-bold px-3 py-1 whitespace-nowrap"
            style={{ backgroundColor: clubColor }}>
            Activities & News
          </span>
          <div className="flex-1 border-t-2" style={{ borderColor: clubColor }} />
          <span className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--text-faint)' }}>
            {postList.length} post{postList.length !== 1 ? 's' : ''}
          </span>
        </div>

        {postList.length === 0 ? (
          <div className="text-center py-16" style={{ color: 'var(--text-faint)' }}>
            <p className="text-4xl mb-3">📋</p>
            <p className="italic">No posts from this club yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {postList.map((post: any) => (
              <Link key={post.id} href={`/clubs/${params.slug}/${post.id}`}
                className="group block border hover:shadow-md transition-all overflow-hidden"
                style={{ borderColor: 'var(--border-light)', borderTop: `3px solid ${clubColor}` }}>
                {post.cover_url && (
                  <div className="relative aspect-video overflow-hidden" style={{ backgroundColor: 'var(--bg-muted)' }}>
                    <Image src={post.cover_url} alt={post.title} fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <div className="p-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
                  <h3 className="font-serif font-bold text-base leading-snug group-hover:underline mb-1"
                    style={{ color: 'var(--text-primary)' }}>
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm line-clamp-2 mb-2" style={{ color: 'var(--text-secondary)' }}>{post.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--text-faint)' }}>
                      {format(new Date(post.created_at), 'MMM d, yyyy')}
                    </p>
                    {post.author_name && (
                      <p className="text-[10px]" style={{ color: 'var(--text-faint)' }}>By {post.author_name}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
