"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { championImageUrl } from '../../lib/ddragon'

// Simple client-side GtC (Guess the Champ) page
import championsData from '../../public/data/champions.json'
import championsMeta from '../../public/data/champions_meta.json'

function normalizeName(s:string){ return s.toLowerCase() }

export default function GtC(){
  const champions = useMemo(()=> (Array.isArray(championsData) ? championsData : (championsData as any).default), [])
  const [target] = useState(()=> champions[Math.floor(Math.random()*champions.length)])
  const [query, setQuery] = useState('')
  const [candidates, setCandidates] = useState<any[]>([])
  const [picked, setPicked] = useState<any|null>(null)
  const [won, setWon] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const metaIndex = useMemo(()=> {
    const m = Array.isArray(championsMeta) ? championsMeta : (championsMeta as any).default
    const map = new Map<string, any>()
    for(const item of m) map.set(item.id, item)
    return map
  }, [])

  useEffect(()=>{
    if(!query) return setCandidates([])
    const q = normalizeName(query)
    const matches = champions.filter((c:any)=> normalizeName(c.name).startsWith(q)).slice(0,10)
    setCandidates(matches)
  },[query, champions])

  function onSelect(c:any){ setQuery(c.name); setCandidates([]); submitGuess(c) }

  function submitGuess(c:any){
    setPicked(c)
    const isWin = (normalizeName(c.name) === normalizeName(target.name))
    setWon(isWin)
    setHistory(h => [{ guess: c, correct: isWin, time: Date.now() }, ...h])
    if(isWin){
      // confetti: simple DOM-based confetti using emojis
      const root = document.getElementById('confetti')
      if(root){
        for(let i=0;i<60;i++){ const span = document.createElement('span'); span.textContent = '🎉'; span.style.position='absolute'; span.style.left=(Math.random()*80+'%'); span.style.top='-10px'; span.style.fontSize=(12+Math.random()*28)+'px'; span.style.opacity='0.9'; root.appendChild(span); setTimeout(()=> root.removeChild(span),2500) }
      }
    }
  }

  function compareStat(stat:string){
    if(!picked) return ''
    const a = (picked.stats && picked.stats[stat]) || 0
    const b = (target.stats && target.stats[stat]) || 0
    if(a === b) return '—'
    return a > b ? 'higher' : 'lower'
  }

  return (
    <div className="p-6 container mx-auto relative">
      <div id="confetti" className="pointer-events-none absolute inset-0 z-50"></div>
      <h1 className="text-3xl font-bold mb-4">Guess The Champ</h1>
      <p className="mb-4 text-sm opacity-80">Type a champion name and try to guess the hidden champion.</p>

      <div className="mb-4">
        <input className="w-full p-3 rounded bg-neutral-800/40" placeholder="Type champion name..." value={query} onChange={(e)=> setQuery(e.target.value)} />
        {candidates.length > 0 && (
          <div className="mt-2 bg-neutral-800/50 rounded max-h-60 overflow-auto border border-neutral-700">
            {candidates.map(c=> (
              <div key={c.id} className="p-2 flex items-center gap-3 hover:bg-neutral-800/30 cursor-pointer" onClick={()=> onSelect(c)}>
                <img src={championImageUrl(c.image?.full ?? c.image, c.version)} width={32} height={32} alt="" className="rounded" />
                <div>{c.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-4 flex items-center gap-3">
        <button className="px-4 py-2 bg-yellow-400 rounded text-black font-semibold" onClick={()=> picked ? submitGuess(picked) : null}>Guess</button>
        <button className="px-3 py-1 border rounded text-sm" onClick={()=>{ setQuery(''); setCandidates([]); setPicked(null); setWon(false) }}>Reset</button>
      </div>

      {picked && (
        <div className="bg-neutral-900/60 p-4 rounded">
          <div className="flex items-center gap-4">
            <img src={championImageUrl(picked.image?.full ?? picked.image, picked.version)} width={64} height={64} className="rounded" alt="" />
            <div>
              <div className="text-xl font-semibold">{picked.name}</div>
              <div className="text-sm opacity-80">{picked.title}</div>
            </div>
            <div className="ml-auto text-sm font-semibold">Result: {won ? 'Correct 🎉' : 'Try again'}</div>
          </div>

          {/* Attribute match indicators based on champions_meta.json */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Attribute hints</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['genre','species','role','resource','range_type','region','release_year'].map((attr)=>{
                const pMeta = metaIndex.get(picked.id)
                const tMeta = metaIndex.get(target.id)
                const pVal = pMeta ? (pMeta[attr] ?? 'blank') : 'blank'
                const tVal = tMeta ? (tMeta[attr] ?? 'blank') : 'blank'
                const match = (pVal !== 'blank' && tVal !== 'blank' && pVal === tVal)
                const color = match ? 'bg-green-500' : 'bg-red-500'
                return (
                  <div key={attr} className="p-2 bg-neutral-800/40 rounded flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${pVal === 'blank' || tVal === 'blank' ? 'bg-gray-500' : color}`} />
                    <div className="text-sm truncate"><strong className="capitalize">{attr.replace('_',' ')}</strong>: <span className="opacity-80">{pVal}</span></div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-neutral-800/40 rounded">
              <div className="text-sm opacity-80">Health (lvl1)</div>
              <div className="font-mono">{(picked.stats?.hp ?? 0)}</div>
              <div className="text-xs opacity-70">{compareStat('hp')}</div>
            </div>
            <div className="p-3 bg-neutral-800/40 rounded">
              <div className="text-sm opacity-80">Attack (lvl1)</div>
              <div className="font-mono">{(picked.stats?.attackdamage ?? 0)}</div>
              <div className="text-xs opacity-70">{compareStat('attackdamage')}</div>
            </div>
            <div className="p-3 bg-neutral-800/40 rounded">
              <div className="text-sm opacity-80">Move Speed</div>
              <div className="font-mono">{(picked.stats?.movespeed ?? 0)}</div>
              <div className="text-xs opacity-70">{compareStat('movespeed')}</div>
            </div>
            <div className="p-3 bg-neutral-800/40 rounded">
              <div className="text-sm opacity-80">Mana</div>
              <div className="font-mono">{(picked.stats?.mp ?? 0)}</div>
              <div className="text-xs opacity-70">{compareStat('mp')}</div>
            </div>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-2">Previous guesses</h4>
          <div className="space-y-2">
            {history.map((h, idx)=> (
              <div key={idx} className="flex items-center gap-3 p-2 bg-neutral-800/40 rounded">
                <img src={championImageUrl(h.guess.image?.full ?? h.guess.image, h.guess.version)} width={40} height={40} className="rounded" alt="" />
                <div className="flex-1">
                  <div className="font-semibold">{h.guess.name}</div>
                  <div className="text-xs opacity-70">{h.correct ? 'Correct' : 'Incorrect'}</div>
                </div>
                <div className="text-xs opacity-60">{new Date(h.time).toLocaleTimeString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 text-sm opacity-70">(This mini-game is local-only and uses the offline champions data.)</div>
    </div>
  )
}
