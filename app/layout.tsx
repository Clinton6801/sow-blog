import type { Metadata } from 'next'
import { Playfair_Display, Source_Sans_3, UnifrakturMaguntia } from 'next/font/google'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import './globals.css'

const playfair   = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' })
const sourceSans = Source_Sans_3({ subsets: ['latin'], variable: '--font-source-sans', display: 'swap' })
const unifraktur = UnifrakturMaguntia({ subsets: ['latin'], weight: '400', variable: '--font-unifraktur', display: 'swap' })

export const metadata: Metadata = {
  title: 'The SOW Chronicle | Seat of Wisdom Schools Press Club',
  description: 'Official press club of Seat of Wisdom Group of Schools, Ibadan. Student journalism with truth and clarity.',
  openGraph: {
    title: 'The SOW Chronicle',
    description: 'Student journalism from Seat of Wisdom Schools, Ibadan.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${sourceSans.variable} ${unifraktur.variable}`}>
      <body className="bg-paper text-ink font-sans antialiased transition-colors duration-200">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
