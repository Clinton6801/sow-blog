import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Masthead from '@/components/layout/Masthead'
import Footer from '@/components/layout/Footer'
import BackToTop from '@/components/ui/BackToTop'
import ReadingProgress from '@/components/article/ReadingProgress'
import WhatsAppShare from '@/components/article/WhatsAppShare'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'

interface Props { params: { slug: string; postId: string } }

export const revalidate = 60

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: post } = await supabase
    .from('club_posts')
    .select('*, clubs(name)')
    .eq('id', params.postId)
    .maybeSingle()

  if (!post) return { title: 'Post Not Found' }

  return {
    title: `${post.title} | ${post.clubs?.name} | The SOW Chronicle`,
    description: post.excerpt || '',
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      images: post.cover_url ? [post.cover_url] : [],
    },
  }
}

export default async function ClubPostPage({ params }: Props) {
  const { data: post } = await supabase
    .from('club_posts')
    .select('*, clubs(*)')
    .eq('id', params.postId)
    .eq('published', true)
    .maybeSingle()

  if (!post) notFound()

  const club = post.clubs
  const clubColor = club?.color || '#1e3a8a'

  // Related posts from same club
  const { data: related } = await supabase
    .from('club_posts')
    .select('id, title, excerpt, cover_url, created_at')
    .eq('club_id', post.club_id)
    .eq('published', true)
    .neq('id', post.id)
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <>
      <ReadingProgress />
      <Masthead />
      <div className="h-1" style={{ backgroundColor: clubColor }} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="text-[10px] tracking-[1.5px] uppercase mb-4" style={{ color: 'var(--text-faint)' }}>
          <Link href="/clubs" className="hover:underline" style={{ color: clubColor }}>Clubs</Link>
          <span className="mx-2">›</span>
          <Link href={`/clubs/${params.slug}`} className="hover:underline" style={{ color: clubColor }}>
            {club?.name}
          </Link>
          <span className="mx-2">›</span>
          <span className="line-clamp-1">{post.title}</span>
        </nav>

        {/* Club badge */}
        <span className="text-[9px] tracking-[2px] uppercase font-bold px-2 py-0.5 text-white inline-block mb-3"
          style={{ backgroundColor: clubColor }}>
          {club?.emoji || '🏫'} {club?.name}
        </span>

        <h1 className="font-serif text-4xl md:text-5xl font-black leading-tight mb-4"
          style={{ color: 'var(--text-primary)' }}>
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="font-serif italic text-xl border-l-4 pl-4 mb-4 leading-relaxed py-2"
            style={{ borderColor: clubColor, color: 'var(--text-secondary)' }}>
            {post.excerpt}
          </p>
        )}

        {/* Byline */}
        <div className="flex items-center gap-3 py-3 border-t border-b mb-6" style={{ borderColor: 'var(--border-light)' }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ backgroundColor: clubColor }}>
            {(post.author_name || club?.name || 'C').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              {post.author_name || club?.name}
            </p>
            <p className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--text-faint)' }}>
              {club?.name} · {format(new Date(post.created_at), 'MMMM d, yyyy')}
            </p>
          </div>
        </div>

        {/* Cover image */}
        {post.cover_url && (
          <div className="w-full aspect-video overflow-hidden mb-6" style={{ backgroundColor: 'var(--bg-muted)' }}>
            <Image src={post.cover_url} alt={post.title} width={800} height={450} priority
              className="w-full h-full object-cover" />
          </div>
        )}

        {/* Content */}
        <div className="article-content" dangerouslySetInnerHTML={{ __html: post.content }} />

        {/* Photo gallery */}
        {post.gallery_images && post.gallery_images.length > 0 && (
          <div className="my-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-white text-[9px] tracking-[2px] uppercase font-black px-2 py-1"
                style={{ backgroundColor: clubColor }}>
                📷 Photos
              </span>
              <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
                {post.gallery_images.length} photo{post.gallery_images.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {post.gallery_images.map((img: { url: string; caption: string }, i: number) => (
                <div key={i} className="relative aspect-video overflow-hidden" style={{ backgroundColor: 'var(--bg-muted)' }}>
                  <Image src={img.url} alt={img.caption || `Photo ${i + 1}`} fill className="object-cover" />
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                      <p className="text-white text-[10px] line-clamp-1">{img.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Back to club */}
        <div className="mt-8 pt-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
          <Link href={`/clubs/${params.slug}`}
            className="text-sm font-bold hover:underline"
            style={{ color: clubColor }}>
            ← Back to {club?.name}
          </Link>
        </div>

        {/* Related posts */}
        {related && related.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-white text-[10px] tracking-[2.5px] uppercase font-bold px-3 py-1"
                style={{ backgroundColor: clubColor }}>
                More from {club?.name}
              </span>
              <div className="flex-1 border-t-2" style={{ borderColor: clubColor }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((r: any) => (
                <Link key={r.id} href={`/clubs/${params.slug}/${r.id}`}
                  className="group block border hover:shadow-sm transition-all"
                  style={{ borderColor: 'var(--border-light)' }}>
                  {r.cover_url && (
                    <div className="relative aspect-video overflow-hidden" style={{ backgroundColor: 'var(--bg-muted)' }}>
                      <Image src={r.cover_url} alt={r.title} fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="p-3" style={{ backgroundColor: 'var(--bg-surface)' }}>
                    <h4 className="font-serif font-bold text-sm leading-snug group-hover:underline"
                      style={{ color: 'var(--text-primary)' }}>
                      {r.title}
                    </h4>
                    <p className="text-[10px] mt-1" style={{ color: 'var(--text-faint)' }}>
                      {format(new Date(r.created_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <BackToTop />
      <WhatsAppShare title={post.title} />
      <Footer />
    </>
  )
}
