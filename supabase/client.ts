const path = require('path')
// Load root .env (project root) so vars are available when running from `client/`
try {
  require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') })
} catch (e) {
  // Fallback: manually read .env from project root and set process.env entries (no dependency required)
  try {
    const envPath = path.resolve(__dirname, '..', '.env')
    const raw = require('fs').readFileSync(envPath, 'utf8')
    raw.split(/\r?\n/).forEach(line => {
      const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/)
      if(m){
        const key = m[1]
        let val = m[2]
        // Remove optional surrounding quotes
        if((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))){
          val = val.slice(1, -1)
        }
        if(!process.env[key]) process.env[key] = val
      }
    })
  } catch (err) {
    // ignore if no .env present
  }
}

const { createClient } = require('@supabase/supabase-js');

// Export a function that creates a Supabase client at call time. This avoids
// throwing during module evaluation if env vars aren't available yet (Turbopack
// can evaluate modules early). Callers can fall back if null is returned.
function getSupabase(){
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY || '';

  if(!url || !key) return null
  return createClient(url, key)
}

module.exports = getSupabase;