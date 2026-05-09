import { supabaseAdmin } from '@/lib/supabase'
import { format } from 'date-fns'

export const revalidate = 0

export default async function AdminContactPage() {
  let messages: any[] = []
  try {
    const result = await supabaseAdmin
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    messages = result.data || []
  } catch {
    // Table doesn't exist yet
  }

  const unread = messages.filter((m: any) => !m.read).length

  return (
    <div className="p-4 md:p-6">
      <div className="mb-5">
        <h1 className="font-serif text-2xl md:text-3xl font-black">Contact Messages</h1>
        <p className="text-gray-500 text-sm mt-0.5">{unread} unread · {messages.length} total</p>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📬</p>
          <p className="italic">No contact messages yet.</p>
          <p className="text-xs mt-2">Messages submitted via the contact form will appear here.</p>
          <p className="text-xs mt-1 text-amber-600 font-bold">Note: Requires a <code>contact_messages</code> table in Supabase.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg: any) => (
            <div key={msg.id}
              className={`border rounded p-4 ${!msg.read ? 'border-sow-blue bg-blue-50' : 'border-gray-200 bg-white'}`}>
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    {!msg.read && <span className="w-2 h-2 rounded-full bg-sow-blue flex-shrink-0 inline-block" />}
                    <span className="font-bold text-sm">{msg.name}</span>
                    <span className="text-xs text-gray-400">{msg.email}</span>
                  </div>
                  <p className="text-[10px] uppercase tracking-wide text-gray-500 mt-0.5 font-bold">{msg.subject}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                  {format(new Date(msg.created_at), 'MMM d, yyyy · h:mm a')}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
              <div className="mt-3">
                <a href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                  className="text-xs text-sow-blue font-bold hover:underline">
                  Reply via email →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
