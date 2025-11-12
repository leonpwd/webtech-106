"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import getSupabase from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { FaUserCircle } from 'react-icons/fa';

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
          <nav className="flex space-x-6">
            <Link href="/champions" className="text-sm">Champions</Link>
            <Link href="/gtc" className="text-sm">GTC</Link>
            {!user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="text-sm px-3 py-1 rounded-sm bg-transparent border border-neutral-700 hover:border-neutral-600"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="text-sm px-3 py-1 rounded-sm bg-primary text-white hover:bg-primary/90"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <Link
                href="/dashboard"
                className="text-sm px-3 py-1 rounded-sm bg-primary text-white hover:bg-primary/90 flex items-center gap-2"
              >
                <FaUserCircle size={20} />
                Dashboard
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
