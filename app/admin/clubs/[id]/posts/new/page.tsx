import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import ClubPostForm from '../ClubPostForm'

interface Props { params: { id: string } }

export default async function NewClubPostPage({ params }: Props) {
  const { data: club } = await supabaseAdmin
    .from('clubs')
    .select('id, name')
    .eq('id', params.id)
    .maybeSingle()

  if (!club) notFound()

  return <ClubPostForm clubId={club.id} clubName={club.name} />
}
