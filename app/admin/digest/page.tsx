import { supabaseAdmin } from '@/lib/supabase'
import Link from 'next/link'
import { format } from 'date-fns'
import DeleteDigestButton from './DeleteDigestButton'

export const revalidate = 0

export default async function AdminDigestPage() {
  const { data: digests } = await supabaseAdmin
    .from('term_digests')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-black">Term Digests</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Curated term summaries shared with parents and students.
          </p>
        </div>
        <Link href="/admin/digest/new" className="btn-primary text-xs px-3 py-2">
          + New Digest
        </Link>
      </div>

      {(!digests || digests.length === 0) ? (
        <div className="text-center py-16 text-gray-400 border border-dashed border-gray-200 rounded">
          <p className="text-4xl mb-3">📋</p>
          <p className="italic mb-4">No digests yet.</p>
          <Link href="/admin/digest/new" className="btn-primary text-sm">Create First Digest</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {digests.map((d: any) => (
            <div key={d.id}
              className={`flex items-center gap-4 border rounded p-3 ${d.published ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100 opacity-70'}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm">{d.title}</p>
                  <span className={`text-[9px] tracking-wide uppercase font-bold px-2 py-0.5 rounded ${d.published ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {d.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {d.term} · {d.academic_year} · {format(new Date(d.created_at), 'MMM d, yyyy')}
                </p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <Link href={`/admin/digest/${d.id}/edit`}
                  className="text-xs text-sow-blue font-bold hover:underline">Edit</Link>
                <Link href={`/digest/${d.id}`} target="_blank"
                  className="text-xs text-gray-400 hover:underline">View</Link>
                <DeleteDigestButton digestId={d.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
