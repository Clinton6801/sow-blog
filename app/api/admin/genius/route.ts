import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('genius_of_week')
    .select('*')
    .order('week_of', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth) return auth

  const body = await req.json()
  const { student_name, student_class, subject, achievement, photo_url, week_of, active } = body

  if (!student_name || !student_class || !subject || !achievement) {
    return NextResponse.json({ error: 'Name, class, subject and achievement are required.' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('genius_of_week')
    .insert({ student_name, student_class, subject, achievement, photo_url: photo_url || null, week_of, active: active ?? true })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
