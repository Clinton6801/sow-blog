import Link from 'next/link'
import Masthead from '@/components/layout/Masthead'
import Footer from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <>
      <Masthead />
      <main className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-[10px] tracking-[3px] uppercase text-gray-400 mb-4">404 — Page Not Found</p>
        <h1 className="font-serif text-7xl font-black mb-4">Lost in the Press Room</h1>
        <p className="text-gray-500 italic text-lg mb-8 font-serif">
          The article or page you're looking for has gone to print — or perhaps never existed.
        </p>
        <Link href="/" className="btn-primary">
          ← Back to Homepage
        </Link>
      </main>
      <Footer />
    </>
  )
}
