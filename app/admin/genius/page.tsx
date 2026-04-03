import { supabaseAdmin } from '@/lib/supabase'
import GeniusManager from './GeniusManager'

export const revalidate = 0

export default async function AdminGeniusPage() {
  const { data: geniuses } = await supabaseAdmin
    .from('genius_of_week')
    .select('*')
    .order('week_of', { ascending: false })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-black">⭐ Genius of the Week</h1>
        <p className="text-gray-500 text-sm mt-1">
          Spotlight outstanding students from every class. Active entries appear on the homepage and genius page.
        </p>
      </div>
      <GeniusManager initialGeniuses={geniuses || []} />
    </div>
  )
}
