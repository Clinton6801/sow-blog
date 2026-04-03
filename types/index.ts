export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
}

export type Article = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  cover_image_url: string | null
  category_id: string | null
  author_name: string
  author_role: string | null
  status: 'draft' | 'published' | 'archived'
  featured: boolean
  views: number
  created_at: string
  published_at: string | null
  updated_at: string
  categories?: Category
}

export type Submission = {
  id: string
  title: string
  content: string
  excerpt: string | null
  category_id: string | null
  student_name: string
  student_class: string
  student_email: string | null
  status: 'pending' | 'approved' | 'rejected'
  admin_note: string | null
  created_at: string
  reviewed_at: string | null
  categories?: Category
}

export type Comment = {
  id: string
  article_id: string
  commenter_name: string
  commenter_class: string | null
  content: string
  approved: boolean
  created_at: string
}

export type NewsletterSubscriber = {
  id: string
  email: string
  name: string | null
  subscribed_at: string
  active: boolean
}
