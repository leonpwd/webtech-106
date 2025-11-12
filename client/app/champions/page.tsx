/// <reference types="react" />
import React from 'react'
import ChampionCard from '../../components/ChampionCard'

// Lazy-load Supabase client and require it to be configured (no local JSON fallback)
async function fetchChampions(){
  // Dynamically import the Supabase helper so we don't cause module-evaluation errors
  let getSupabase: any = null
  try {
  // Dynamically import the local client wrapper so dependencies resolve from
  // `client/node_modules` during the build.
  // @ts-ignore - the dynamically-imported module may not have exact TS types here
  const mod = await import('../../lib/supabaseClient')
    getSupabase = mod.default ?? mod
  } catch (e) {
    getSupabase = null
  }

  const supabase = typeof getSupabase === 'function' ? getSupabase() : null
  if(!supabase){
    // Fallback to local JSON file when Supabase env vars are not present. This
    // makes builds possible without requiring secrets in the environment.
    try {
      // Import the JSON statically from the app's public data folder.
      // Path: client/app/champions/page.tsx -> ../../public/data/champions.json
      const local = await import('../../public/data/champions.json')
      const rows = Array.isArray(local?.default ? local.default : local) ? (local?.default ?? local) : []
      // rows may be raw ddragon champion objects or Supabase rows with .data
      return rows.map((r:any) => {
        const f:any = r
        const payload = f.data ? f.data : f
        return { ...payload, id: f.id ?? payload.id, name: f.name ?? payload.name }
      })
    } catch (err) {
      throw new Error('Supabase is not configured and local champions JSON could not be loaded')
    }
  }

  const { data, error } = await supabase
    .from('champions')
    .select('id, name, data')
    .order('name', { ascending: true })

  if(error){
    console.error('Supabase fetch error:', error)
    throw new Error('Failed to load champions from Supabase')
  }

  const rows = Array.isArray(data) ? data : []
  return rows.map((r:any) => ({ ...(r.data || {}), id: r.id, name: r.name || (r.data && r.data.name) }))
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
