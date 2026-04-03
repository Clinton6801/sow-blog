import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendAdminNotification, commentEmailHtml } from '@/lib/email'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { article_id, commenter_name, commenter_class, content } = body

  if (!article_id || !commenter_name || !content) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
  }

  const { error } = await supabase.from('comments').insert({
    article_id,
    commenter_name: commenter_name.trim(),
    commenter_class: commenter_class?.trim() || null,
    content: content.trim(),
    approved: false,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Get article title for the email
  const { data: article } = await supabase
    .from('articles').select('title, slug').eq('id', article_id).maybeSingle()

  sendAdminNotification({
    subject: `[SOW Chronicle] New comment on "${article?.title || 'article'}"`,
    html: commentEmailHtml({
      commenter_name, commenter_class,
      content, article_title: article?.title || '', article_slug: article?.slug || '',
    }),
  }).catch(() => {})

  return NextResponse.json({ success: true })
}
