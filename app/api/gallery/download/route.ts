import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const eventId = req.nextUrl.searchParams.get('event')
  if (!eventId) return NextResponse.json({ error: 'Event ID required.' }, { status: 400 })

  const { data: event } = await supabase
    .from('gallery_events')
    .select('name')
    .eq('id', eventId)
    .maybeSingle()

  const { data: photos } = await supabase
    .from('gallery_photos')
    .select('id, title, image_url')
    .eq('event_id', eventId)
    .order('sort_order', { ascending: true })

  const photoList = photos || []
  const eventName = event?.name || 'Gallery'

  // Return an HTML page with all images as download links
  // This is the most reliable cross-browser approach without server-side zip
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Download: ${eventName}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; background: #fafaf7; color: #1a1a2e; }
    h1 { font-size: 1.5rem; font-weight: 900; margin-bottom: 4px; }
    p { color: #6b7280; font-size: 0.875rem; margin-bottom: 24px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
    .card { border: 1px solid #e5e3dc; background: white; overflow: hidden; }
    .card img { width: 100%; aspect-ratio: 4/3; object-fit: cover; display: block; }
    .card-body { padding: 8px 10px; }
    .card-title { font-size: 0.75rem; font-weight: 600; margin-bottom: 6px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    a.btn { display: block; text-align: center; background: #1e3a8a; color: white; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 6px; text-decoration: none; }
    a.btn:hover { background: #162d6e; }
    .all-btn { display: inline-block; background: #1e3a8a; color: white; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 10px 20px; text-decoration: none; margin-bottom: 24px; }
    .note { background: #fef3c7; border: 1px solid #fcd34d; padding: 12px 16px; font-size: 0.8rem; margin-bottom: 20px; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>${eventName}</h1>
  <p>${photoList.length} photo${photoList.length !== 1 ? 's' : ''} · Right-click any image and choose "Save image as" to download individually.</p>
  <div class="note">
    💡 <strong>Tip:</strong> To save all photos, right-click each image below and select "Save image as…", or use the individual download buttons.
  </div>
  <div class="grid">
    ${photoList.map(p => `
    <div class="card">
      <img src="${p.image_url}" alt="${p.title || ''}" loading="lazy" />
      <div class="card-body">
        <div class="card-title">${p.title || 'Photo'}</div>
        <a class="btn" href="${p.image_url}" download target="_blank" rel="noopener">⬇ Download</a>
      </div>
    </div>`).join('')}
  </div>
</body>
</html>`

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}
