/// <reference types="react" />
import React from 'react'
import ChampionCard from '../../components/ChampionCard'

// Lazy-load Supabase client and require it to be configured (no local JSON fallback)
async function fetchChampions(){
  // Dynamically import the Supabase helper so we don't cause module-evaluation errors
  let getSupabase: any = null
  try {
    // @ts-ignore - supabase client is CommonJS and may not have TS types here
    const mod = await import('../../../supabase/client')
    getSupabase = mod.default ?? mod
  } catch (e) {
    getSupabase = null
  }

  const supabase = typeof getSupabase === 'function' ? getSupabase() : null
  if(!supabase){
    // Fail fast: we removed the local JSON fallback, so Supabase must be configured
    throw new Error('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in the project root .env')
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
