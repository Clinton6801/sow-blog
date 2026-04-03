'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Search, Menu, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import DarkModeToggle from '@/components/ui/DarkModeToggle'

const navLinks = [
  { label: 'Home',         href: '/',                    color: 'hover:bg-sow-blue' },
  { label: 'News',         href: '/category/news',       color: 'hover:bg-sow-blue' },
  { label: 'Academics',    href: '/category/academics',  color: 'hover:bg-sow-green' },
  { label: 'Sports',       href: '/category/sports',     color: 'hover:bg-sow-red' },
  { label: 'Arts',         href: '/category/arts-culture', color: 'hover:bg-sow-purple' },
  { label: 'Opinion',      href: '/category/opinion',    color: 'hover:bg-sow-teal' },
  { label: 'Events',       href: '/events',           color: 'hover:bg-sow-gold' },
  { label: '⭐ Genius',    href: '/genius',           color: 'hover:bg-sow-gold' },
  { label: 'Gallery',      href: '/gallery',          color: 'hover:bg-sow-purple' },
  { label: 'About',        href: '/about',               color: 'hover:bg-ink' },
  { label: 'Contact',      href: '/contact',             color: 'hover:bg-ink' },
  { label: '✏ Submit',    href: '/submit',              color: 'hover:bg-sow-red' },
]

export default function Masthead() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const router = useRouter()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <header className="bg-paper border-b-4 border-sow-blue">
      {/* Colour bar */}
      <div className="h-1.5 flex">
        <div className="flex-1 bg-sow-blue" />
        <div className="flex-1 bg-sow-red" />
        <div className="flex-1 bg-sow-gold" />
        <div className="flex-1 bg-sow-green" />
        <div className="flex-1 bg-sow-purple" />
        <div className="flex-1 bg-sow-teal" />
      </div>

      {/* Top strip */}
      <div className="px-4 py-1.5 flex justify-between items-center text-[10px] tracking-widest uppercase text-gray-500 max-w-6xl mx-auto">
        <span>{today}</span>
        <span className="hidden md:block">Seat of Wisdom Schools · Ibadan, Oyo State</span>
        <span>Free Copy · Vol. I</span>
      </div>

      {/* Masthead title */}
      <div className="text-center py-3 px-4 border-t border-b border-sow-blue/20">
        <Link href="/" className="block group">
          <h1 className="font-blackletter text-5xl md:text-7xl leading-none tracking-tight text-sow-blue group-hover:text-sow-red transition-colors duration-300">
            The SOW Chronicle
          </h1>
        </Link>
        <p className="text-[10px] tracking-[4px] uppercase text-gray-500 mt-1">
          Press Club · Seat of Wisdom Group of Schools · Reporting with Truth &amp; Clarity
        </p>
      </div>

      {/* Nav */}
      <nav className="bg-sow-blue max-w-full">
        <div className="max-w-6xl mx-auto px-4 flex items-center">
          <div className="hidden md:flex flex-1 overflow-x-auto">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[10px] tracking-[1.5px] uppercase font-bold px-3 py-2.5 text-white/80 hover:text-white hover:bg-white/20 transition-colors whitespace-nowrap border-r border-white/10 last:border-0"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Search + dark mode */}
          <div className="flex items-center gap-1 ml-auto py-1">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="px-3 py-1.5 text-sm bg-white text-ink outline-none w-44 border-0"
                />
                <button type="submit" className="px-2 py-1.5 bg-sow-gold text-ink hover:bg-amber-400">
                  <Search size={14} />
                </button>
                <button type="button" onClick={() => setSearchOpen(false)} className="px-2 py-1.5 bg-white/20 text-white hover:bg-white/30">
                  <X size={14} />
                </button>
              </form>
            ) : (
              <button onClick={() => setSearchOpen(true)} className="p-2 text-white/70 hover:text-white transition-colors" aria-label="Search">
                <Search size={16} />
              </button>
            )}
            <DarkModeToggle />
            <button className="md:hidden p-2 text-white/70 hover:text-white" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 pb-2 max-w-6xl mx-auto">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                className="block text-[11px] tracking-[1.5px] uppercase font-bold px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/10 border-b border-white/5">
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
}
