import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value

  if (token) {
    // Delete the session from DB
    await supabaseAdmin.from('admin_sessions').delete().eq('token', token)
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set('admin_token', '', { maxAge: 0, path: '/' })
  return res
}
