import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json()

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }

  console.log('=== CONTACT FORM SUBMISSION ===')
  console.log(`From: ${name} <${email}>`)
  console.log(`Subject: ${subject}`)
  console.log(`Message: ${message}`)
  console.log(`Time: ${new Date().toISOString()}`)
  console.log('================================')

  // Save to database (table may not exist yet — fail gracefully)
  try {
    await supabaseAdmin.from('contact_messages').insert({
      name,
      email,
      subject,
      message,
      created_at: new Date().toISOString(),
      read: false,
    })
  } catch {
    // Table doesn't exist yet — still return success, message is in logs
  }

  return NextResponse.json({ success: true })
}
