import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import ClubForm from '../../ClubForm'

interface Props { params: { id: string } }

export default async function EditClubPage({ params }: Props) {
  const { data: club } = await supabaseAdmin
    .from('clubs')
    .select('*')
    .eq('id', params.id)
    .maybeSingle()

  if (!club) notFound()

  return <ClubForm initial={club} />
}
