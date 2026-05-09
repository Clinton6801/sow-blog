import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sowchronicle.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                  lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE_URL}/about`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/contact`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/submit`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/events`,      lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/genius`,      lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/gallery`,     lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/clubs`,       lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/search`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/category/news`,          lastModified: new Date(), changeFrequency: 'daily',  priority: 0.9 },
    { url: `${BASE_URL}/category/academics`,     lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/category/sports`,        lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/category/arts-culture`,  lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/category/opinion`,       lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/category/events`,        lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ]

  // Dynamic article pages
  const { data: articles } = await supabase
    .from('articles')
    .select('slug, updated_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  const articlePages: MetadataRoute.Sitemap = (articles || []).map(a => ({
    url: `${BASE_URL}/article/${a.slug}`,
    lastModified: new Date(a.updated_at),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  // Gallery event pages
  const { data: galleryEvents } = await supabase
    .from('gallery_events')
    .select('slug, created_at')

  const galleryPages: MetadataRoute.Sitemap = (galleryEvents || []).map(e => ({
    url: `${BASE_URL}/gallery/${e.slug}`,
    lastModified: new Date(e.created_at),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticPages, ...articlePages, ...galleryPages]
}
