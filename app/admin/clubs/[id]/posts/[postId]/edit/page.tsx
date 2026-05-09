import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import ClubPostForm from '../../ClubPostForm'

interface Props { params: { id: string; postId: string } }

export default async function EditClubPostPage({ params }: Props) {
  const [clubResult, postResult] = await Promise.all([
    supabaseAdmin.from('clubs').select('id, name').eq('id', params.id).maybeSingle(),
    supabaseAdmin.from('club_posts').select('*').eq('id', params.postId).maybeSingle(),
  ])

  if (!clubResult.data || !postResult.data) notFound()

  return (
    <ClubPostForm
      clubId={clubResult.data.id}
      clubName={clubResult.data.name}
      initial={postResult.data}
    />
  )
}
