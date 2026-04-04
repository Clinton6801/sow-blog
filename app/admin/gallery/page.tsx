import { supabaseAdmin } from '@/lib/supabase'
import GalleryManager from './GalleryManager'

export const revalidate = 0

export default async function AdminGalleryPage() {
  const [{ data: photos }, { data: events }] = await Promise.all([
    supabaseAdmin.from('gallery_photos').select('*').order('created_at', { ascending: false }),
    supabaseAdmin.from('gallery_events').select('*').order('created_at', { ascending: false }),
  ])

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-black">Photo Gallery</h1>
        <p className="text-gray-500 text-sm mt-1">
          Create event albums and upload multiple photos. Students can view and download from the public gallery.
        </p>
      </div>
      <GalleryManager initialPhotos={photos || []} initialEvents={events || []} />
    </div>
  )
}
