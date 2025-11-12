import Link from 'next/link';
// import the client ParticleWave component directly (it has "use client")
import ParticleWave from '@/components/ParticleWave';
import ModernBackground from '@/components/ModernBackground';

export default function Page() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* modern WebGL shader background */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <ModernBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/12 mix-blend-overlay" />
      </div>

      <div className="min-h-screen flex items-center">
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <h1 className="mb-4">
            <span className="block text-3xl font-modern text-neutral-200 mb-2">Welcome to</span>
            <span className="block text-7xl font-display tracking-wider bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text drop-shadow-lg">THE FIGHT</span>
          </h1>
          <p className="mb-6 text-lg text-neutral-200">Modern champions index, abilities and minigame.</p>
          <div className="flex justify-center gap-4">
            <Link href="/champions" className="bg-primary px-6 py-3 rounded font-semibold text-white">Browse Champions</Link>
            <Link href="/gtc" className="border border-primary px-6 py-3 rounded text-primary">Guess the champ</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
