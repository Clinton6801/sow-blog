import { notFound } from 'next/navigation'
import Masthead from '@/components/layout/Masthead'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'

interface Props { params: { id: string } }

export const revalidate = 3600

export default async function DigestDetailPage({ params }: Props) {
  const { data: digest } = await supabase
    .from('term_digests')
    .select('*')
    .eq('id', params.id)
    .eq('published', true)
    .maybeSingle()

  if (!digest) notFound()

  return (
    <>
      <Masthead />
      <div className="h-1.5 bg-sow-teal" />
      <main className="max-w-4xl mx-auto px-4 py-8">

        <nav className="text-[10px] tracking-[1.5px] uppercase mb-4" style={{ color: 'var(--text-faint)' }}>
          <Link href="/digest" className="hover:underline text-sow-teal">Term Digests</Link>
          <span className="mx-2">›</span>
          <span>{digest.term} {digest.academic_year}</span>
        </nav>

        <div className="bg-sow-teal px-6 py-5 text-white mb-6">
          <p className="text-[9px] tracking-[3px] uppercase font-bold opacity-70 mb-1">
            {digest.term} · {digest.academic_year}
          </p>
          <h1 className="font-serif text-4xl font-black">{digest.title}</h1>
          <p className="text-sm opacity-80 mt-1">
            Published {format(new Date(digest.created_at), 'MMMM d, yyyy')}
          </p>
        </div>

        {digest.cover_url && (
          <div className="w-full aspect-video overflow-hidden mb-6" style={{ backgroundColor: 'var(--bg-muted)' }}>
            <Image src={digest.cover_url} alt={digest.title} width={900} height={506}
              className="w-full h-full object-cover" />
          </div>
        )}

        {digest.intro && (
          <p className="font-serif italic text-lg leading-relaxed mb-6 border-l-4 border-sow-teal pl-4"
            style={{ color: 'var(--text-secondary)' }}>
            {digest.intro}
          </p>
        )}

        {digest.highlights && digest.highlights.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[10px] tracking-[2px] uppercase font-bold mb-3" style={{ color: 'var(--text-muted)' }}>
              Term Highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {digest.highlights.map((h: string, i: number) => (
                <div key={i} className="flex items-start gap-3 p-3 border"
                  style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-subtle)' }}>
                  <span className="text-sow-teal font-black text-lg leading-none flex-shrink-0">✓</span>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{h}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {digest.stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {Object.entries(digest.stats as Record<string, string | number>).map(([label, value]) => (
              <div key={label} className="text-center p-3 border"
                style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-subtle)' }}>
                <p className="text-3xl font-black font-serif text-sow-teal">{value}</p>
                <p className="text-[10px] uppercase tracking-wide mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        )}

        {digest.content && (
          <div className="article-content" dangerouslySetInnerHTML={{ __html: digest.content }} />
        )}

        <div className="mt-8 pt-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
          <Link href="/digest" className="text-sm font-bold text-sow-teal hover:underline">
            ← All Term Digests
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
