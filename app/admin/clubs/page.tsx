import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import ClubsManager from './ClubsManager'

export const revalidate = 0

export default async function AdminClubsPage() {
  const { data: clubs } = await supabaseAdmin
    .from('clubs')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-black">Clubs</h1>
          <p className="text-gray-500 text-sm mt-0.5">{clubs?.length || 0} clubs · Manage club profiles and posts</p>
        </div>
        <Link href="/admin/clubs/new" className="btn-primary text-xs px-3 py-2">
          + New Club
        </Link>
      </div>
      <ClubsManager initialClubs={clubs || []} />
    </div>
  )
}
