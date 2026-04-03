import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from './supabase'

/**
 * Call this at the top of every /api/admin/* route handler.
 * Returns null if valid, or a 401 NextResponse if not.
 *
 * Usage:
 *   const auth = await requireAdmin(req)
 *   if (auth) return auth   // unauthorized — return early
 */
export async function requireAdmin(req: NextRequest): Promise<NextResponse | null> {
  const token = req.cookies.get('admin_token')?.value

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from('admin_sessions')
    .select('id, expires_at')
    .eq('token', token)
    .maybeSingle()

  if (error || !data) {
    return NextResponse.json({ error: 'Invalid session.' }, { status: 401 })
  }

  if (new Date(data.expires_at) < new Date()) {
    await supabaseAdmin.from('admin_sessions').delete().eq('token', token)
    return NextResponse.json({ error: 'Session expired. Please log in again.' }, { status: 401 })
  }

  return null // valid
}
