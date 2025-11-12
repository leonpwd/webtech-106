import Link from 'next/link'
import { championImageUrl } from '../lib/ddragon'

export default function ChampionCard({ champion }:{ champion:any }){
  const imgFile = (champion.image && (champion.image.full || champion.image)) || ''
  const imageUrl = imgFile ? championImageUrl(imgFile, champion.version || undefined) : '/placeholder-champion.png'
  const primaryTag = (champion.tags && champion.tags[0]) || champion.role || ''

  // best-effort lane mapping: per-champion overrides + tag->lane fallback
  const LANE_OVERRIDES: Record<string,string> = {
    Akali: 'Mid',
    Fiora: 'Top',
    Evelynn: 'Jungle',
    MissFortune: 'ADC',
    Sona: 'Support',
    'LeeSin': 'Jungle'
  }
  const TAG_TO_LANE: Record<string,string> = {
    Assassin: 'Mid',
    Mage: 'Mid',
    Marksman: 'ADC',
    Support: 'Support',
    Fighter: 'Top',
    Tank: 'Top'
  }
  const lane = LANE_OVERRIDES[champion.id] || TAG_TO_LANE[primaryTag] || '—'
  return (
    <Link href={`/champions/${encodeURIComponent(champion.id)}`} className="block p-4 border border-neutral-800 rounded-md hover:shadow-lg bg-neutral-800/40">
      <div className="flex items-center gap-4">
        <img src={imageUrl} alt={champion.name} width={64} height={64} className="rounded" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">{champion.name}</div>
          </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(champion.tags || []).map((t:any)=> (
                <span key={t} className="text-xs bg-neutral-800/60 px-2 py-1 rounded-full">{t}</span>
              ))}
            </div>
        </div>
      </div>
    </Link>
  )
}
