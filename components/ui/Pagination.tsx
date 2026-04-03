import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string  // e.g. '/category/news' or '/'
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null

  const prev = currentPage - 1
  const next = currentPage + 1

  function pageHref(page: number) {
    if (page === 1) return basePath
    return `${basePath}?page=${page}`
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)

  return (
    <nav className="flex items-center justify-center gap-1 mt-8 pt-6 border-t-2 border-sow-blue">
      {/* Prev */}
      {currentPage > 1 ? (
        <Link href={pageHref(prev)}
          className="px-4 py-2 text-sm font-bold border-2 border-sow-blue text-sow-blue hover:bg-sow-blue hover:text-white transition-colors">
          ← Prev
        </Link>
      ) : (
        <span className="px-4 py-2 text-sm font-bold border-2 border-gray-200 text-gray-300 cursor-not-allowed">← Prev</span>
      )}

      {/* Page numbers */}
      {pages.map((page, idx) => {
        const prevPage = pages[idx - 1]
        const showEllipsis = prevPage && page - prevPage > 1

        return (
          <span key={page} className="flex items-center gap-1">
            {showEllipsis && <span className="px-2 text-gray-400 text-sm">…</span>}
            {page === currentPage ? (
              <span className="px-3 py-2 text-sm font-bold bg-sow-blue text-white border-2 border-sow-blue">
                {page}
              </span>
            ) : (
              <Link href={pageHref(page)}
                className="px-3 py-2 text-sm font-bold border-2 border-gray-200 text-ink hover:border-sow-blue hover:text-sow-blue transition-colors">
                {page}
              </Link>
            )}
          </span>
        )
      })}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link href={pageHref(next)}
          className="px-4 py-2 text-sm font-bold border-2 border-sow-blue text-sow-blue hover:bg-sow-blue hover:text-white transition-colors">
          Next →
        </Link>
      ) : (
        <span className="px-4 py-2 text-sm font-bold border-2 border-gray-200 text-gray-300 cursor-not-allowed">Next →</span>
      )}
    </nav>
  )
}
