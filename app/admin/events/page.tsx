import { supabaseAdmin } from '@/lib/supabase'
import EventsManager from './EventsManager'

export const revalidate = 0

export default async function AdminEventsPage() {
  const { data: events } = await supabaseAdmin
    .from('events')
    .select('*')
    .order('event_date', { ascending: true })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-black">Manage Events</h1>
        <p className="text-gray-500 text-sm mt-1">Add and remove events shown on the public calendar.</p>
      </div>
      <EventsManager initialEvents={events || []} />
    </div>
  )
}
