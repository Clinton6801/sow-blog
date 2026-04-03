import { supabaseAdmin } from '@/lib/supabase'
import { format } from 'date-fns'
import SubmissionActions from './SubmissionActions'

export const revalidate = 0

export default async function AdminSubmissionsPage() {
  const { data: submissions } = await supabaseAdmin
    .from('submissions')
    .select('*, categories(*)')
    .order('created_at', { ascending: false })

  const pending = submissions?.filter(s => s.status === 'pending') || []
  const reviewed = submissions?.filter(s => s.status !== 'pending') || []

  const statusColor: Record<string, string> = {
    pending: 'bg-orange-100 text-orange-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-black">Student Submissions</h1>
        <p className="text-gray-500 text-sm mt-1">
          {pending.length} pending · {reviewed.length} reviewed
        </p>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-[10px] tracking-[2px] uppercase font-bold mb-3 pb-2 border-b border-orange-200 text-orange-700">
            Pending Review ({pending.length})
          </h2>
          <div className="space-y-4">
            {pending.map((s: any) => (
              <div key={s.id} className="border border-orange-100 bg-orange-50 rounded p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-serif text-xl font-bold mb-1">{s.title}</h3>
                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
                      By {s.student_name} · {s.student_class}
                      {s.student_email && <> · {s.student_email}</>}
                      {s.categories && <> · {s.categories.name}</>}
                      &nbsp;·&nbsp; {format(new Date(s.created_at), 'MMM d, yyyy')}
                    </p>
                    {s.excerpt && (
                      <p className="text-sm italic text-gray-600 mb-3">{s.excerpt}</p>
                    )}
                    <div className="bg-white border border-orange-100 p-3 max-h-40 overflow-y-auto rounded">
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{s.content}</p>
                    </div>
                  </div>
                  <SubmissionActions submission={s} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pending.length === 0 && (
        <div className="border border-green-100 bg-green-50 p-6 text-center rounded mb-8">
          <p className="text-green-700 font-bold">No pending submissions.</p>
          <p className="text-green-600 text-sm mt-1">All caught up!</p>
        </div>
      )}

      {/* Reviewed */}
      {reviewed.length > 0 && (
        <div>
          <h2 className="text-[10px] tracking-[2px] uppercase font-bold mb-3 pb-2 border-b border-gray-200 text-gray-500">
            Previously Reviewed ({reviewed.length})
          </h2>
          <div className="bg-white border border-gray-200 rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-2 text-[9px] tracking-[2px] uppercase text-gray-400 font-bold">Title</th>
                  <th className="text-left px-4 py-2 text-[9px] tracking-[2px] uppercase text-gray-400 font-bold">Student</th>
                  <th className="text-left px-4 py-2 text-[9px] tracking-[2px] uppercase text-gray-400 font-bold">Status</th>
                  <th className="text-left px-4 py-2 text-[9px] tracking-[2px] uppercase text-gray-400 font-bold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reviewed.map((s: any) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-bold max-w-xs line-clamp-1">{s.title}</td>
                    <td className="px-4 py-2 text-gray-600">{s.student_name} · {s.student_class}</td>
                    <td className="px-4 py-2">
                      <span className={`text-[9px] tracking-[1px] uppercase font-bold px-2 py-0.5 rounded ${statusColor[s.status]}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-400 text-xs">
                      {format(new Date(s.created_at), 'MMM d, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
