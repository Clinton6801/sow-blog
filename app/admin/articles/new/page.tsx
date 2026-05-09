import ArticleForm from '@/components/admin/ArticleForm'

interface Props {
  searchParams: {
    title?: string
    content?: string
    excerpt?: string
    author_name?: string
    author_role?: string
    category_id?: string
    from_submission?: string
  }
}

export default function NewArticlePage({ searchParams }: Props) {
  const hasPreFill = !!(searchParams.title || searchParams.content)

  return (
    <>
      {hasPreFill && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 text-sm text-amber-800">
          <strong>Pre-filled from student submission.</strong> Review and edit before publishing.
          {searchParams.from_submission && (
            <span className="ml-2 text-amber-600">Submission ID: {searchParams.from_submission}</span>
          )}
        </div>
      )}
      <ArticleForm initial={{
        title: searchParams.title || '',
        content: searchParams.content || '',
        excerpt: searchParams.excerpt || '',
        author_name: searchParams.author_name || '',
        author_role: searchParams.author_role || '',
        category_id: searchParams.category_id || '',
      }} />
    </>
  )
}
