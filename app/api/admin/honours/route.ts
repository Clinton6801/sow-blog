import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth) return auth

  const body = await req.json()
  const { student_name, student_class, campus, title, description, category, achieved_at, photo_url, featured, published } = body

  if (!student_name || !title) {
    return NextResponse.json({ error: 'Student name and title are required.' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin.from('honours').insert({
    student_name,
    student_class: student_class || null,
    campus: campus || null,
    title,
    description: description || null,
    category: category || 'other',
    achieved_at: achieved_at || null,
    photo_url: photo_url || null,
    featured: featured || false,
    published: published !== false,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
