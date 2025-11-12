import Link from 'next/link'

export default function Page(){
  return (
    <div className="min-h-screen arcane-hero flex items-center">
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-extrabold mb-4">Arcane • League of Legends</h1>
        <p className="mb-6 text-lg text-yellow-200">Modern champions index, abilities and Worlds 2025 overview.</p>
        <div className="flex justify-center gap-4">
          <Link href="/champions" className="bg-yellow-400 px-6 py-3 rounded-sm font-semibold text-black">Browse Champions</Link>
          <Link href="/worlds" className="border border-yellow-300 px-6 py-3 rounded-sm text-yellow-200">Worlds 2025</Link>
        </div>
      </div>
    </div>
  )
}
