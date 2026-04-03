import Masthead from '@/components/layout/Masthead'
import Footer from '@/components/layout/Footer'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'

export const revalidate = 60

export default async function GeniusPage() {
  const { data: geniuses } = await supabase
    .from('genius_of_week')
    .select('*')
    .order('week_of', { ascending: false })

  const current  = geniuses?.filter(g => g.active) || []
  const previous = geniuses?.filter(g => !g.active) || []

  return (
    <>
      <Masthead />
      <div className="h-1.5 bg-sow-gold" />
      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="text-center border-b-2 border-sow-gold pb-6 mb-10">
          <p className="text-[10px] tracking-[4px] uppercase text-sow-gold font-bold mb-2">Weekly Feature</p>
          <h1 className="font-blackletter text-6xl text-sow-blue mb-2">Genius of the Week</h1>
          <p className="font-serif italic text-gray-500 text-lg max-w-xl mx-auto">
            Celebrating outstanding students from every class across Seat of Wisdom Group of Schools.
          </p>
        </div>

        {/* Current week spotlights */}
        {current.length > 0 && (
          <section className="mb-12">
            <div className="section-heading section-gold mb-6">
              <span className="section-heading-label">This Week's Geniuses</span>
              <div className="section-heading-rule" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {current.map((g: any) => (
                <div key={g.id}
                  className="border-2 border-sow-gold overflow-hidden group hover:shadow-lg transition-shadow">
                  {/* Gold header strip */}
                  <div className="bg-sow-gold px-4 py-2 flex items-center justify-between">
                    <span className="text-[9px] tracking-[2px] uppercase font-black text-ink">⭐ Genius of the Week</span>
                    <span className="text-[9px] text-ink/60">{format(new Date(g.week_of), 'MMM d, yyyy')}</span>
                  </div>

                  {/* Photo */}
                  <div className="relative bg-gradient-to-br from-sow-blue to-sow-purple aspect-square overflow-hidden">
                    {g.photo_url ? (
                      <Image src={g.photo_url} alt={g.student_name} fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white font-black font-serif text-6xl opacity-30">
                          {g.student_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                    )}
                    {/* Class badge overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                      <span className="text-[9px] tracking-[2px] uppercase font-bold text-sow-gold">
                        {g.student_class}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4 bg-paper dark:bg-ink">
                    <h3 className="font-serif text-xl font-black mb-0.5">{g.student_name}</h3>
                    <p className="text-[10px] tracking-[2px] uppercase font-bold text-sow-blue mb-3">{g.subject}</p>
                    <p className="text-sm text-gray-600 leading-relaxed italic font-serif">"{g.achievement}"</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Hall of Fame — previous weeks */}
        {previous.length > 0 && (
          <section>
            <div className="section-heading section-blue mb-6">
              <span className="section-heading-label">Hall of Fame</span>
              <div className="section-heading-rule" />
              <span className="text-[10px] text-gray-400 whitespace-nowrap">Previous weeks</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {previous.map((g: any) => (
                <div key={g.id}
                  className="flex gap-4 p-4 border border-gray-100 hover:border-sow-gold transition-colors group">
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-sow-blue to-sow-purple flex items-center justify-center">
                    {g.photo_url ? (
                      <Image src={g.photo_url} alt={g.student_name} width={56} height={56}
                        className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-black text-lg">
                        {g.student_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-sm">{g.student_name}</h4>
                        <p className="text-[10px] uppercase tracking-wide text-sow-blue font-bold">{g.student_class} · {g.subject}</p>
                      </div>
                      <span className="text-[9px] text-gray-400 whitespace-nowrap">
                        {format(new Date(g.week_of), 'MMM d')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 italic">"{g.achievement}"</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {(!geniuses || geniuses.length === 0) && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-4">⭐</p>
            <p className="italic">No geniuses featured yet — check back soon!</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
