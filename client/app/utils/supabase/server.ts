
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

// The `cookieStore` can be provided as the result of `cookies()` or a wrapper.
// Be defensive: accept `any` and normalize to an object with `getAll` and `set`.
export const createClient = (cookieStore?: any) => {
  const store = typeof cookieStore === "function" ? cookieStore() : cookieStore || (typeof cookies === 'function' ? cookies() : undefined)

  return createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        // Return all cookies — use getAll when available, otherwise return empty array
        getAll() {
          try {
            if (!store) return [] as any
            if (typeof store.getAll === 'function') return store.getAll()
            // Some runtimes expose an async iterator or different API; fallback to []
            return [] as any
          } catch {
            return [] as any
          }
        },
        // Set cookies if the store supports `set`
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) {
          if (!store) return
          try {
            if (typeof store.set === 'function') {
              cookiesToSet.forEach(({ name, value, options }) => store.set(name, value, options))
            }
          } catch {
            // Setting cookies may not be supported in the current runtime/context.
          }
        },
      },
    },
  );
};
