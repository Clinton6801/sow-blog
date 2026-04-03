import { notFound } from 'next/navigation'
import Masthead from '@/components/layout/Masthead'
import Footer from '@/components/layout/Footer'
import ArticleCard from '@/components/article/ArticleCard'
import Pagination from '@/components/ui/Pagination'
import { getAllCategories } from '@/lib/queries'
import { supabase } from '@/lib/supabase'
import { getCategoryAccentColor } from '@/lib/categoryColors'

interface Props { params: { slug: string }; searchParams: { page?: string } }

export const revalidate = 60

export async function generateStaticParams() {
  const categories = await getAllCategories()
  return categories.map(c => ({ slug: c.slug }))
}

const PAGE_SIZE = 9

export default async function CategoryPage({ params, searchParams }: Props) {
  const categories = await getAllCategories()
  const category = categories.find(c => c.slug === params.slug)
  if (!category) notFound()

  const page = Math.max(1, parseInt(searchParams.page || '1', 10))
  const accentColor = getCategoryAccentColor(params.slug)

  const { count } = await supabase
    .from('articles')
    .select('id', { count: 'exact' })
    .eq('status', 'published')
    .eq('category_id', category.id)

  const totalPages = Math.ceil((count || 0) / PAGE_SIZE)

  const { data: articles } = await supabase
    .from('articles')
    .select('*, categories(*)')
    .eq('status', 'published')
    .eq('category_id', category.id)
    .order('published_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1)

  return (
    <>
      <Masthead />
      <div className="h-1.5" style={{ backgroundColor: accentColor }} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="border-b-2 pb-4 mb-6" style={{ borderColor: accentColor }}>
          <h1 className="font-serif text-5xl font-black" style={{ color: accentColor }}>{category.name}</h1>
          {category.description && <p className="text-gray-500 italic mt-1">{category.description}</p>}
          <p className="text-xs text-gray-400 mt-1">{count || 0} articles</p>
        </div>

        {(!articles || articles.length === 0) ? (
          <p className="text-gray-400 italic">No articles in this category yet.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles.map((article: any) => <ArticleCard key={article.id} article={article} />)}
            </div>
            <Pagination currentPage={page} totalPages={totalPages} basePath={`/category/${params.slug}`} />
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
