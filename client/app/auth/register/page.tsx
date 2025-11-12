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
                className="mt-1 block w-full rounded border px-3 py-2 bg-neutral-800 text-white placeholder:text-neutral-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded border px-3 py-2 bg-neutral-800 text-white placeholder:text-neutral-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Confirmer le mot de passe</label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mt-1 block w-full rounded border px-3 py-2 bg-neutral-800 text-white placeholder:text-neutral-400"
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
          </form>
        </CardContent>
        <CardFooter />
      </Card>
    </div>
  )
}
