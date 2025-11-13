/// <reference types="react" />
import React from 'react'
import ChampionCard from '../../components/ChampionCard'

// Lazy-load Supabase client and require it to be configured (no local JSON fallback)
async function fetchChampions(query?: string){
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
      if (query && query.trim()) {
        const q = query.trim().toLowerCase()
        const filtered = rows.filter((r:any) => {
          const f:any = r
          const payload = f.data ? f.data : f
          const name = (payload.name || '').toString().toLowerCase()
          return name.includes(q)
        })
        return filtered.map((r:any) => {
          const f:any = r
          const payload = f.data ? f.data : f
          return { ...payload, id: f.id ?? payload.id, name: f.name ?? payload.name }
        })
      }
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

  // server-side Supabase query - apply an ilike filter when a query is provided
  let data: any = null
  let error: any = null
  if (query && query.trim()) {
    const q = query.trim()
    const res = await supabase
      .from('champions')
      .select('id, name, data')
      .ilike('name', `%${q}%`)
      .order('name', { ascending: true })
    data = res.data
    error = res.error
  } else {
    const res = await supabase
      .from('champions')
      .select('id, name, data')
      .order('name', { ascending: true })
    data = res.data
    error = res.error
  }

  if(error){
    console.error('Supabase fetch error:', error)
    throw new Error('Failed to load champions from Supabase')
  }

  const rows = Array.isArray(data) ? data : []
  return rows.map((r:any) => ({ ...(r.data || {}), id: r.id, name: r.name || (r.data && r.data.name) }))
}

export default async function ChampionsPage({ searchParams }: { searchParams?: { q?: string } }){
  // Next may provide searchParams as a Promise in some runtimes — await to be safe
  const params = await (searchParams as any)
  const q = params?.q ?? undefined
  const champions = await fetchChampions(q)
  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Champions Index</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {champions.map((c:any)=> <ChampionCard key={c.id} champion={c} />)}
      </div>
    </main>
  )
}
