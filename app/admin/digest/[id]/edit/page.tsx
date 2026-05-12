import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import DigestForm from '../../DigestForm'

interface Props { params: { id: string } }

export default async function EditDigestPage({ params }: Props) {
  const { data: digest } = await supabaseAdmin
    .from('term_digests')
    .select('*')
    .eq('id', params.id)
    .maybeSingle()

  if (!digest) notFound()

  return <DigestForm initial={digest} />
}
