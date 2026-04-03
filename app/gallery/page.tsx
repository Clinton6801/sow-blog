import Masthead from '@/components/layout/Masthead'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'

export const revalidate = 60

export default async function GalleryPage() {
  const { data: photos } = await supabase
    .from('gallery_photos')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <>
      <Masthead />
      <div className="h-1.5 bg-sow-purple" />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="border-b-2 border-sow-purple pb-4 mb-8">
          <span className="category-badge badge-arts mb-2 inline-block">Gallery</span>
          <h1 className="font-serif text-5xl font-black text-sow-purple">Photo Gallery</h1>
          <p className="text-gray-500 italic mt-1">Moments from Seat of Wisdom Schools</p>
        </div>

        {(!photos || photos.length === 0) ? (
          <p className="text-gray-400 italic">No photos yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos.map((photo: any) => (
              <div key={photo.id} className="group overflow-hidden border-2 border-transparent hover:border-sow-purple transition-colors">
                <div className="aspect-video overflow-hidden bg-gray-100 relative">
                  <Image src={photo.image_url} alt={photo.title} fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  {photo.event_name && (
                    <span className="absolute top-2 left-2 category-badge badge-arts">{photo.event_name}</span>
                  )}
                </div>
                <div className="p-3 bg-white">
                  <h3 className="font-serif font-bold text-sm leading-snug">{photo.title}</h3>
                  {photo.description && (
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{photo.description}</p>
                  )}
                  <div className="flex justify-between items-center mt-1.5 text-[10px] text-gray-400 uppercase tracking-wide">
                    <span>{photo.uploaded_by}</span>
                    {photo.taken_at && <span>{format(new Date(photo.taken_at), 'MMM d, yyyy')}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
