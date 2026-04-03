import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json()

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }

  // Log to console (always works — visible in Vercel logs)
  console.log('=== CONTACT FORM SUBMISSION ===')
  console.log(`From: ${name} <${email}>`)
  console.log(`Subject: ${subject}`)
  console.log(`Message: ${message}`)
  console.log(`Time: ${new Date().toISOString()}`)
  console.log('================================')

  // Optional: send email via a service like Resend or Nodemailer
  // Uncomment and configure if you set up an email provider:
  //
  // import { Resend } from 'resend'
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // await resend.emails.send({
  //   from: 'onboarding@resend.dev',
  //   to: process.env.CONTACT_EMAIL!,
  //   subject: `[SOW Chronicle] Contact: ${subject}`,
  //   html: `<p><strong>From:</strong> ${name} (${email})</p><p><strong>Subject:</strong> ${subject}</p><p>${message}</p>`,
  // })

  return NextResponse.json({ success: true })
}
