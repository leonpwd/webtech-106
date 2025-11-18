"use client"

import React, { useState } from "react"
import getSupabase from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!email || !password) {
      setError("Veuillez fournir un email et un mot de passe.")
      return
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }

    const supabase = getSupabase()
    if (!supabase) {
      setError("Supabase n'est pas configuré. Définissez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY.")
      return
    }

    setLoading(true)
    const { data, error: authErr } = await supabase.auth.signUp({ email, password })
    setLoading(false)

    if (authErr) {
      setError(authErr.message)
      return
    }

    setSuccess("Inscription réussie — vérifiez votre email pour confirmer (si configuré). Redirection…")
    // Optionally redirect after a short delay
    setTimeout(() => router.push("/"), 1600)
  }

  async function handleOAuth(provider: 'github' | 'discord') {
    setError(null)
    const supabase = getSupabase()
    if (!supabase) {
      setError("Supabase n'est pas configuré. Définissez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY.")
      return
    }

    setLoading(true)
    try {
      // Compute redirect target and normalize to include a scheme if missing.
      const rawRedirect = (process.env.NEXT_PUBLIC_APP_URL as string) || (typeof window !== 'undefined' ? window.location.origin : '')
      let redirectTo = rawRedirect || ''
      if (redirectTo && !/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(redirectTo)) {
        if (!/^localhost(:|$)/.test(redirectTo)) redirectTo = `https://${redirectTo}`
      }
      if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') console.log('OAuth redirectTo:', redirectTo)
      const { error: oauthError } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } })
      if (oauthError) setError(oauthError.message)
      // Supabase handles redirect
    } catch (err: any) {
      setError(err?.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Inscription</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-sm border px-3 py-2 bg-neutral-800 text-white placeholder:text-neutral-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-sm border px-3 py-2 bg-neutral-800 text-white placeholder:text-neutral-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Confirmer le mot de passe</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mt-1 block w-full rounded-sm border px-3 py-2 bg-neutral-800 text-white placeholder:text-neutral-400"
                required
              />
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}
            {success && <div className="text-sm text-green-600">{success}</div>}

            <div className="flex items-center justify-between">
              <Button type="submit" disabled={loading}>
                {loading ? "Inscription…" : "S'inscrire"}
              </Button>
              <Link href="/auth/login" className="text-sm text-primary underline ml-3">
                Déjà un compte ? Se connecter
              </Link>
            </div>

            <div className="mt-4">
              <div className="text-sm text-muted-foreground mb-2">Ou s'inscrire avec</div>
              <div className="flex flex-wrap gap-2">
                <Button className="w-full sm:w-auto" variant="outline" onClick={() => handleOAuth('github')} disabled={loading}>
                  {loading ? "Ouverture…" : (
                    <>
                      <span className="mr-2 inline-flex items-center" aria-hidden>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                          <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.96 3.22 9.16 7.69 10.64.56.1.76-.24.76-.53 0-.26-.01-1-.02-1.95-3.13.68-3.79-1.51-3.79-1.51-.51-1.29-1.25-1.63-1.25-1.63-1.02-.7.08-.69.08-.69 1.12.08 1.71 1.15 1.71 1.15 1 .72 2.62.51 3.26.39.1-.3.39-.51.71-.63-2.5-.28-5.12-1.25-5.12-5.56 0-1.23.44-2.23 1.16-3.02-.12-.28-.5-1.4.11-2.92 0 0 .95-.3 3.12 1.16.9-.25 1.86-.38 2.81-.38.95 0 1.91.13 2.81.38 2.17-1.46 3.12-1.16 3.12-1.16.61 1.52.23 2.64.11 2.92.72.79 1.16 1.79 1.16 3.02 0 4.32-2.63 5.27-5.13 5.55.4.35.76 1.04.76 2.1 0 1.52-.01 2.75-.01 3.13 0 .29.2.64.77.53C19.03 20.9 22.25 16.7 22.25 11.75 22.25 5.48 17.27.5 12 .5z" />
                        </svg>
                      </span>
                      S'inscrire avec GitHub
                    </>
                  )}
                </Button>
                <Button className="w-full sm:w-auto" variant="outline" onClick={() => handleOAuth('discord')} disabled={loading}>
                  {loading ? "Ouverture…" : (
                    <>
                      <span className="mr-2 inline-flex items-center" aria-hidden>
                        <svg width="16" height="16" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                          <path d="M60.104 4.552A58.3 58.3 0 0046.6.9a41.7 41.7 0 00-1.98 4.086 55.3 55.3 0 00-14.28 0A41.6 41.6 0 0028.4.9c-5.5 1.05-10.5 2.8-15.5 4.5C4.6 18.6 2.1 32.9 3.5 47.1a60.7 60.7 0 0018.1 5.3c1.4-2 2.7-4 3.9-6.1-5.7-1.7-10-4.8-13-8.4 1-.7 2-1.5 2.9-2.3 2.2 1.6 5 3 9 3.9 5.2.9 10.4.8 15.6 0 4-.8 6.8-2.2 9-3.9.9.8 1.9 1.6 2.9 2.3-2.9 3.6-7.3 6.7-13 8.4 1.3 2.1 2.6 4.1 3.9 6.1a60.6 60.6 0 0018.1-5.3c1.6-15.4-1-29.7-8.4-42.5z" fill="currentColor"/>
                        </svg>
                      </span>
                      S'inscrire avec Discord
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter />
      </Card>
    </div>
  )
}
