import { notFound } from 'next/navigation'
import Masthead from '@/components/layout/Masthead'
import Footer from '@/components/layout/Footer'
import Comments from '@/components/article/Comments'
import NewsletterBox from '@/components/article/NewsletterBox'
import ShareButtons from '@/components/article/ShareButtons'
import ArticleCard from '@/components/article/ArticleCard'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { Eye } from 'lucide-react'
import { getArticleBySlug, getApprovedComments, getPublishedArticles, incrementViews } from '@/lib/queries'
import { getCategoryBadgeClass, getCategoryAccentColor } from '@/lib/categoryColors'

interface Props { params: { slug: string } }

export const revalidate = 60

export default async function ArticlePage({ params }: Props) {
  const [article, recentArticles] = await Promise.all([
    getArticleBySlug(params.slug),
    getPublishedArticles(6),
  ])

  if (!article) notFound()

  const comments = await getApprovedComments(article.id)
  incrementViews(article.id).catch(() => {})

  const related = recentArticles
    .filter(a => a.id !== article.id && a.category_id === article.category_id)
    .slice(0, 4)

  const mostRead = recentArticles
    .filter(a => a.id !== article.id)
    .sort((a, b) => b.views - a.views)
    .slice(0, 4)

  const badgeClass = getCategoryBadgeClass(article.categories?.slug)
  const accentColor = getCategoryAccentColor(article.categories?.slug)

  return (
    <>
      <Masthead />

      {/* Category colour bar */}
      <div className="h-1" style={{ backgroundColor: accentColor }} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Article */}
          <article className="md:col-span-2">
            {/* Breadcrumb */}
            <nav className="text-[10px] tracking-[1.5px] uppercase text-gray-400 mb-4 no-print">
              <Link href="/" className="hover:text-sow-blue">Home</Link>
              {article.categories && (
                <>
                  <span className="mx-2">›</span>
                  <Link href={`/category/${article.categories.slug}`} className="hover:text-sow-blue">
                    {article.categories.name}
                  </Link>
                </>
              )}
            </nav>

            {article.categories && (
              <span className={`category-badge ${badgeClass} mb-3 inline-block`}>{article.categories.name}</span>
            )}

            <h1 className="font-serif text-4xl md:text-5xl font-black leading-tight mb-4">
              {article.title}
            </h1>

            {article.excerpt && (
              <p className="font-serif italic text-xl text-gray-700 border-l-4 pl-4 mb-4 leading-relaxed py-2"
                style={{ borderColor: accentColor }}>
                {article.excerpt}
              </p>
            )}

            {/* Byline */}
            <div className="flex items-center gap-3 py-3 border-t border-b border-gray-200 mb-6">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                style={{ backgroundColor: accentColor }}>
                {article.author_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">{article.author_name}</p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wide">
                  {article.author_role}
                  {article.published_at && <> · {format(new Date(article.published_at), 'MMMM d, yyyy')}</>}
                </p>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-400">
                <Eye size={14} />
                <span>{article.views + 1} views</span>
              </div>
            </div>

            {/* Cover image */}
            {article.cover_image_url && (
              <div className="w-full aspect-video overflow-hidden bg-gray-100 mb-6">
                <Image src={article.cover_image_url} alt={article.title} width={800} height={450} priority
                  className="w-full h-full object-cover" />
              </div>
            )}

            {/* Content */}
            <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }} />

            {/* Share buttons */}
            <div className="mt-8 pt-4 border-t border-gray-200 no-print">
              <ShareButtons title={article.title} />
            </div>

            {/* Author link */}
            <div className="mt-4 p-4 border-l-4 no-print" style={{ borderColor: accentColor, backgroundColor: accentColor + '10' }}>
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Written by</p>
              <Link href={`/author/${encodeURIComponent(article.author_name)}`}
                className="font-bold hover:underline" style={{ color: accentColor }}>
                {article.author_name}
              </Link>
              {article.author_role && <span className="text-xs text-gray-500 ml-2">· {article.author_role}</span>}
              <p className="text-xs text-gray-500 mt-1">
                <Link href={`/author/${encodeURIComponent(article.author_name)}`}
                  className="hover:underline" style={{ color: accentColor }}>
                  View all articles by this author →
                </Link>
              </p>
            </div>

            <Comments articleId={article.id} initialComments={comments} />
          </article>

          {/* Sidebar */}
          <aside className="space-y-6 no-print">
            {/* Related */}
            {related.length > 0 && (
              <div>
                <div className={`section-heading section-${article.categories?.slug === 'news' ? 'blue' : 'default'}`}
                  style={{ '--accent': accentColor } as any}>
                  <span className="section-heading-label" style={{ backgroundColor: accentColor }}>Related</span>
                  <div className="section-heading-rule" style={{ borderColor: accentColor }} />
                </div>
                <div className="space-y-3">
                  {related.map(a => <ArticleCard key={a.id} article={a} variant="compact" />)}
                </div>
              </div>
            )}

            {/* Most read */}
            {mostRead.length > 0 && (
              <div>
                <div className="section-heading section-red">
                  <span className="section-heading-label">Most Read</span>
                  <div className="section-heading-rule" />
                </div>
                <div className="space-y-3">
                  {mostRead.map((a, i) => (
                    <div key={a.id} className="flex gap-3 items-start border-b border-gray-100 pb-3 last:border-0">
                      <span className="text-2xl font-black text-sow-red/20 font-serif leading-none flex-shrink-0 w-6">
                        {i + 1}
                      </span>
                      <div>
                        <Link href={`/article/${a.slug}`}>
                          <p className="font-serif text-sm font-bold leading-snug hover:underline hover:text-sow-blue transition-colors">
                            {a.title}
                          </p>
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

            <NewsletterBox />
          </aside>
        </div>
      </main>
      <Footer />
    </>
  )
}
