import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-12 bg-sow-blue text-white">
      {/* Colour bar */}
      <div className="h-1 flex">
        <div className="flex-1 bg-sow-red" />
        <div className="flex-1 bg-sow-gold" />
        <div className="flex-1 bg-sow-green" />
        <div className="flex-1 bg-sow-purple" />
        <div className="flex-1 bg-sow-teal" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h2 className="font-blackletter text-4xl mb-2 text-sow-gold">The SOW Chronicle</h2>
            <p className="text-blue-200 text-sm leading-relaxed mb-4">
              The official press club publication of Seat of Wisdom Group of Schools, Ibadan.
              Committed to honest, student-driven journalism since 2026.
            </p>
            <div className="flex gap-2 flex-wrap">
              {[
                { label: 'Submit Story', href: '/submit', cls: 'bg-sow-gold text-ink' },
                { label: 'About Us',     href: '/about',  cls: 'border border-white/30 text-white hover:bg-white/10' },
                { label: 'Contact',      href: '/contact',cls: 'border border-white/30 text-white hover:bg-white/10' },
              ].map(b => (
                <Link key={b.href} href={b.href}
                  className={`text-[10px] tracking-[1.5px] uppercase font-bold px-3 py-1.5 transition-colors ${b.cls}`}>
                  {b.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-[10px] tracking-[2px] uppercase font-bold mb-3 pb-1 border-b border-white/20 text-sow-gold">
              Sections
            </h3>
            <ul className="space-y-1.5">
              {[
                ['📰 News',         '/category/news'],
                ['📚 Academics',    '/category/academics'],
                ['⚽ Sports',       '/category/sports'],
                ['🎭 Arts & Culture','/category/arts-culture'],
                ['💬 Opinion',      '/category/opinion'],
                ['📅 Events',       '/category/events'],
                ['🖼 Gallery',      '/gallery'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-xs text-blue-200 hover:text-white hover:underline transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-[10px] tracking-[2px] uppercase font-bold mb-3 pb-1 border-b border-white/20 text-sow-gold">
              Information
            </h3>
            <ul className="space-y-1.5">
              {[
                ['About the Press Club', '/about'],
                ['Contact Us',           '/contact'],
                ['Submit a Story',        '/submit'],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-xs text-blue-200 hover:text-white hover:underline transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-6 pt-4 flex flex-col md:flex-row justify-between items-center text-[10px] text-blue-300 tracking-wider uppercase gap-2">
          <span>© {new Date().getFullYear()} SOW Press Club · Seat of Wisdom Group of Schools</span>
          <span>All rights reserved · Ibadan, Oyo State, Nigeria</span>
        </div>
      </div>
    </footer>
  )
}
