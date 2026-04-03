import Masthead from '@/components/layout/Masthead'
import Footer from '@/components/layout/Footer'
import ArticleCard from '@/components/article/ArticleCard'
import SearchFilters from './SearchFilters'
import { supabase } from '@/lib/supabase'
import { getAllCategories } from '@/lib/queries'

interface Props {
  searchParams: { q?: string; category?: string; author?: string; from?: string; to?: string }
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = '', category, author, from, to } = searchParams
  const categories = await getAllCategories()

  let query = supabase
    .from('articles')
    .select('*, categories(*)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(24)

  if (q.trim()) {
    query = query.or(`title.ilike.%${q}%,excerpt.ilike.%${q}%,content.ilike.%${q}%`)
  }
  if (category) {
    const cat = categories.find(c => c.slug === category)
    if (cat) query = query.eq('category_id', cat.id)
  }
  if (author) {
    query = query.ilike('author_name', `%${author}%`)
  }
  if (from) {
    query = query.gte('published_at', from)
  }
  if (to) {
    query = query.lte('published_at', to + 'T23:59:59')
  }

  const { data: results } = await query
  const articles = results || []
  const hasFilters = !!(q || category || author || from || to)

  return (
    <>
      <Masthead />
      <div className="h-1.5 bg-sow-teal" />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="border-b-2 border-sow-teal pb-4 mb-6">
          <h1 className="font-serif text-4xl font-black text-sow-blue">
            {q ? `Results for "${q}"` : 'Search Articles'}
          </h1>
          {hasFilters && (
            <p className="text-gray-500 text-sm mt-1">
              {articles.length} article{articles.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters sidebar */}
          <aside>
            <SearchFilters categories={categories} current={searchParams} />
          </aside>

          {/* Results */}
          <div className="md:col-span-3">
            {!hasFilters && (
              <p className="text-gray-400 italic mb-6">Use the search bar above or filters to find articles.</p>
            )}
            {hasFilters && articles.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p className="text-4xl mb-3">🔍</p>
                <p className="italic">No articles found. Try different search terms or remove some filters.</p>
              </div>
            )}
            {articles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map((article: any) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
