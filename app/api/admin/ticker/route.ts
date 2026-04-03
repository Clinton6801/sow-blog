import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('ticker_items')
    .select('*')
    .eq('active', true)
    .order('sort_order', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth) return auth
  const { text, sort_order } = await req.json()
  if (!text) return NextResponse.json({ error: 'Text is required.' }, { status: 400 })
  const { data, error } = await supabaseAdmin
    .from('ticker_items')
    .insert({ text, sort_order: sort_order || 0, active: true })
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
