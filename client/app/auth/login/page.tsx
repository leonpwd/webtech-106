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

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError("Veuillez fournir un email et un mot de passe.")
      return
    }

    const supabase = getSupabase()
    if (!supabase) {
      setError("Supabase n'est pas configuré. Définissez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY.")
      return
    }

    setLoading(true)
    const { data, error: authErr } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (authErr) {
      setError(authErr.message)
      return
    }

    // On success, redirect to home
    router.push("/")
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Se connecter</CardTitle>
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
              <div className="mt-1 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-sm border px-3 py-2 pr-20 bg-neutral-800 text-white placeholder:text-neutral-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-gray-600"
                >
                  {showPassword ? "Masquer" : "Afficher"}
                </button>
              </div>
            </div>

            {error && <div className="text-sm text-red-600">{error}</div>}

            <div className="flex items-center justify-between">
              <Button type="submit" disabled={loading}>
                {loading ? "Connexion…" : "Se connecter"}
              </Button>
              <Link href="/auth/register" className="text-sm text-primary underline ml-3">
                Pas de compte ? Inscription
              </Link>
            </div>
          </form>
        </CardContent>
        <CardFooter />
      </Card>
    </div>
  )
}
