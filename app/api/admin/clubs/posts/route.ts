import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth) return auth

  const body = await req.json()
  const { club_id, title, excerpt, content, cover_url, author_name, published, gallery_images, reading_time } = body

  if (!club_id || !title || !content) {
    return NextResponse.json({ error: 'Club, title, and content are required.' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin.from('club_posts').insert({
    club_id,
    title,
    excerpt: excerpt || null,
    content,
    cover_url: cover_url || null,
    author_name: author_name || null,
    published: published !== false,
    gallery_images: gallery_images || [],
    reading_time: reading_time || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
