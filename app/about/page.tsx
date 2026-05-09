import Masthead from '@/components/layout/Masthead'
import Footer from '@/components/layout/Footer'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const fallbackTeam = [
  { name: 'Editor-in-Chief', role: 'Leads editorial direction and final publishing decisions', student_class: 'SS3', photo_url: null },
  { name: 'News Editor', role: 'Oversees news coverage and reporter assignments', student_class: 'SS2', photo_url: null },
  { name: 'Sports Correspondent', role: 'Covers all sports events and inter-house competitions', student_class: 'SS2', photo_url: null },
  { name: 'Arts & Culture Editor', role: 'Manages cultural stories, drama, and creative features', student_class: 'SS1', photo_url: null },
  { name: 'Photography Editor', role: 'Captures events and provides visual storytelling', student_class: 'SS2', photo_url: null },
  { name: 'Junior Reporter', role: 'Reports on academic and student life stories', student_class: 'JSS3', photo_url: null },
]

export const revalidate = 3600

export default async function AboutPage() {
  let teamData: any[] | null = null
  try {
    const result = await supabase
      .from('press_club_team')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true })
    teamData = result.data
  } catch {
    // Table doesn't exist yet — use fallback
  }

  const team = (teamData && teamData.length > 0) ? teamData : fallbackTeam

  return (
    <>
      <Masthead />
      <main className="max-w-4xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="border-b-2 border-sow-blue pb-6 mb-8 text-center">
          <p className="text-[10px] tracking-[3px] uppercase font-bold mb-2" style={{ color: 'var(--text-faint)' }}>Est. 2026</p>
          <h1 className="font-serif text-5xl md:text-6xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>About The SOW Chronicle</h1>
          <p className="font-serif italic text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Student journalism at Seat of Wisdom Group of Schools — reporting with truth, integrity, and clarity.
          </p>
        </div>

        {/* Mission */}
        <section className="mb-10">
          <div className="section-heading section-blue mb-5">
            <span className="section-heading-label">Our Mission</span>
            <div className="section-heading-rule" />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-base leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                The SOW Chronicle is the official press club publication of Seat of Wisdom Group of Schools, Ibadan.
                Founded to give students a voice, our publication covers everything from academic achievements and
                sporting victories to cultural events and student opinion.
              </p>
              <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                We believe that learning to report, write, and think critically about the world around us is one
                of the most valuable skills a student can develop. Every article published here is a step toward
                building a generation of clear, honest, and responsible communicators.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Truth First', desc: 'We verify facts before we publish. Accuracy is non-negotiable.' },
                { label: 'Student Voice', desc: 'Every student has a story worth telling. We give that story a platform.' },
                { label: 'Community Focus', desc: 'We write for and about the SOW community — students, staff, and families.' },
                { label: 'Open Door', desc: 'Any student can submit a story. We review everything fairly.' },
              ].map(v => (
                <div key={v.label} className="border-l-2 border-sow-blue pl-4">
                  <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{v.label}</p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mb-10">
          <div className="section-heading section-blue mb-5">
            <span className="section-heading-label">Editorial Team</span>
            <div className="section-heading-rule" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border" style={{ borderColor: 'var(--border-medium)' }}>
            {team.map((member: any, i: number) => (
              <div key={i} className="p-5 border-b border-r last:border-b-0" style={{ borderColor: 'var(--border-light)' }}>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-full bg-sow-blue text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {member.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{member.name}</p>
                    <p className="text-[10px] uppercase tracking-wide" style={{ color: 'var(--text-faint)' }}>{member.student_class || member.class}</p>
                  </div>
                </div>
                <p className="text-xs mt-1 ml-11" style={{ color: 'var(--text-secondary)' }}>{member.role}</p>
              </div>
            ))}
          </div>
          <p className="text-xs italic mt-3 text-center" style={{ color: 'var(--text-faint)' }}>
            Team positions are filled by students each academic year. Contact the press club to learn more.
          </p>
        </section>

        {/* Join + Submit */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="border-2 border-sow-blue p-6">
            <h3 className="font-serif text-2xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Submit a Story</h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              Have a story you think the school should know about? Any student can submit an article.
              Our editorial team reviews every submission fairly and responds promptly.
            </p>
            <Link href="/submit" className="btn-primary text-sm">
              Submit Your Story →
            </Link>
          </div>
          <div className="border p-6" style={{ borderColor: 'var(--border-medium)', backgroundColor: 'var(--bg-subtle)' }}>
            <h3 className="font-serif text-2xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>Join the Press Club</h3>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
              Interested in becoming a reporter, photographer, or editor? The Press Club is open to all
              students. Reach out to us through the contact page or speak to any editorial team member.
            </p>
            <Link href="/contact" className="btn-outline text-sm">
              Get in Touch →
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
