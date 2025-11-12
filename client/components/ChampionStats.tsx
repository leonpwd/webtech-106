"use client"
import React, { useState } from 'react'

type Stats = {
  hp?: number
  hpperlevel?: number
  mp?: number
  mpperlevel?: number
  movespeed?: number
  armor?: number
  armorperlevel?: number
  spellblock?: number
  spellblockperlevel?: number
  attackrange?: number
  hpregen?: number
  hpregenperlevel?: number
  mpregen?: number
  mpregenperlevel?: number
  crit?: number
  critperlevel?: number
  attackdamage?: number
  attackdamageperlevel?: number
  attackspeed?: number
  attackspeedperlevel?: number
}

function formatNum(n:number){
  if(Math.abs(n) >= 1000) return Math.round(n).toLocaleString()
  if(Number.isInteger(n)) return String(n)
  return String(Math.round(n * 100) / 100)
}

function calcAtLevel(base = 0, perLevel = 0, level = 1){
  return base + perLevel * (level - 1)
}

function calcAttackSpeed(base = 0, perLevel = 0, level = 1){
  // perLevel is percent gained per level (e.g. 2.5 means +2.5% per level)
  const multiplier = 1 + (perLevel / 100) * (level - 1)
  return base * multiplier
}

const StatRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-center gap-3">
    <div className="w-8 h-8 flex items-center justify-center text-xl">{icon}</div>
    <div className="flex-1">
      <div className="text-sm opacity-80">{label}</div>
      <div className="font-mono font-semibold">{value}</div>
    </div>
  </div>
)

export default function ChampionStats({ stats, info }:{ stats: Stats, info?: any }){
  const [level, setLevel] = useState(1)

  const hp = calcAtLevel(stats.hp ?? 0, stats.hpperlevel ?? 0, level)
  const hpregen = calcAtLevel(stats.hpregen ?? 0, stats.hpregenperlevel ?? 0, level)
  const ad = calcAtLevel(stats.attackdamage ?? 0, stats.attackdamageperlevel ?? 0, level)
  // Magic 'power' - use info.magic rating (0-10) when available, otherwise show 0
  const magicRating = (info && typeof info.magic !== 'undefined') ? info.magic : undefined
  const armor = calcAtLevel(stats.armor ?? 0, stats.armorperlevel ?? 0, level)
  const mr = calcAtLevel(stats.spellblock ?? 0, stats.spellblockperlevel ?? 0, level)
  const mp = calcAtLevel(stats.mp ?? 0, stats.mpperlevel ?? 0, level)
  // treat mpregen as MP5 (DDragon values are MP5); label accordingly
  const mp5 = calcAtLevel(stats.mpregen ?? 0, stats.mpregenperlevel ?? 0, level)
  const as_ = calcAttackSpeed(stats.attackspeed ?? 0, stats.attackspeedperlevel ?? 0, level)
  const ms = stats.movespeed ?? 0

  return (
    <div className="space-y-4">
      {/* Health + HP Regen */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-neutral-800/40 rounded flex items-center justify-between">
          <div>
            <div className="text-sm opacity-80">Health</div>
            <div className="font-mono font-semibold">{formatNum(hp)}</div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-80">HP Regen</div>
            <div className="font-mono">{formatNum(hpregen)}</div>
          </div>
        </div>

        {/* Attack + Magic */}
        <div className="p-3 bg-neutral-800/40 rounded flex items-center justify-between">
          <div>
            <div className="text-sm opacity-80">Attack (AD)</div>
            <div className="font-mono font-semibold">{formatNum(ad)}</div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-80">Magic Power</div>
            <div className="font-mono">{typeof magicRating !== 'undefined' ? String(magicRating) : '—'}</div>
          </div>
        </div>
      </div>

      {/* Armor + MR */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-neutral-800/40 rounded">
          <StatRow icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-300"><path d="M12 2l9 4v6c0 5-4 9-9 10-5-1-9-5-9-10V6l9-4z"/></svg>} label="Armor" value={formatNum(armor)} />
        </div>
        <div className="p-3 bg-neutral-800/40 rounded">
          <StatRow icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-sky-300"><path d="M12 2l9 4v6c0 5-4 9-9 10-5-1-9-5-9-10V6l9-4z"/></svg>} label="Magic Resist" value={formatNum(mr)} />
        </div>
      </div>

      {/* Mana + MP5 */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-neutral-800/40 rounded flex items-center justify-between">
          <div>
            <div className="text-sm opacity-80">Mana</div>
            <div className="font-mono font-semibold">{formatNum(mp)}</div>
          </div>
          <div className="text-right">
            <div className="text-sm opacity-80">MP5</div>
            <div className="font-mono">{formatNum(mp5)}</div>
          </div>
        </div>

        <div className="p-3 bg-neutral-800/40 rounded">
          <StatRow icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-yellow-400"><path d="M12 2l3 7h7l-5.5 4 2 7L12 17l-6.5 3 2-7L2 9h7l3-7z"/></svg>} label="Attack Speed" value={formatNum(as_)} />
        </div>
      </div>

      {/* Other stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-neutral-800/40 rounded">
          <StatRow icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-indigo-300"><path d="M3 12h7l4 8 3-16 4 8"/></svg>} label="Move Speed" value={formatNum(ms)} />
        </div>
        <div className="p-3 bg-neutral-800/40 rounded">
          <StatRow icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-rose-300"><path d="M5 12h14M12 5v14"/></svg>} label="Range" value={formatNum(stats.attackrange ?? 0)} />
        </div>
      </div>

      <div className="pt-2">
        <label className="block text-sm opacity-80">Level: <span className="font-semibold">{level}</span></label>
        <input aria-label="Champion level" type="range" min={1} max={18} value={level} onChange={(e)=> setLevel(Number(e.target.value))} className="w-full level-slider" />

        {/* Slider styling: larger blue thumb with subtle outer circle */}
        <style>{`
          .level-slider{ -webkit-appearance:none; appearance:none; width:100%; height:14px; background:transparent; }
          .level-slider:focus{ outline:none; }
          .level-slider::-webkit-slider-runnable-track{ height:8px; background: rgba(255,255,255,0.06); border-radius:999px; }
          .level-slider::-webkit-slider-thumb{ -webkit-appearance:none; appearance:none; margin-top: -10px; width:28px; height:28px; border-radius:50%; background:#3b82f6; border:6px solid rgba(59,130,246,0.14); box-shadow:0 0 0 6px rgba(59,130,246,0.12); cursor:pointer; }
          .level-slider::-moz-range-track{ height:8px; background: rgba(255,255,255,0.06); border-radius:999px; }
          .level-slider::-moz-range-thumb{ width:28px; height:28px; border-radius:50%; background:#3b82f6; border:6px solid rgba(59,130,246,0.14); box-shadow:0 0 0 6px rgba(59,130,246,0.12); cursor:pointer; }
          .level-slider::-ms-track{ height:8px; background:transparent; border-color:transparent; color:transparent; }
          .level-slider::-ms-fill-lower{ background: rgba(59,130,246,0.25); border-radius:999px; }
          .level-slider::-ms-fill-upper{ background: rgba(255,255,255,0.06); border-radius:999px; }
        `}</style>
      </div>
    </div>
  )
}
