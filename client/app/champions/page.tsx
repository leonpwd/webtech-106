/// <reference types="react" />
import React from 'react'
import ChampionCard from '../../components/ChampionCard'

async function fetchChampions(){
  const res = await fetch(new URL('../../data/champions.json', import.meta.url));
  if(!res.ok) throw new Error('Failed to load champions')
  return res.json()
}

export default async function ChampionsPage(){
  const champions = await fetchChampions()
  return (
    <main className="p-6 container mx-auto">
      <h1 className="text-3xl font-bold mb-6">Champions Index</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {champions.map((c:any)=> <ChampionCard key={c.id} champion={c} />)}
      </div>
    </main>
  )
}
