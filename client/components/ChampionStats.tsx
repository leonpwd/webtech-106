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

// Icon SVGs as reusable components
const HealthIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="text-red-500"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
const RegenIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-500"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/></svg>
const AttackIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="text-orange-500"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.3 4 13c0 5.25 3.07 9.8 7.26 11.93.44.04.94.07 1.44.07.9 0 1.77-.22 2.58-.67.9-.46 1.73-1.1 2.4-1.85.67-.75 1.19-1.6 1.53-2.5.34-.9.52-1.85.52-2.82V8.55c1.9-1.42 3.8-4.58 3.8-7.58 0-1.25-.756-2.433-2.02-2.433s-2.18 1.27-2.18 2.52c0 1.26.92 3.5 2.48 5.12.0-1.08-.305-2.42-.905-3.85-.805-2.43-2.71-4.64-4.96-4.04-.705.27-1.005 1.11-.285 1.5.12.08.615.45 1.45 1.02 0 0 .57.08 1.08.24 1.1.32 1.93.88 2.22 1.58.29.7.35 1.15.35 1.58 0 1.06-.27 2.3-.916 3.41C10.5 10 9.52 11 8.5 11s-2-.5-2-1.5.5-1.5 1.5-1.5 1.5.5 1.5 1.5-1 1.5-1.5 1.5-1.5-.5-1.5-1.5c0-.18.02-.36.05-.53.63-1.6 1.86-2.92 3.45-3.77"/></svg>
const ArmorIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400"><path d="M12 2l9 4v6c0 5-4 9-9 10-5-1-9-5-9-10V6l9-4z"/></svg>
const MagicResistIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400"><path d="M12 2l9 4v6c0 5-4 9-9 10-5-1-9-5-9-10V6l9-4z"/></svg>
const ManaIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="text-purple-500"><circle cx="12" cy="12" r="10"/></svg>
const ManaRegenIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-400"><path d="M12 5v14M5 12h14"/></svg>
const AttackSpeedIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="text-yellow-500"><path d="M12 2l3 7h7l-5.5 4 2 7L12 17l-6.5 3 2-7L2 9h7l3-7z"/></svg>
const MoveSpeedIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-indigo-400"><path d="M3 12h7l4 8 3-16 4 8"/></svg>
const RangeIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="text-cyan-500"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>
const MagicPowerIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="text-pink-500"><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 100 16 8 8 0 000-16zm0 3a1 1 0 110 2 1 1 0 010-2zm0 5a1 1 0 110 2 1 1 0 010-2zm3-3a1 1 0 110 2 1 1 0 010-2zm-6 0a1 1 0 110 2 1 1 0 010-2z"/></svg>

const StatRow = ({ icon: Icon, label, value, perLevel }: { icon: React.FC, label: string, value: string, perLevel?: string }) => (
  <div className="flex items-start gap-3 p-3 bg-neutral-800/40 rounded hover:bg-neutral-800/60 transition">
    <div className="w-6 h-6 flex-shrink-0 mt-0.5"><Icon /></div>
    <div className="flex-1 min-w-0">
      <div className="text-xs opacity-70 uppercase tracking-wide">{label}</div>
      <div className="font-mono font-semibold text-sm">{value}</div>
      {perLevel && <div className="text-xs opacity-60 text-green-400">+{perLevel}/lvl</div>}
    </div>
  </div>
)

export default function ChampionStats({ stats, info }:{ stats: Stats, info?: any }){
  const [level, setLevel] = useState(1)

  const hp = calcAtLevel(stats.hp ?? 0, stats.hpperlevel ?? 0, level)
  const hpregen = calcAtLevel(stats.hpregen ?? 0, stats.hpregenperlevel ?? 0, level)
  const ad = calcAtLevel(stats.attackdamage ?? 0, stats.attackdamageperlevel ?? 0, level)
  const magicRating = (info && typeof info.magic !== 'undefined') ? info.magic : undefined
  const armor = calcAtLevel(stats.armor ?? 0, stats.armorperlevel ?? 0, level)
  const mr = calcAtLevel(stats.spellblock ?? 0, stats.spellblockperlevel ?? 0, level)
  const mp = calcAtLevel(stats.mp ?? 0, stats.mpperlevel ?? 0, level)
  const mp5 = calcAtLevel(stats.mpregen ?? 0, stats.mpregenperlevel ?? 0, level)
  const as_ = calcAttackSpeed(stats.attackspeed ?? 0, stats.attackspeedperlevel ?? 0, level)
  const ms = stats.movespeed ?? 0
  const ar = stats.attackrange ?? 0

  return (
    <div className="space-y-4">
      {/* Health Stats - 2 columns */}
      <div className="grid grid-cols-2 gap-3">
        <StatRow 
          icon={HealthIcon} 
          label="Health" 
          value={formatNum(hp)} 
          perLevel={formatNum(stats.hpperlevel ?? 0)} 
        />
        <StatRow 
          icon={RegenIcon} 
          label="HP Regen" 
          value={formatNum(hpregen)} 
          perLevel={formatNum(stats.hpregenperlevel ?? 0)} 
        />
      </div>

      {/* Attack Stats - 2 columns */}
      <div className="grid grid-cols-2 gap-3">
        <StatRow 
          icon={AttackIcon} 
          label="Attack Damage" 
          value={formatNum(ad)} 
          perLevel={formatNum(stats.attackdamageperlevel ?? 0)} 
        />
        <StatRow 
          icon={AttackSpeedIcon} 
          label="Attack Speed" 
          value={formatNum(as_)} 
          perLevel={formatNum(stats.attackspeedperlevel ?? 0)} 
        />
      </div>

      {/* Magic Power - Single full width */}
      {typeof magicRating !== 'undefined' && (
        <div className="grid grid-cols-2 gap-3">
          <StatRow 
            icon={MagicPowerIcon} 
            label="Magic Power" 
            value={String(magicRating)} 
          />
        </div>
      )}

      {/* Defense Stats - 2 columns */}
      <div className="grid grid-cols-2 gap-3">
        <StatRow 
          icon={ArmorIcon} 
          label="Armor" 
          value={formatNum(armor)} 
          perLevel={formatNum(stats.armorperlevel ?? 0)} 
        />
        <StatRow 
          icon={MagicResistIcon} 
          label="Magic Resist" 
          value={formatNum(mr)} 
          perLevel={formatNum(stats.spellblockperlevel ?? 0)} 
        />
      </div>

      {/* Mana Stats - 2 columns */}
      {(mp !== 0 || mp5 !== 0) && (
        <div className="grid grid-cols-2 gap-3">
          <StatRow 
            icon={ManaIcon} 
            label="Mana" 
            value={formatNum(mp)} 
            perLevel={formatNum(stats.mpperlevel ?? 0)} 
          />
          <StatRow 
            icon={ManaRegenIcon} 
            label="Mana Regen (MP5)" 
            value={formatNum(mp5)} 
            perLevel={formatNum(stats.mpregenperlevel ?? 0)} 
          />
        </div>
      )}

      {/* Utility Stats - 2 columns */}
      <div className="grid grid-cols-2 gap-3">
        <StatRow 
          icon={MoveSpeedIcon} 
          label="Move Speed" 
          value={formatNum(ms)} 
        />
        <StatRow 
          icon={RangeIcon} 
          label="Attack Range" 
          value={formatNum(ar)} 
        />
      </div>

      <div className="pt-4 border-t border-neutral-700/50">
        <label className="block text-sm opacity-80 mb-3">Level: <span className="font-bold text-blue-400">{level}</span></label>
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
