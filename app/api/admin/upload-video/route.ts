import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth) return auth

  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
  }

  // Validate type — common video formats
  const allowedTypes = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/quicktime', // .mov
    'video/x-msvideo', // .avi
  ]
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: 'Only MP4, WebM, OGG, MOV and AVI video files are allowed.' },
      { status: 400 }
    )
  }

  // 200MB max for videos
  const MAX_SIZE = 200 * 1024 * 1024
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Video must be under 200MB.' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()
  const filename = `videos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const arrayBuffer = await file.arrayBuffer()
  const buffer = new Uint8Array(arrayBuffer)

  const { error } = await supabaseAdmin.storage
    .from('article-images') // reuse same bucket
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: urlData } = supabaseAdmin.storage
    .from('article-images')
    .getPublicUrl(filename)

  return NextResponse.json({ url: urlData.publicUrl, type: 'upload' })
}
