import { createClient } from "@supabase/supabase-js";

// Synchronous factory that returns a Supabase client or null if env isn't set.
// Keep this file inside `client/` so the Next.js build resolves dependencies from
// `client/node_modules` (avoids cross-package resolution issues during Vercel builds).
export default function getSupabase() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  // Support both the canonical NEXT_PUBLIC_SUPABASE_ANON_KEY and the
  // newer NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY variable name that
  // some Supabase templates/platforms set. Also accept server-side names.
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    "";

  if (!url || !key) return null;
  return createClient(url, key);
}
