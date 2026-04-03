import { supabase } from './supabase'
import type { Article, Category } from '@/types'

export async function getPublishedArticles(limit = 10) {
  const { data, error } = await supabase
    .from('articles')
    .select('*, categories(*)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data as Article[]
}

export async function getFeaturedArticle() {
  const { data, error } = await supabase
    .from('articles')
    .select('*, categories(*)')
    .eq('status', 'published')
    .eq('featured', true)
    .order('published_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data as Article | null
}

export async function getArticleBySlug(slug: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*, categories(*)')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()
  if (error) throw error
  return data as Article | null
}

export async function getArticlesByCategory(categorySlug: string, limit = 10) {
  const { data, error } = await supabase
    .from('articles')
    .select('*, categories!inner(*)')
    .eq('status', 'published')
    .eq('categories.slug', categorySlug)
    .order('published_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data as Article[]
}

export async function searchArticles(query: string) {
  const { data, error } = await supabase
    .from('articles')
    .select('*, categories(*)')
    .eq('status', 'published')
    .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
    .order('published_at', { ascending: false })
    .limit(20)
  if (error) throw error
  return data as Article[]
}

export async function getAllCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')
  if (error) throw error
  return data as Category[]
}

export async function getApprovedComments(articleId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('article_id', articleId)
    .eq('approved', true)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function incrementViews(articleId: string) {
  await supabase.rpc('increment_views', { article_id: articleId })
}
