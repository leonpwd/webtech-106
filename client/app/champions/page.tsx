/// <reference types="react" />
import React from 'react'
import ChampionCard from '../../components/ChampionCard'

async function fetchChampions(){
  // Import the JSON directly so Next.js can bundle it correctly for server-side
  // rendering instead of trying to fetch a runtime asset URL.
  const data = await import('../../data/champions.json')
  return data.default ?? data
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
