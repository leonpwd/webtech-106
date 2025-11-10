import Link from 'next/link'
import { championImageUrl } from '../lib/ddragon'

export default function ChampionCard({ champion }:{ champion:any }){
  const imgFile = champion.image?.full || (champion.image ?? '')
  const imageUrl = imgFile ? championImageUrl(imgFile) : '/placeholder-champion.png'
  const role = (champion.tags && champion.tags[0]) || champion.role || ''
  return (
    <Link href={`/champions/${encodeURIComponent(champion.id)}`} className="block p-4 border border-neutral-800 rounded-md hover:shadow-lg bg-neutral-800/40">
      <div className="flex items-center gap-4">
        <img src={imageUrl} alt={champion.name} width={64} height={64} className="rounded" />
        <div>
          <div className="text-lg font-semibold">{champion.name}</div>
          <div className="text-sm opacity-80">{role}</div>
        </div>
      </div>
    </Link>
  )
}
