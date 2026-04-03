import { notFound } from 'next/navigation'
import Masthead from '@/components/layout/Masthead'
import Footer from '@/components/layout/Footer'
import ArticleCard from '@/components/article/ArticleCard'
import { supabase } from '@/lib/supabase'

interface Props { params: { tag: string } }

export const revalidate = 60

export default async function TagPage({ params }: Props) {
  const tag = decodeURIComponent(params.tag)

  // Articles using the tags text[] column
  const { data: articles } = await supabase
    .from('articles')
    .select('*, categories(*)')
    .eq('status', 'published')
    .contains('tags', [tag])
    .order('published_at', { ascending: false })

  if (!articles) notFound()

  return (
    <>
      <Masthead />
      <div className="h-1.5 bg-sow-teal" />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="border-b-2 border-sow-teal pb-4 mb-8">
          <p className="text-[10px] tracking-[3px] uppercase text-sow-teal font-bold mb-1">Tag</p>
          <h1 className="font-serif text-5xl font-black text-sow-blue">#{tag}</h1>
          <p className="text-gray-500 text-sm mt-1">{articles.length} article{articles.length !== 1 ? 's' : ''}</p>
        </div>

        {articles.length === 0 ? (
          <p className="text-gray-400 italic">No articles with this tag yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.map((article: any) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
