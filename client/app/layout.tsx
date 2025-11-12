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
        <SiteHeader />
        <main>{children}</main>
        <footer className="border-t border-neutral-800 py-6 text-center text-sm mt-12">Built with Next.js · Tailwind</footer>
      </body>
    </html>
  )
}
