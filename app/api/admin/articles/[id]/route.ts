import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin(req)
  if (auth) return auth
  const body = await req.json()
  const updates: any = { ...body, updated_at: new Date().toISOString() }

  if (body.status === 'published' && !body.published_at) {
    updates.published_at = new Date().toISOString()
  }

  const { data, error } = await supabaseAdmin
    .from('articles')
    .update(updates)
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const _auth = await requireAdmin(req)
  if (_auth) return _auth
  // proceed
  const { error } = await supabaseAdmin
    .from('articles')
    .delete()
    .eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
