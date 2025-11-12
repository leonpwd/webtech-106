import './globals.css'
import SiteHeader from '@/components/SiteHeader'

export const metadata = {
  title: 'League of Legends — Champions Hub (Client)',
  description: 'Modern Arcane-themed champions index'
}

export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-900 text-white">
        <header className="border-b border-neutral-800 py-4">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <Link href="/" className="font-extrabold text-2xl">LoL Champions</Link>
            <nav className="space-x-6">
              <Link href="/champions" className="text-sm">Champions</Link>
              <Link href="/gtc" className="text-sm">GtC</Link>
              <Link href="/worlds" className="text-sm">Worlds 2025</Link>
              <Link href="/about" className="text-sm">About</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-neutral-800 py-6 text-center text-sm mt-12">Built with Next.js · Tailwind</footer>
      </body>
    </html>
  )
}
