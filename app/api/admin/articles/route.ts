import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth) return auth
  const body = await req.json()
  const { title, slug, excerpt, content, cover_image_url, category_id, author_name, author_role, status, featured } = body

  if (!title || !slug || !content) {
    return NextResponse.json({ error: 'Title, slug, and content are required.' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin.from('articles').insert({
    title, slug, excerpt: excerpt || null,
    content, cover_image_url: cover_image_url || null,
    category_id: category_id || null,
    author_name: author_name || 'Editorial Team',
    author_role: author_role || 'Staff Writer',
    status: status || 'draft',
    featured: featured || false,
    published_at: status === 'published' ? new Date().toISOString() : null,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
