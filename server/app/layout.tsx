import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Science & Engineering Articles',
  description: 'A collection of articles on science, engineering, and technology',
  keywords: ['science', 'engineering', 'technology', 'articles', 'research'],
  authors: [{ name: 'Léon D' }, { name: 'Nirziin' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen bg-background font-sans antialiased">
          <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
              <div className="mr-4 hidden md:flex">
                <a className="mr-6 flex items-center space-x-2" href="/">
                  <span className="hidden font-bold sm:inline-block">
                    Science & Engineering
                  </span>
                </a>
              </div>
              <nav className="flex items-center space-x-6 text-sm font-medium">
                <a href="/articles" className="transition-colors hover:text-foreground/80">
                  Articles
                </a>
                <a href="/categories" className="transition-colors hover:text-foreground/80">
                  Categories
                </a>
                <a href="/about" className="transition-colors hover:text-foreground/80">
                  About
                </a>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
              <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                Built with Next.js, TypeScript, and Tailwind CSS.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}