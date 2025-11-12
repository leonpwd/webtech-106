"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import getSupabase from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function SiteHeader() {
  const [user, setUser] = useState<any | null>(null)
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = getSupabase()
    if (!supabase) return

    // fetch current user
    supabase.auth.getUser().then((res) => {
      setUser(res.data.user || null)
      if (res.data.user) setEmail(res.data.user.email || "")
    })

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user)
        setEmail(session.user.email || "")
      } else {
        setUser(null)
        setEmail("")
      }
    })

    return () => {
      // unsubscribe
      ;(listener as any)?.subscription?.unsubscribe?.()
    }
  }, [])

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)

    const supabase = getSupabase()
    if (!supabase) {
      setError("Supabase n'est pas configuré.")
      return
    }

    setLoading(true)
    const updatePayload: any = {}
    if (email) updatePayload.email = email
    if (password) updatePayload.password = password

    try {
      const { data, error } = await supabase.auth.updateUser(updatePayload)
      if (error) {
        setError(error.message)
      } else {
        setMessage("Mise à jour effectuée. Vérifiez votre email si nécessaire.")
        setPassword("")
        setUser(data.user || user)
      }
    } catch (err: any) {
      setError(err.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  async function handleSignOut() {
    const supabase = getSupabase()
    if (!supabase) return
    await supabase.auth.signOut()
    setUser(null)
    setOpen(false)
  }

  return (
    <header className="border-b border-neutral-800 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-2xl">LoL Champions</Link>

        <div className="flex items-center gap-6">
          <nav className="space-x-6 hidden sm:block">
            <Link href="/champions" className="text-sm">Champions</Link>
            <Link href="/worlds" className="text-sm">Worlds 2025</Link>
            <Link href="/about" className="text-sm">About</Link>
          </nav>

          {!user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="text-sm px-3 py-1 rounded bg-transparent border border-neutral-700 hover:border-neutral-600"
              >
                Connexion
              </Link>

              <Link
                href="/auth/register"
                className="text-sm px-3 py-1 rounded bg-primary text-white hover:bg-primary/90"
              >
                Inscription
              </Link>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => setOpen((s) => !s)}
                className={cn(
                  "text-sm px-3 py-1 rounded bg-neutral-800 border border-neutral-700",
                )}
              >
                {user.email || "Mon compte"}
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-80 bg-neutral-900 border border-neutral-800 rounded shadow-lg p-4 z-50">
                  <h4 className="font-semibold mb-2">Tableau de bord</h4>
                  <form onSubmit={handleUpdate} className="space-y-3">
                    <div>
                      <label className="block text-sm text-neutral-300">Email</label>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full rounded border px-3 py-2 bg-neutral-800 text-white placeholder:text-neutral-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-neutral-300">Nouveau mot de passe</label>
                      <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="laisser vide pour ne pas changer"
                        className="mt-1 block w-full rounded border px-3 py-2 bg-neutral-800 text-white placeholder:text-neutral-400"
                      />
                    </div>

                    {error && <div className="text-sm text-red-500">{error}</div>}
                    {message && <div className="text-sm text-green-500">{message}</div>}

                    <div className="flex items-center justify-between">
                      <Button type="submit" disabled={loading}>{loading ? "Enregistrement…" : "Enregistrer"}</Button>
                      <button type="button" onClick={handleSignOut} className="text-sm text-red-400">Se déconnecter</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
