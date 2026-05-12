import Masthead from '@/components/layout/Masthead'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'

export const revalidate = 3600

const CATEGORY_CONFIG: Record<string, { color: string; emoji: string; label: string }> = {
  exam:        { color: '#1e3a8a', emoji: '📝', label: 'Exam Excellence' },
  competition: { color: '#dc2626', emoji: '🏆', label: 'Competition Win' },
  certificate: { color: '#15803d', emoji: '📜', label: 'Certificate' },
  award:       { color: '#d97706', emoji: '🥇', label: 'Award' },
  sport:       { color: '#7c3aed', emoji: '⚽', label: 'Sports Achievement' },
  leadership:  { color: '#0e7490', emoji: '👑', label: 'Leadership' },
  other:       { color: '#6b7280', emoji: '⭐', label: 'Achievement' },
}

export default async function HonoursPage() {
  const { data: achievements } = await supabase
    .from('honours')
    .select('*')
    .eq('published', true)
    .order('achieved_at', { ascending: false })

  const all = achievements || []

  // Group by category for the board sections
  const byCategory: Record<string, typeof all> = {}
  all.forEach(a => {
    const cat = a.category || 'other'
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(a)
  })

  // Top honourees (featured = true)
  const featured = all.filter(a => a.featured)
  const recent   = all.slice(0, 12)

  return (
    <>
      <Masthead />
      <div className="h-1.5 bg-sow-gold" />
      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="text-center border-b-2 border-sow-gold pb-6 mb-10">
          <p className="text-[10px] tracking-[4px] uppercase font-bold mb-2" style={{ color: 'var(--sow-gold)' }}>
            Seat of Wisdom Group of Schools
          </p>
          <h1 className="font-blackletter text-5xl md:text-6xl text-sow-blue mb-2">Honours Board</h1>
          <p className="font-serif italic text-lg max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Celebrating the achievements, awards, and excellence of our students.
          </p>
          <div className="flex justify-center gap-6 mt-4 flex-wrap">
            {Object.entries(CATEGORY_CONFIG).slice(0, 6).map(([key, cfg]) => (
              <span key={key} className="flex items-center gap-1.5 text-xs font-bold"
                style={{ color: cfg.color }}>
                {cfg.emoji} {cfg.label}
              </span>
            ))}
          </div>
        </div>

        {/* Featured / Hall of Fame */}
        {featured.length > 0 && (
          <section className="mb-12">
            <div className="section-heading section-gold mb-6">
              <span className="section-heading-label">🏆 Hall of Fame</span>
              <div className="section-heading-rule" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((a: any) => {
                const cfg = CATEGORY_CONFIG[a.category] || CATEGORY_CONFIG.other
                return (
                  <div key={a.id}
                    className="border-2 overflow-hidden group hover:shadow-lg transition-shadow"
                    style={{ borderColor: cfg.color }}>
                    {/* Top colour strip */}
                    <div className="px-4 py-2 flex items-center justify-between"
                      style={{ backgroundColor: cfg.color }}>
                      <span className="text-[9px] tracking-[2px] uppercase font-black text-white">
                        {cfg.emoji} {cfg.label}
                      </span>
                      <span className="text-[9px] text-white/60">
                        {a.achieved_at ? format(new Date(a.achieved_at), 'MMM yyyy') : ''}
                      </span>
                    </div>

                    {/* Photo */}
                    <div className="relative aspect-square overflow-hidden"
                      style={{ background: `linear-gradient(135deg, ${cfg.color}33, ${cfg.color}11)` }}>
                      {a.photo_url ? (
                        <Image src={a.photo_url} alt={a.student_name} fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-7xl opacity-20">{cfg.emoji}</span>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <p className="text-[9px] tracking-[2px] uppercase font-bold text-white/80">
                          {a.student_class}
                          {a.campus && <> · {a.campus}</>}
                        </p>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4" style={{ backgroundColor: 'var(--bg-surface)' }}>
                      <h3 className="font-serif text-xl font-black mb-0.5" style={{ color: 'var(--text-primary)' }}>
                        {a.student_name}
                      </h3>
                      <p className="text-[10px] tracking-[2px] uppercase font-bold mb-2"
                        style={{ color: cfg.color }}>
                        {a.title}
                      </p>
                      {a.description && (
                        <p className="text-sm leading-relaxed italic font-serif"
                          style={{ color: 'var(--text-secondary)' }}>
                          "{a.description}"
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Recent achievements — compact list */}
        {recent.length > 0 && (
          <section className="mb-10">
            <div className="section-heading section-blue mb-5">
              <span className="section-heading-label">Recent Achievements</span>
              <div className="section-heading-rule" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recent.map((a: any) => {
                const cfg = CATEGORY_CONFIG[a.category] || CATEGORY_CONFIG.other
                return (
                  <div key={a.id}
                    className="flex gap-4 p-4 border hover:shadow-sm transition-shadow group"
                    style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--bg-surface)' }}>
                    {/* Avatar / photo */}
                    <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center text-white font-black text-lg"
                      style={{ backgroundColor: cfg.color }}>
                      {a.photo_url ? (
                        <Image src={a.photo_url} alt={a.student_name} width={56} height={56}
                          className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <span>{cfg.emoji}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                            {a.student_name}
                          </h4>
                          <p className="text-[10px] uppercase tracking-wide font-bold"
                            style={{ color: cfg.color }}>
                            {a.student_class}
                            {a.campus && <> · {a.campus}</>}
                          </p>
                        </div>
                        <span className="text-[9px] flex-shrink-0" style={{ color: 'var(--text-faint)' }}>
                          {a.achieved_at ? format(new Date(a.achieved_at), 'MMM d, yyyy') : ''}
                        </span>
                      </div>
                      <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--text-primary)' }}>
                        {a.title}
                      </p>
                      {a.description && (
                        <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                          {a.description}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* By category */}
        {Object.keys(byCategory).length > 1 && (
          <section>
            <div className="section-heading section-default mb-5">
              <span className="section-heading-label">Browse by Category</span>
              <div className="section-heading-rule" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(byCategory).map(([cat, items]) => {
                const cfg = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.other
                return (
                  <div key={cat} className="p-4 border text-center"
                    style={{ borderColor: cfg.color + '40', backgroundColor: cfg.color + '08' }}>
                    <div className="text-3xl mb-1">{cfg.emoji}</div>
                    <p className="font-bold text-sm" style={{ color: cfg.color }}>{cfg.label}</p>
                    <p className="text-2xl font-black font-serif mt-1" style={{ color: 'var(--text-primary)' }}>
                      {items.length}
                    </p>
                    <p className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--text-faint)' }}>
                      achievement{items.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {all.length === 0 && (
          <div className="text-center py-16" style={{ color: 'var(--text-faint)' }}>
            <p className="text-5xl mb-4">🏆</p>
            <p className="italic">No achievements recorded yet.</p>
            <p className="text-xs mt-2">Add achievements from the admin panel.</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
