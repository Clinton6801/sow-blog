/**
 * Simple email notification helper.
 * Uses Resend (free tier: 3,000 emails/month).
 *
 * Setup:
 *   1. Go to https://resend.com and create a free account
 *   2. Get your API key
 *   3. Add RESEND_API_KEY=your_key to .env.local
 *   4. Add NOTIFY_EMAIL=youremail@gmail.com to .env.local
 *
 * If RESEND_API_KEY is not set, notifications are just logged to console.
 */

interface EmailPayload {
  subject: string
  html: string
}

export async function sendAdminNotification({ subject, html }: EmailPayload) {
  const apiKey   = process.env.RESEND_API_KEY
  const toEmail  = process.env.NOTIFY_EMAIL

  // Log always (visible in Vercel logs)
  console.log(`[EMAIL NOTIFICATION] ${subject}`)

  if (!apiKey || !toEmail) {
    console.log('[EMAIL] RESEND_API_KEY or NOTIFY_EMAIL not set — skipping email send.')
    return
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SOW Chronicle <onboarding@resend.dev>',
        to:   toEmail,
        subject,
        html,
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      console.error('[EMAIL] Resend error:', err)
    }
  } catch (err) {
    console.error('[EMAIL] Failed to send notification:', err)
  }
}

export function submissionEmailHtml(data: {
  title: string; student_name: string; student_class: string; excerpt?: string
}) {
  return `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #1e3a8a;">
      <div style="background: #1e3a8a; padding: 16px; margin: -20px -20px 20px; text-align: center;">
        <h1 style="color: #f59e0b; font-size: 24px; margin: 0;">The SOW Chronicle</h1>
        <p style="color: white; font-size: 11px; margin: 4px 0 0; letter-spacing: 2px; text-transform: uppercase;">New Student Submission</p>
      </div>
      <h2 style="color: #1e3a8a; font-size: 20px;">${data.title}</h2>
      <p><strong>From:</strong> ${data.student_name} (${data.student_class})</p>
      ${data.excerpt ? `<p style="color: #6b7280; font-style: italic;">${data.excerpt}</p>` : ''}
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/submissions"
        style="display: inline-block; background: #1e3a8a; color: white; padding: 10px 20px; text-decoration: none; font-weight: bold; margin-top: 16px;">
        Review Submission →
      </a>
    </div>
  `
}

export function commentEmailHtml(data: {
  commenter_name: string; commenter_class?: string; content: string; article_title: string; article_slug: string
}) {
  return `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #1e3a8a;">
      <div style="background: #1e3a8a; padding: 16px; margin: -20px -20px 20px; text-align: center;">
        <h1 style="color: #f59e0b; font-size: 24px; margin: 0;">The SOW Chronicle</h1>
        <p style="color: white; font-size: 11px; margin: 4px 0 0; letter-spacing: 2px; text-transform: uppercase;">New Comment Awaiting Approval</p>
      </div>
      <p><strong>On:</strong> ${data.article_title}</p>
      <p><strong>From:</strong> ${data.commenter_name}${data.commenter_class ? ` (${data.commenter_class})` : ''}</p>
      <blockquote style="border-left: 3px solid #f59e0b; padding-left: 12px; color: #374151; margin: 12px 0;">
        ${data.content}
      </blockquote>
      <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/comments"
        style="display: inline-block; background: #1e3a8a; color: white; padding: 10px 20px; text-decoration: none; font-weight: bold; margin-top: 16px;">
        Moderate Comments →
      </a>
    </div>
  `
}
