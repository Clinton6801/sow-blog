import Masthead from '@/components/layout/Masthead'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'

export const revalidate = 60

const CLUB_COLORS: Record<string, { bg: string; text: string; border: string; emoji: string }> = {
  press:    { bg: '#1e3a8a', text: '#ffffff', border: '#1e3a8a', emoji: '📰' },
  stem:     { bg: '#15803d', text: '#ffffff', border: '#15803d', emoji: '🔬' },
  literary: { bg: '#7c3aed', text: '#ffffff', border: '#7c3aed', emoji: '📚' },
  debate:   { bg: '#dc2626', text: '#ffffff', border: '#dc2626', emoji: '🎤' },
  drama:    { bg: '#d97706', text: '#1a1a2e', border: '#d97706', emoji: '🎭' },
  music:    { bg: '#0e7490', text: '#ffffff', border: '#0e7490', emoji: '🎵' },
  default:  { bg: '#1a1a2e', text: '#ffffff', border: '#1a1a2e', emoji: '🏫' },
}

function getClubStyle(slug: string) {
  return CLUB_COLORS[slug] || CLUB_COLORS.default
}

export default async function ClubsPage() {
  const { data: clubs } = await supabase
    .from('clubs')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true })

  const clubList = clubs || []

  // Get recent posts for each club
  const { data: recentPosts } = await supabase
    .from('club_posts')
    .select('*, clubs(name, slug, color)')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(6)

  const posts = recentPosts || []

  return (
    <>
      <Masthead />
      <div className="h-1.5 bg-sow-green" />
      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="border-b-2 border-sow-green pb-5 mb-8">
          <span className="category-badge badge-academics mb-2 inline-block">School Clubs</span>
          <h1 className="font-serif text-5xl font-black" style={{ color: 'var(--text-primary)' }}>Club Activities</h1>
          <p className="font-serif italic mt-1" style={{ color: 'var(--text-muted)' }}>
            News, updates, and achievements from every club at Seat of Wisdom Schools
          </p>
        </div>

        {/* Club cards */}
        {clubList.length > 0 && (
          <section className="mb-10">
            <div className="section-heading section-green mb-5">
              <span className="section-heading-label">Our Clubs</span>
              <div className="section-heading-rule" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {clubList.map((club: any) => {
                const style = getClubStyle(club.slug)
                return (
                  <Link key={club.id} href={`/clubs/${club.slug}`}
                    className="group block border-2 hover:shadow-md transition-all overflow-hidden"
                    style={{ borderColor: club.color || style.border }}>
                    {/* Cover image or color block */}
                    <div className="relative aspect-video overflow-hidden"
                      style={{ backgroundColor: club.color || style.bg }}>
                      {club.cover_url ? (
                        <Image src={club.cover_url} alt={club.name} fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80" />
                      ) : null}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl drop-shadow">{club.emoji || style.emoji}</span>
                      </div>
                    </div>
                    {/* Info */}
                    <div className="p-3" style={{ backgroundColor: 'var(--bg-surface)' }}>
                      <h3 className="font-serif font-black text-base leading-tight group-hover:underline"
                        style={{ color: 'var(--text-primary)' }}>
                        {club.name}
                      </h3>
                      {club.tagline && (
                        <p className="text-xs mt-0.5 line-clamp-1" style={{ color: 'var(--text-muted)' }}>{club.tagline}</p>
                      )}
                      <span className="text-[9px] tracking-[1.5px] uppercase font-bold mt-2 inline-block"
                        style={{ color: club.color || style.bg }}>
                        View Activities →
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* Recent posts across all clubs */}
        {posts.length > 0 && (
          <section>
            <div className="section-heading section-blue mb-5">
              <span className="section-heading-label">Recent Club Posts</span>
              <div className="section-heading-rule" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.map((post: any) => {
                const clubStyle = getClubStyle(post.clubs?.slug || '')
                const clubColor = post.clubs?.color || clubStyle.bg
                return (
                  <Link key={post.id} href={`/clubs/${post.clubs?.slug}/${post.id}`}
                    className="group block border hover:shadow-md transition-all overflow-hidden"
                    style={{ borderColor: 'var(--border-light)' }}>
                    {post.cover_url && (
                      <div className="relative aspect-video overflow-hidden" style={{ backgroundColor: 'var(--bg-muted)' }}>
                        <Image src={post.cover_url} alt={post.title} fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
                      {/* Club badge */}
                      <span className="text-[9px] tracking-[2px] uppercase font-bold px-2 py-0.5 text-white inline-block mb-2"
                        style={{ backgroundColor: clubColor }}>
                        {post.clubs?.name || 'Club'}
                      </span>
                      <h3 className="font-serif font-bold text-base leading-snug group-hover:underline mb-1"
                        style={{ color: 'var(--text-primary)' }}>
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{post.excerpt}</p>
                      )}
                      <p className="text-[10px] mt-2 uppercase tracking-wide" style={{ color: 'var(--text-faint)' }}>
                        {format(new Date(post.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {clubList.length === 0 && posts.length === 0 && (
          <div className="text-center py-16" style={{ color: 'var(--text-faint)' }}>
            <p className="text-5xl mb-4">🏫</p>
            <p className="italic">No club activities yet. Check back soon!</p>
            <p className="text-xs mt-2">Clubs are managed from the admin panel.</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
