import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendAdminNotification, submissionEmailHtml } from '@/lib/email'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { title, content, excerpt, category_id, student_name, student_class, student_email, cover_image_url } = body

  if (!title || !content || !student_name || !student_class) {
    return NextResponse.json({ error: 'Title, content, name, and class are required.' }, { status: 400 })
  }

  const { error } = await supabase.from('submissions').insert({
    title: title.trim(),
    content: content.trim(),
    excerpt: excerpt?.trim() || null,
    category_id: category_id || null,
    student_name: student_name.trim(),
    student_class: student_class.trim(),
    student_email: student_email?.trim() || null,
    cover_image_url: cover_image_url || null,
    status: 'pending',
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Send email notification (non-blocking)
  sendAdminNotification({
    subject: `[SOW Chronicle] New submission: ${title}`,
    html: submissionEmailHtml({ title, student_name, student_class, excerpt }),
  }).catch(() => {})

  return NextResponse.json({ success: true })
}
