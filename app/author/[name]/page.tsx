import { notFound } from 'next/navigation'
import Masthead from '@/components/layout/Masthead'
import Footer from '@/components/layout/Footer'
import ArticleCard from '@/components/article/ArticleCard'
import { supabase } from '@/lib/supabase'

interface Props { params: { name: string } }

export const revalidate = 60

export default async function AuthorPage({ params }: Props) {
  const authorName = decodeURIComponent(params.name)

  const { data: articles } = await supabase
    .from('articles')
    .select('*, categories(*)')
    .eq('status', 'published')
    .eq('author_name', authorName)
    .order('published_at', { ascending: false })

  if (!articles || articles.length === 0) notFound()

  const initials = authorName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  const totalViews = articles.reduce((sum: number, a: any) => sum + (a.views || 0), 0)

  return (
    <>
      <Masthead />
      <div className="h-1.5 bg-sow-purple" />
      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* Author card */}
        <div className="flex items-center gap-6 border-b-2 border-sow-purple pb-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-sow-purple text-white flex items-center justify-center text-2xl font-black font-serif flex-shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-[10px] tracking-[3px] uppercase text-sow-purple font-bold mb-1">Staff Reporter</p>
            <h1 className="font-serif text-4xl font-black">{authorName}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {articles.length} article{articles.length !== 1 ? 's' : ''} published · {totalViews} total views
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article: any) => <ArticleCard key={article.id} article={article} />)}
        </div>
      </main>
      <Footer />
    </>
  )
}
