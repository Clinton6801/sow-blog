'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface NavItem { label: string; href: string }
interface NavGroup { label: string; items: NavItem[] }

export default function AdminMobileNav({ navGroups }: { navGroups: NavGroup[] }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <>
      {/* Hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="flex flex-col gap-1 p-1.5 hover:bg-white/10 rounded transition-colors"
        aria-label="Open menu"
      >
        <span className="block w-5 h-0.5 bg-white" />
        <span className="block w-5 h-0.5 bg-white" />
        <span className="block w-5 h-0.5 bg-white" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div className={`fixed top-0 right-0 bottom-0 w-72 bg-sow-blue text-white z-50 flex flex-col transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 flex-shrink-0">
          <span className="font-blackletter text-xl text-sow-gold">Admin Panel</span>
          <button
            onClick={() => setOpen(false)}
            className="text-white/60 hover:text-white text-2xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-2">
          {navGroups.map(group => (
            <div key={group.label} className="mb-2">
              <p className="text-[9px] tracking-[2px] uppercase text-white/30 font-bold px-4 py-2">
                {group.label}
              </p>
              {group.items.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors border-b border-white/5 active:bg-white/20"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex-shrink-0 space-y-3">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="block text-sm text-white/60 hover:text-white transition-colors"
          >
            ← View Public Site
          </Link>
          <button
            onClick={handleLogout}
            className="block text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </>
  )
}
