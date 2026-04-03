import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (!password) {
    return NextResponse.json({ error: 'Password is required.' }, { status: 400 })
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 })
  }

  // Create a session token in Supabase
  const { data, error } = await supabaseAdmin
    .from('admin_sessions')
    .insert({ admin_email: 'admin@sowchronicle.ng' })
    .select('token')
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Could not create session.' }, { status: 500 })
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set('admin_token', data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return res
}
