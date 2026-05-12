import { supabaseAdmin } from '@/lib/supabase'
import HonoursManager from './HonoursManager'

export const revalidate = 0

export default async function AdminHonoursPage() {
  const { data: honours } = await supabaseAdmin
    .from('honours')
    .select('*')
    .order('achieved_at', { ascending: false })

  return (
    <div className="p-4 md:p-6">
      <div className="mb-5">
        <h1 className="font-serif text-2xl md:text-3xl font-black">Honours Board</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Record student achievements — exam results, competition wins, certificates, awards.
        </p>
      </div>
      <HonoursManager initialHonours={honours || []} />
    </div>
  )
}
