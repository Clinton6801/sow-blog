import Link from 'next/link'
import { ReactNode } from 'react'
import LogoutButton from './LogoutButton'
import AdminMobileNav from './AdminMobileNav'

const navGroups = [
  {
    label: 'Content',
    items: [
      { label: '📊 Dashboard',       href: '/admin/dashboard' },
      { label: '📝 Articles',        href: '/admin/articles' },
      { label: '📥 Submissions',     href: '/admin/submissions' },
      { label: '💬 Comments',        href: '/admin/comments' },
    ],
  },
  {
    label: 'Media & Pages',
    items: [
      { label: '⭐ Genius of Week',  href: '/admin/genius' },
      { label: '🖼 Gallery',         href: '/admin/gallery' },
      { label: '📅 Events',          href: '/admin/events' },
      { label: '⚡ Ticker',          href: '/admin/ticker' },
    ],
  },
  {
    label: 'Settings',
    items: [
      { label: '🏷 Categories',      href: '/admin/categories' },
      { label: '📧 Newsletter',      href: '/admin/newsletter' },
    ],
  },
]


export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">

      {/* ── MOBILE TOP BAR ── */}
      <div className="md:hidden flex items-center justify-between bg-sow-blue text-white px-4 py-3 sticky top-0 z-40">
        <Link href="/" className="font-blackletter text-xl text-sow-gold">SOW Chronicle</Link>
        <div className="flex items-center gap-3">
          <span className="text-[9px] tracking-[2px] uppercase text-white/50">Admin</span>
          <AdminMobileNav navGroups={navGroups} />
        </div>
      </div>

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden md:flex w-56 bg-sow-blue text-white flex-shrink-0 flex-col min-h-screen sticky top-0 h-screen overflow-y-auto">
        {/* Brand */}
        <div className="p-4 border-b border-white/10 flex-shrink-0">
          <Link href="/" className="font-blackletter text-2xl block hover:opacity-80 transition-opacity text-sow-gold">
            SOW Chronicle
          </Link>
          <p className="text-[9px] tracking-[2px] uppercase text-white/40 mt-0.5">Admin Panel</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {navGroups.map(group => (
            <div key={group.label} className="mb-3">
              <p className="text-[9px] tracking-[2px] uppercase text-white/30 font-bold px-4 py-1">
                {group.label}
              </p>
              {group.items.map(item => (
                <Link key={item.href} href={item.href}
                  className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors border-b border-white/5">
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex-shrink-0 space-y-2">
          <Link href="/" className="block text-xs text-white/40 hover:text-white/70 transition-colors">
            ← View Public Site
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 overflow-auto min-w-0">
        {children}
      </main>
    </div>
  )
}
