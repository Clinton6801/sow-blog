import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { status, admin_note } = await req.json()

  if (!['approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status.' }, { status: 400 })
  }

  // Update submission status
  const { data: submission, error: subError } = await supabaseAdmin
    .from('submissions')
    .update({ status, admin_note: admin_note || null, reviewed_at: new Date().toISOString() })
    .eq('id', params.id)
    .select('*, categories(*)')
    .single()

  if (subError) return NextResponse.json({ error: subError.message }, { status: 500 })

  // If approved, create an article from the submission
  if (status === 'approved' && submission) {
    const slug = submission.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Date.now()

    await supabaseAdmin.from('articles').insert({
      title: submission.title,
      slug,
      excerpt: submission.excerpt || null,
      content: submission.content,
      category_id: submission.category_id || null,
      author_name: submission.student_name,
      author_role: `Student · ${submission.student_class}`,
      status: 'published',
      featured: false,
      published_at: new Date().toISOString(),
    })
  }

  return NextResponse.json({ success: true })
}
