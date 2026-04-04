import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('gallery_photos')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth) return auth

  const body = await req.json()
  const { title, description, image_url, event_name, event_id, taken_at, uploaded_by, sort_order } = body

  if (!title || !image_url) return NextResponse.json({ error: 'Title and image URL are required.' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('gallery_photos')
    .insert({
      title,
      description: description || null,
      image_url,
      event_name: event_name || null,
      event_id: event_id || null,
      taken_at: taken_at || null,
      uploaded_by: uploaded_by || 'Admin',
      sort_order: sort_order || 0,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
