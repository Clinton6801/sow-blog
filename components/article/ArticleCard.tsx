import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { Eye, Clock } from 'lucide-react'
import type { Article } from '@/types'
import { getCategoryBadgeClass, getCategoryAccentColor } from '@/lib/categoryColors'

interface ArticleCardProps {
  article: Article
  variant?: 'default' | 'compact' | 'horizontal'
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const date = article.published_at ? format(new Date(article.published_at), 'MMM d, yyyy') : ''
  const badgeClass = getCategoryBadgeClass(article.categories?.slug)
  const accentColor = getCategoryAccentColor(article.categories?.slug)

  if (variant === 'compact') {
    return (
      <div className="border-b border-gray-100 pb-3 mb-3 last:border-0 last:mb-0 last:pb-0 group">
        <div className="flex gap-3">
          {article.cover_image_url && (
            <div className="w-16 h-12 flex-shrink-0 overflow-hidden bg-gray-200">
              <Image src={article.cover_image_url} alt={article.title} width={64} height={48}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
          )}
          <div>
            {article.categories && (
              <span className={`category-badge ${badgeClass} mb-1 inline-block`}>{article.categories.name}</span>
            )}
            <Link href={`/article/${article.slug}`}>
              <h3 className="font-serif text-sm font-bold leading-snug hover:underline line-clamp-2"
                style={{ '--tw-decoration-color': accentColor } as any}>
                {article.title}
              </h3>
            </Link>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-[10px] text-gray-400">{date}</p>
              {article.views > 0 && (
                <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
                  <Eye size={9} /> {article.views}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'horizontal') {
    return (
      <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0 group">
        {article.cover_image_url ? (
          <div className="w-28 h-20 flex-shrink-0 overflow-hidden bg-gray-200">
            <Image src={article.cover_image_url} alt={article.title} width={112} height={80}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
        ) : (
          <div className="w-28 h-20 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: accentColor }}>
            SOW
          </div>
        )}
        <div className="flex-1">
          {article.categories && (
            <span className={`category-badge ${badgeClass} mb-1 inline-block`}>{article.categories.name}</span>
          )}
          <Link href={`/article/${article.slug}`}>
            <h3 className="font-serif text-base font-bold leading-snug hover:underline mb-1">{article.title}</h3>
          </Link>
          <div className="flex items-center gap-3 text-[10px] text-gray-400 uppercase tracking-wide">
            <span className="font-bold text-ink">{article.author_name}</span>
            {date && <span>{date}</span>}
            {article.views > 0 && (
              <span className="flex items-center gap-0.5"><Eye size={9} /> {article.views}</span>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <article className="group">
      <div className="overflow-hidden bg-gray-100 mb-3 aspect-video relative"
        style={{ borderTop: `3px solid ${accentColor}` }}>
        {article.cover_image_url ? (
          <Image src={article.cover_image_url} alt={article.title} fill
            className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: accentColor }}>
            {article.categories?.name || 'SOW Chronicle'}
          </div>
        )}
      </div>

      {article.categories && (
        <span className={`category-badge ${badgeClass} mb-2 inline-block`}>{article.categories.name}</span>
      )}

      <Link href={`/article/${article.slug}`}>
        <h3 className="font-serif text-lg font-bold leading-snug hover:underline mb-2 transition-colors"
          style={{ '--hover-color': accentColor } as any}>
          {article.title}
        </h3>
      </Link>

      {article.excerpt && (
        <p className="text-sm text-gray-600 leading-relaxed mb-2 line-clamp-2 font-serif italic">{article.excerpt}</p>
      )}

      <div className="flex items-center gap-3 text-[10px] text-gray-500 tracking-wide uppercase">
        <span className="font-bold text-ink">{article.author_name}</span>
        {date && <span>{date}</span>}
        {(article as any).reading_time && (
          <span className="flex items-center gap-0.5">
            <Clock size={9} /> {(article as any).reading_time} min
          </span>
        )}
        {article.views > 0 && (
          <span className="flex items-center gap-0.5 ml-auto"><Eye size={10} /> {article.views}</span>
        )}
      </div>
      {/* Tags */}
      {(article as any).tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {((article as any).tags as string[]).slice(0, 3).map((tag: string) => (
            <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}
              className="text-[9px] px-1.5 py-0.5 bg-gray-100 text-gray-500 hover:bg-sow-teal hover:text-white rounded-full transition-colors">
              #{tag}
            </Link>
          ))}
        </div>
      )}
    </article>
  )
}
