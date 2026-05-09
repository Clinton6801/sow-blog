import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth) return auth

  const { data, error } = await supabaseAdmin
    .from('clubs')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth) return auth

  const body = await req.json()
  const { name, slug, tagline, description, color, emoji, patron, meeting_day, member_count, active, sort_order } = body

  if (!name || !slug) {
    return NextResponse.json({ error: 'Name and slug are required.' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin.from('clubs').insert({
    name, slug,
    tagline: tagline || null,
    description: description || null,
    color: color || '#1e3a8a',
    emoji: emoji || '🏫',
    patron: patron || null,
    meeting_day: meeting_day || null,
    member_count: member_count || null,
    active: active !== false,
    sort_order: sort_order || 0,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
