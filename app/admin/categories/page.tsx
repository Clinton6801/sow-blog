import { supabaseAdmin } from '@/lib/supabase'
import CategoryManager from './CategoryManager'

export const revalidate = 0

export default async function AdminCategoriesPage() {
  const { data: categories } = await supabaseAdmin
    .from('categories')
    .select('*')
    .order('name')

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-black">Manage Categories</h1>
        <p className="text-gray-500 text-sm mt-1">Add, rename, or remove article categories.</p>
      </div>
      <CategoryManager initialCategories={categories || []} />
    </div>
  )
}
