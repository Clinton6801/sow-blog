import ArticleForm from '@/components/admin/ArticleForm'
import { supabaseAdmin } from '@/lib/supabase'
import { notFound } from 'next/navigation'

interface Props { params: { id: string } }

export default async function EditArticlePage({ params }: Props) {
  const { data: article } = await supabaseAdmin
    .from('articles')
    .select('*')
    .eq('id', params.id)
    .maybeSingle()

  if (!article) notFound()

  return <ArticleForm initial={article} />
}
