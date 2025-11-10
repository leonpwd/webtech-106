// ...existing code...
// Push client/data/champions.json into Supabase table `champions`.
// Expects SUPABASE_URL and SUPABASE_SERVICE_KEY (recommended) or SUPABASE_ANON_KEY in env.

const fs = require('fs').promises
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') })
const { createClient } = require('@supabase/supabase-js')

async function main(){
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY
  if(!SUPABASE_URL || !SUPABASE_KEY){
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY / SUPABASE_ANON_KEY in environment')
    process.exit(1)
  }

  const client = createClient(SUPABASE_URL, SUPABASE_KEY)

  try{
    const championsPath = path.resolve(__dirname, '..', 'data', 'champions.json')
    const raw = await fs.readFile(championsPath,'utf8')
    const champions = JSON.parse(raw)
    if(!Array.isArray(champions)) throw new Error('champions.json is not an array')

    // Prepare rows: keep id, name, and full object in `data` column
    const rows = champions.map(c => ({ id: c.id, name: c.name || c.title || null, data: c }))

    console.log('Upserting', rows.length, 'champions into Supabase (table: champions)')
    const { data, error } = await client.from('champions').upsert(rows, { onConflict: 'id' })
    if(error){
      console.error('Supabase upsert error:', error)
      process.exit(1)
    }
    console.log('Upsert successful. Rows returned:', Array.isArray(data) ? data.length : 0)
  }catch(err){
    console.error('Failed to push champions:', err)
    process.exit(1)
  }
}

main()
// ...existing code...