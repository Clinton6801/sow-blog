import { supabaseAdmin } from '@/lib/supabase'
import TickerManager from './TickerManager'

export const revalidate = 0

export default async function AdminTickerPage() {
  const { data: items } = await supabaseAdmin
    .from('ticker_items')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-black">Breaking News Ticker</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage the scrolling headlines shown at the top of every page.
        </p>
      </div>
      <TickerManager initialItems={items || []} />
    </div>
  )
}
