import { notFound } from 'next/navigation'
import Masthead from '@/components/layout/Masthead'
import Footer from '@/components/layout/Footer'
import ArticleCard from '@/components/article/ArticleCard'
import Pagination from '@/components/ui/Pagination'
import { supabase } from '@/lib/supabase'

const CAMPUSES: Record<string, { name: string; color: string; description: string }> = {
  'main':        { name: 'Main Campus',        color: '#1e3a8a', description: 'News and updates from the Main Campus.' },
  'alexandrite': { name: 'Alexandrite Campus', color: '#15803d', description: 'News and updates from the Alexandrite Campus.' },
}

interface Props { params: { slug: string }; searchParams: { page?: string } }

const PAGE_SIZE = 9

export default async function CampusPage({ params, searchParams }: Props) {
  const campus = CAMPUSES[params.slug]
  if (!campus) notFound()

  const page = Math.max(1, parseInt(searchParams.page || '1', 10))

  const { count } = await supabase
    .from('articles')
    .select('id', { count: 'exact' })
    .eq('status', 'published')
    .eq('campus', campus.name)

  const totalPages = Math.ceil((count || 0) / PAGE_SIZE)

  const { data: articles } = await supabase
    .from('articles')
    .select('*, categories(*)')
    .eq('status', 'published')
    .eq('campus', campus.name)
    .order('published_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

  return (
    <>
      <Masthead />
      <div className="h-1.5" style={{ backgroundColor: campus.color }} />
      <main className="max-w-6xl mx-auto px-4 py-8">

        <div className="border-b-2 pb-4 mb-6" style={{ borderColor: campus.color }}>
          <p className="text-[10px] tracking-[3px] uppercase font-bold mb-1"
            style={{ color: campus.color }}>Campus</p>
          <h1 className="font-serif text-5xl font-black" style={{ color: 'var(--text-primary)' }}>
            {campus.name}
          </h1>
          <p className="italic mt-1" style={{ color: 'var(--text-muted)' }}>{campus.description}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-faint)' }}>{count || 0} articles</p>
        </div>

        {(!articles || articles.length === 0) ? (
          <p className="italic" style={{ color: 'var(--text-faint)' }}>No articles for this campus yet.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles.map((a: any) => <ArticleCard key={a.id} article={a} />)}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} basePath={`/campus/${params.slug}`} />
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
