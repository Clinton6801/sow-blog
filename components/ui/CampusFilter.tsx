'use client'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

const CAMPUSES = [
  { label: 'All Campuses',        slug: '',            color: '#1a1a2e' },
  { label: 'Main Campus',         slug: 'main',        color: '#1e3a8a' },
  { label: 'Alexandrite Campus',  slug: 'alexandrite', color: '#15803d' },
]

interface CampusFilterProps {
  current?: string   // current campus slug, '' = all
  basePath?: string  // path to append ?campus= to, defaults to current path
}

export default function CampusFilter({ current = '', basePath }: CampusFilterProps) {
  const pathname  = usePathname()
  const searchParams = useSearchParams()
  const base = basePath || pathname

  function href(slug: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (slug) params.set('campus', slug)
    else params.delete('campus')
    params.delete('page') // reset pagination
    const qs = params.toString()
    return qs ? `${base}?${qs}` : base
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[10px] tracking-[2px] uppercase font-bold"
        style={{ color: 'var(--text-faint)' }}>Campus:</span>
      {CAMPUSES.map(c => {
        const active = current === c.slug
        return (
          <Link key={c.slug} href={href(c.slug)}
            className="text-[10px] tracking-[1.5px] uppercase font-bold px-3 py-1.5 border-2 transition-colors"
            style={{
              borderColor: active ? c.color : 'var(--border-medium)',
              backgroundColor: active ? c.color : 'transparent',
              color: active ? '#ffffff' : 'var(--text-secondary)',
            }}>
            {c.label}
          </Link>
        )
      })}
    </div>
  )
}
