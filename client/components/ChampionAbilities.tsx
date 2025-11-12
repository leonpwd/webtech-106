"use client"
import React, { useState } from 'react'

export default function ChampionAbilities({ passive, spells, version }:{ passive:any, spells:any[], version:string }){
  const [selected, setSelected] = useState<any>(passive || (spells && spells[0]) || null)

  const spellIcon = (img:string, kind:'passive'|'spell') => {
    if(!img) return ''
    if(kind === 'passive') return `https://ddragon.leagueoflegends.com/cdn/${version}/img/passive/${img}`
    return `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${img}`
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        {passive && (
          <button onClick={()=>setSelected(passive)} className="p-1 bg-neutral-800 rounded">
            <img src={spellIcon(passive.image?.full,'passive')} alt={passive.name} width={48} height={48} />
          </button>
        )}
        {spells && spells.map((s:any, i:number)=> (
          <button key={i} onClick={()=>setSelected(s)} className="p-1 bg-neutral-800 rounded">
            <img src={spellIcon(s.image?.full,'spell')} alt={s.name} width={48} height={48} />
          </button>
        ))}
      </div>

      {selected && (
        <div className="bg-neutral-900/60 p-4 rounded">
          <h4 className="text-xl font-semibold">{selected.name}</h4>
          <div className="text-sm opacity-90 mb-2">{selected.description || selected.tooltip || selected.sanitizedDescription || ''}</div>
          {selected.cooldown && <div className="text-sm">Cooldown: {Array.isArray(selected.cooldown) ? selected.cooldown.join('/') : selected.cooldown}</div>}
          {selected.cost && <div className="text-sm">Cost: {Array.isArray(selected.cost) ? selected.cost.join('/') : selected.cost}</div>}
        </div>
      )}
    </div>
  )
}
