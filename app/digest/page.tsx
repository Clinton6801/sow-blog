import Masthead from '@/components/layout/Masthead'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'

export const revalidate = 3600

export default async function DigestPage() {
  // Get all published digests, newest first
  const { data: digests } = await supabase
    .from('term_digests')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })

  const all     = digests || []
  const latest  = all[0] || null
  const archive = all.slice(1)

  return (
    <>
      <Masthead />
      <div className="h-1.5 bg-sow-teal" />
      <main className="max-w-5xl mx-auto px-4 py-8">

        <div className="border-b-2 border-sow-teal pb-5 mb-8">
          <span className="category-badge badge-opinion mb-2 inline-block">Term Digest</span>
          <h1 className="font-serif text-5xl font-black" style={{ color: 'var(--text-primary)' }}>
            Term Highlights
          </h1>
          <p className="font-serif italic mt-1" style={{ color: 'var(--text-muted)' }}>
            A curated summary of the best stories, achievements, and moments from each term.
          </p>
        </div>

        {/* Latest digest */}
        {latest && (
          <section className="mb-12">
            <div className="section-heading section-teal mb-6">
              <span className="section-heading-label">Latest Digest</span>
              <div className="section-heading-rule" />
            </div>

            <div className="border-2 border-sow-teal overflow-hidden" style={{ backgroundColor: 'var(--bg-surface)' }}>
              {/* Header */}
              <div className="bg-sow-teal px-6 py-5 text-white">
                <p className="text-[9px] tracking-[3px] uppercase font-bold opacity-70 mb-1">
                  {latest.term} · {latest.academic_year}
                </p>
                <h2 className="font-serif text-3xl font-black">{latest.title}</h2>
                <p className="text-sm opacity-80 mt-1">
                  Published {format(new Date(latest.created_at), 'MMMM d, yyyy')}
                </p>
              </div>

              <div className="p-6">
                {/* Cover image */}
                {latest.cover_url && (
                  <div className="w-full aspect-video overflow-hidden mb-6" style={{ backgroundColor: 'var(--bg-muted)' }}>
                    <Image src={latest.cover_url} alt={latest.title} width={900} height={506}
                      className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Intro */}
                {latest.intro && (
                  <p className="font-serif italic text-lg leading-relaxed mb-6 border-l-4 border-sow-teal pl-4"
                    style={{ color: 'var(--text-secondary)' }}>
                    {latest.intro}
                  </p>
                )}

                {/* Highlights grid */}
                {latest.highlights && latest.highlights.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-[10px] tracking-[2px] uppercase font-bold mb-3"
                      style={{ color: 'var(--text-muted)' }}>
                      Term Highlights
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {latest.highlights.map((h: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 p-3 border"
                          style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-subtle)' }}>
                          <span className="text-sow-teal font-black text-lg leading-none flex-shrink-0">✓</span>
                          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{h}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats row */}
                {latest.stats && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {Object.entries(latest.stats as Record<string, string | number>).map(([label, value]) => (
                      <div key={label} className="text-center p-3 border"
                        style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-subtle)' }}>
                        <p className="text-3xl font-black font-serif text-sow-teal">{value}</p>
                        <p className="text-[10px] uppercase tracking-wide mt-0.5"
                          style={{ color: 'var(--text-muted)' }}>{label}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Full content */}
                {latest.content && (
                  <div className="article-content"
                    dangerouslySetInnerHTML={{ __html: latest.content }} />
                )}

                {/* Share prompt */}
                <div className="mt-6 pt-4 border-t flex items-center justify-between flex-wrap gap-3"
                  style={{ borderColor: 'var(--border-light)' }}>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-muted)' }}>
                    Share this digest with parents and students
                  </p>
                  <a href={`https://wa.me/?text=${encodeURIComponent(latest.title + ' — ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 text-white text-xs font-bold"
                    style={{ backgroundColor: '#25D366' }}>
                    📲 Share on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Archive */}
        {archive.length > 0 && (
          <section>
            <div className="section-heading section-default mb-5">
              <span className="section-heading-label">Previous Digests</span>
              <div className="section-heading-rule" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {archive.map((d: any) => (
                <Link key={d.id} href={`/digest/${d.id}`}
                  className="group flex gap-4 p-4 border hover:shadow-sm transition-all"
                  style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-surface)' }}>
                  {d.cover_url && (
                    <div className="w-20 h-16 flex-shrink-0 overflow-hidden" style={{ backgroundColor: 'var(--bg-muted)' }}>
                      <Image src={d.cover_url} alt={d.title} width={80} height={64}
                        className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div>
                    <p className="text-[9px] tracking-[2px] uppercase font-bold text-sow-teal mb-0.5">
                      {d.term} · {d.academic_year}
                    </p>
                    <h3 className="font-serif font-bold text-sm group-hover:underline"
                      style={{ color: 'var(--text-primary)' }}>
                      {d.title}
                    </h3>
                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-faint)' }}>
                      {format(new Date(d.created_at), 'MMMM yyyy')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {all.length === 0 && (
          <div className="text-center py-16" style={{ color: 'var(--text-faint)' }}>
            <p className="text-5xl mb-4">📋</p>
            <p className="italic">No term digests published yet.</p>
            <p className="text-xs mt-2">Digests are created from the admin panel.</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
