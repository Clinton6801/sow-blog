import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('gallery_events')
    .select('*, gallery_photos(id, image_url)')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth) return auth

  const { name, slug, description, event_date } = await req.json()
  if (!name || !slug) return NextResponse.json({ error: 'Name is required.' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('gallery_events')
    .insert({ name, slug, description: description || null, event_date: event_date || null })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') return NextResponse.json({ error: 'An album with that name already exists.' }, { status: 409 })
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}
