import { supabaseAdmin } from '@/lib/supabase'
import GalleryManager from './GalleryManager'

export const revalidate = 0

export default async function AdminGalleryPage() {
  const { data: photos } = await supabaseAdmin
    .from('gallery_photos')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-black">Photo Gallery</h1>
        <p className="text-gray-500 text-sm mt-1">Upload and manage school event photos.</p>
      </div>
      <GalleryManager initialPhotos={photos || []} />
    </div>
  )
}
