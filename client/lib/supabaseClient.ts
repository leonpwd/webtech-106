import { createClient } from '@supabase/supabase-js'

// Synchronous factory that returns a Supabase client or null if env isn't set.
// Keep this file inside `client/` so the Next.js build resolves dependencies from
// `client/node_modules` (avoids cross-package resolution issues during Vercel builds).
export default function getSupabase() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    ''

  if (!url || !key) return null
  return createClient(url, key)
}
