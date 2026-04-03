import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('events')
    .select('*')
    .order('event_date', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth) return auth
  const body = await req.json()
  const { title, description, event_date, end_date, location, category, color } = body
  if (!title || !event_date) return NextResponse.json({ error: 'Title and date are required.' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('events')
    .insert({ title, description: description || null, event_date, end_date: end_date || null, location: location || null, category: category || 'General', color: color || '#1e3a8a' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
