import { supabaseAdmin } from '@/lib/supabase'
import { format } from 'date-fns'
import SubmissionActions from './SubmissionActions'

export const revalidate = 0

export default async function AdminSubmissionsPage() {
  const { data: submissions } = await supabaseAdmin
    .from('submissions').select('*, categories(*)')
    .order('created_at', { ascending: false })

  const pending  = submissions?.filter(s => s.status === 'pending') || []
  const reviewed = submissions?.filter(s => s.status !== 'pending') || []

  const statusColor: Record<string, string> = {
    pending:  'bg-orange-100 text-orange-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-5">
        <h1 className="font-serif text-2xl md:text-3xl font-black">Submissions</h1>
        <p className="text-gray-500 text-sm mt-0.5">{pending.length} pending · {reviewed.length} reviewed</p>
      </div>

      {/* Pending */}
      <div className="mb-8">
        <h2 className="text-[10px] tracking-[2px] uppercase font-bold mb-3 pb-2 border-b border-orange-200 text-orange-700">
          Pending Review ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <div className="border border-green-100 bg-green-50 p-5 rounded text-center">
            <p className="text-green-700 font-bold text-sm">All caught up — no pending submissions!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pending.map((s: any) => (
              <div key={s.id} className="border border-orange-100 bg-orange-50 rounded p-4">
                <h3 className="font-serif text-lg font-bold mb-1">{s.title}</h3>
                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
                  {s.student_name} · {s.student_class}
                  {s.categories && <> · {s.categories.name}</>}
                  &nbsp;·&nbsp; {format(new Date(s.created_at), 'MMM d, yyyy')}
                </p>
                {s.excerpt && <p className="text-sm italic text-gray-600 mb-3">{s.excerpt}</p>}
                <div className="bg-white border border-orange-100 p-3 max-h-32 overflow-y-auto rounded mb-3">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap line-clamp-4">{s.content}</p>
                </div>
                <SubmissionActions submission={s} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reviewed */}
      {reviewed.length > 0 && (
        <div>
          <h2 className="text-[10px] tracking-[2px] uppercase font-bold mb-3 pb-2 border-b border-gray-200 text-gray-500">
            Previously Reviewed ({reviewed.length})
          </h2>
          <div className="space-y-2">
            {reviewed.map((s: any) => (
              <div key={s.id} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded">
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm line-clamp-1">{s.title}</p>
                  <p className="text-xs text-gray-400">{s.student_name} · {s.student_class} · {format(new Date(s.created_at), 'MMM d')}</p>
                </div>
                <span className={`text-[9px] tracking-[1px] uppercase font-bold px-2 py-0.5 rounded flex-shrink-0 ${statusColor[s.status]}`}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
