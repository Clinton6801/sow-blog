import { supabaseAdmin } from '@/lib/supabase'
import { format } from 'date-fns'

export const revalidate = 0

export default async function AdminNewsletterPage() {
  const { data: subscribers, count } = await supabaseAdmin
    .from('newsletter_subscribers')
    .select('*', { count: 'exact' })
    .eq('active', true)
    .order('subscribed_at', { ascending: false })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-black">Newsletter Subscribers</h1>
        <p className="text-gray-500 text-sm mt-1">{count || 0} active subscribers</p>
      </div>

      {/* Export hint */}
      <div className="bg-blue-50 border border-blue-200 p-4 mb-6 rounded text-sm text-blue-800">
        <strong>Tip:</strong> To export subscribers, go to your Supabase dashboard → Table Editor → newsletter_subscribers → Export CSV.
      </div>

      <div className="bg-white border border-gray-200 rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-[10px] tracking-[2px] uppercase text-gray-500 font-bold">#</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[2px] uppercase text-gray-500 font-bold">Email</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[2px] uppercase text-gray-500 font-bold">Name</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-[2px] uppercase text-gray-500 font-bold">Subscribed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {subscribers?.map((sub, i) => (
              <tr key={sub.id} className="hover:bg-gray-50">
                <td className="px-4 py-2.5 text-gray-400 text-xs">{i + 1}</td>
                <td className="px-4 py-2.5 font-mono text-sm">{sub.email}</td>
                <td className="px-4 py-2.5 text-gray-600">{sub.name || '—'}</td>
                <td className="px-4 py-2.5 text-gray-400 text-xs">
                  {format(new Date(sub.subscribed_at), 'MMM d, yyyy · h:mm a')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!subscribers || subscribers.length === 0) && (
          <div className="text-center py-12 text-gray-400">
            <p className="italic">No subscribers yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
