import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default async function GeniusSection() {
  const { data: geniuses } = await supabase
    .from('genius_of_week')
    .select('*')
    .eq('active', true)
    .order('week_of', { ascending: false })
    .limit(4)

  if (!geniuses || geniuses.length === 0) return null

  return (
    <section className="my-8 border-y-4 border-sow-gold py-6">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="bg-sow-gold px-3 py-1">
            <span className="text-[10px] tracking-[2.5px] uppercase font-black text-ink">⭐ Genius of the Week</span>
          </div>
          <div className="flex-1 border-t-2 border-sow-gold w-24" />
        </div>
        <Link href="/genius"
          className="text-[10px] tracking-[1.5px] uppercase font-bold text-sow-gold hover:underline whitespace-nowrap">
          View All →
        </Link>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {geniuses.map((g: any) => (
          <Link href="/genius" key={g.id}
            className="group border-2 border-sow-gold/30 hover:border-sow-gold transition-all overflow-hidden">
            {/* Photo */}
            <div className="relative aspect-square bg-gradient-to-br from-sow-blue to-sow-purple overflow-hidden">
              {g.photo_url ? (
                <Image src={g.photo_url} alt={g.student_name} fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-white/40 font-black text-4xl font-serif">
                    {g.student_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <p className="text-[9px] text-sow-gold font-bold tracking-wide uppercase">{g.student_class}</p>
              </div>
            </div>

            {/* Info */}
            <div className="p-2.5 bg-amber-50 group-hover:bg-sow-gold/10 transition-colors">
              <p className="font-serif font-black text-sm leading-tight line-clamp-1">{g.student_name}</p>
              <p className="text-[9px] uppercase tracking-wide text-sow-blue font-bold mt-0.5">{g.subject}</p>
              <p className="text-[10px] text-gray-500 mt-1 line-clamp-2 italic">"{g.achievement}"</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
