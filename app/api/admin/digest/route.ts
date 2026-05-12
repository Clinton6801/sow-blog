import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth) return auth

  const body = await req.json()
  const { title, term, academic_year, intro, content, cover_url, highlights, stats, published } = body

  if (!title) return NextResponse.json({ error: 'Title is required.' }, { status: 400 })

  const { data, error } = await supabaseAdmin.from('term_digests').insert({
    title,
    term:          term || 'First Term',
    academic_year: academic_year || '',
    intro:         intro || null,
    content:       content || '',
    cover_url:     cover_url || null,
    highlights:    highlights || [],
    stats:         stats || {},
    published:     published !== false,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
