import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const eventId = req.nextUrl.searchParams.get('event')
  if (!eventId) return NextResponse.json({ error: 'Event ID required.' }, { status: 400 })

  const { data: photos } = await supabase
    .from('gallery_photos')
    .select('id, title, image_url')
    .eq('event_id', eventId)
    .order('sort_order', { ascending: true })

  return NextResponse.json({ photos: photos || [] })
}
