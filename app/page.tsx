import Masthead from '@/components/layout/Masthead'
import Footer from '@/components/layout/Footer'
import ArticleCard from '@/components/article/ArticleCard'
import NewsletterBox from '@/components/article/NewsletterBox'
import Ticker from '@/components/layout/Ticker'
import Pagination from '@/components/ui/Pagination'
import GeniusSection from '@/components/article/GeniusSection'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { Eye } from 'lucide-react'
import { getFeaturedArticle, getPublishedArticles } from '@/lib/queries'
import { supabase } from '@/lib/supabase'
import { getCategoryBadgeClass, getCategoryAccentColor } from '@/lib/categoryColors'

export const revalidate = 60

const PAGE_SIZE = 9

export default async function HomePage({ searchParams }: { searchParams: { page?: string } }) {
  const page = Math.max(1, parseInt(searchParams.page || '1', 10))

  const [featured, tickerData, countData] = await Promise.all([
    getFeaturedArticle(),
    supabase.from('ticker_items').select('text').eq('active', true).order('sort_order'),
    supabase.from('articles').select('id', { count: 'exact' }).eq('status', 'published'),
  ])

  const tickerItems = tickerData.data?.map((t: any) => t.text) || []
  const totalCount = (countData.count || 0) - (featured ? 1 : 0)
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const { data: pageArticles } = await supabase
    .from('articles')
    .select('*, categories(*)')
    .eq('status', 'published')
    .neq('id', featured?.id || '00000000-0000-0000-0000-000000000000')
    .order('published_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

  const articles = (pageArticles || []) as any[]

  // Most read sidebar
  const { data: mostRead } = await supabase
    .from('articles')
    .select('id, title, slug, views, categories(*)')
    .eq('status', 'published')
    .order('views', { ascending: false })
    .limit(5)

  const topThree = articles.slice(0, 3)
  const remaining = articles.slice(3)

  const featuredBadge = getCategoryBadgeClass(featured?.categories?.slug)
  const featuredAccent = getCategoryAccentColor(featured?.categories?.slug)

  return (
    <>
      <Masthead />
      <Ticker items={tickerItems} />

      <main className="max-w-6xl mx-auto px-4 py-6">

        {/* HERO */}
        {featured && page === 1 && (
          <section className="border-b-2 border-sow-blue pb-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="md:col-span-3 overflow-hidden bg-gray-100 relative" style={{ borderTop: `4px solid ${featuredAccent}` }}>
                {featured.cover_image_url ? (
                  <Image src={featured.cover_image_url} alt={featured.title} width={800} height={600} priority
                    className="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full aspect-[4/3] flex items-center justify-center text-white font-bold text-2xl font-serif"
                    style={{ backgroundColor: featuredAccent }}>
                    The SOW Chronicle
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className={`category-badge ${featuredBadge}`}>{featured.categories?.name}</span>
                </div>
              </div>

              <div className="md:col-span-2 flex flex-col justify-between border-l-0 md:border-l-4 md:pl-6"
                style={{ borderColor: featuredAccent }}>
                <div>
                  <div className="inline-block text-[9px] tracking-[3px] uppercase font-bold px-2 py-1 mb-3 text-white"
                    style={{ backgroundColor: featuredAccent }}>
                    ★ Featured Story
                  </div>
                  <Link href={`/article/${featured.slug}`}>
                    <h2 className="font-serif text-3xl md:text-4xl font-black leading-tight hover:underline mb-4 transition-colors"
                      style={{ '--hover-color': featuredAccent } as any}>
                      {featured.title}
                    </h2>
                  </Link>
                  {featured.excerpt && (
                    <p className="font-serif italic text-gray-600 text-base leading-relaxed mb-4">{featured.excerpt}</p>
                  )}
                </div>
                <div>
                  <p className="text-[11px] tracking-wide uppercase text-gray-400 mb-3">
                    By <strong className="text-ink">{featured.author_name}</strong>
                    {featured.published_at && <> · {format(new Date(featured.published_at), 'MMMM d, yyyy')}</>}
                    <span className="flex items-center gap-1 inline-flex ml-2"><Eye size={10} />{featured.views}</span>
                  </p>
                  <Link href={`/article/${featured.slug}`}
                    className="text-[11px] tracking-[2px] uppercase font-bold border-b-2 pb-0.5 hover:opacity-70 transition-opacity"
                    style={{ borderColor: featuredAccent, color: featuredAccent }}>
                    Read Full Story →
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* GENIUS OF THE WEEK */}
        <GeniusSection />

        {/* LATEST — 3 col grid */}
        {topThree.length > 0 && (
          <section className="mb-6 border-b border-gray-200 pb-6">
            <div className="section-heading section-blue">
              <span className="section-heading-label">Latest Stories</span>
              <div className="section-heading-rule" />
              <span className="text-[10px] tracking-[1.5px] uppercase text-gray-400 whitespace-nowrap">Page {page}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topThree.map(article => <ArticleCard key={article.id} article={article} />)}
            </div>
          </section>
        )}

        {/* TWO-COL: more stories + sidebar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {remaining.length > 0 && (
              <>
                <div className="section-heading section-default">
                  <span className="section-heading-label">More Stories</span>
                  <div className="section-heading-rule" />
                </div>
                <div className="space-y-0">
                  {remaining.map(article => <ArticleCard key={article.id} article={article} variant="horizontal" />)}
                </div>
              </>
            )}
            <Pagination currentPage={page} totalPages={totalPages} basePath="/" />
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Most Read */}
            {mostRead && mostRead.length > 0 && (
              <div>
                <div className="section-heading section-red">
                  <span className="section-heading-label">Most Read</span>
                  <div className="section-heading-rule" />
                </div>
                <div className="space-y-3">
                  {mostRead.map((a: any, i: number) => (
                    <div key={a.id} className="flex gap-3 items-start border-b border-gray-100 pb-3 last:border-0">
                      <span className="text-2xl font-black text-sow-red/20 font-serif leading-none w-6 flex-shrink-0">{i + 1}</span>
                      <div>
                        <Link href={`/article/${a.slug}`}>
                          <p className="font-serif text-sm font-bold leading-snug hover:text-sow-blue hover:underline transition-colors">{a.title}</p>
                        </Link>
                        <span className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5">
                          <Eye size={9} /> {a.views} views
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Categories */}
            <div>
              <div className="section-heading section-green">
                <span className="section-heading-label">Browse</span>
                <div className="section-heading-rule" />
              </div>
              <div className="space-y-1">
                {[
                  { label: '📰 News',          href: '/category/news',         color: 'bg-sow-blue' },
                  { label: '📚 Academics',      href: '/category/academics',    color: 'bg-sow-green' },
                  { label: '⚽ Sports',         href: '/category/sports',       color: 'bg-sow-red' },
                  { label: '🎭 Arts & Culture', href: '/category/arts-culture', color: 'bg-sow-purple' },
                  { label: '💬 Opinion',        href: '/category/opinion',      color: 'bg-sow-teal' },
                  { label: '📅 Events',         href: '/category/events',       color: 'bg-sow-gold' },
                ].map(cat => (
                  <Link key={cat.href} href={cat.href}
                    className="flex items-center gap-2 py-2 border-b border-gray-100 text-sm hover:text-sow-blue transition-colors group font-medium">
                    <span>{cat.label}</span>
                    <span className="ml-auto text-gray-300 group-hover:text-sow-blue">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Submit CTA */}
            <div className="bg-sow-blue text-white p-5">
              <h3 className="font-serif text-xl font-black mb-2 text-sow-gold">Have a Story?</h3>
              <p className="text-sm text-blue-200 leading-relaxed mb-4">
                Any student can submit an article. The editorial team reviews all submissions.
              </p>
              <Link href="/submit"
                className="block text-center bg-sow-gold text-ink text-[10px] tracking-[2px] uppercase font-bold px-4 py-2 hover:bg-amber-400 transition-colors">
                Submit Your Story
              </Link>
            </div>

            <NewsletterBox />
          </aside>
        </div>
      </main>
      <Footer />
    </>
  )
}
