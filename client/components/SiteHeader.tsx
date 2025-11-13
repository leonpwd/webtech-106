"use client"

import React, { useEffect, useState, useRef } from "react"
import { useRouter } from 'next/navigation'
import Link from "next/link"
import getSupabase from "@/lib/supabaseClient"
import { FaUserCircle, FaSearch, FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa'

export default function SiteHeader() {
  const [user, setUser] = useState<any | null>(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isDark, setIsDark] = useState(false)
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const searchRef = useRef<HTMLDivElement | null>(null)
  const championsRef = useRef<any[] | null>(null)

  // close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    function onDocClick(e: MouseEvent | TouchEvent) {
      if (!dropdownRef.current) return
      const target = e.target as Node
      if (dropdownOpen && !dropdownRef.current.contains(target)) {
        setDropdownOpen(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setDropdownOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('touchstart', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('touchstart', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [dropdownOpen])

  // click outside search suggestions to close
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      const t = e.target as Node
      if (showSuggestions && searchRef.current && !searchRef.current.contains(t)) {
        setShowSuggestions(false)
        setSelectedIndex(-1)
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [showSuggestions])

  async function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q) {
      router.push('/champions')
      return
    }

    // Try to find an exact champion match locally (case-insensitive). If found, redirect to the champion page.
    try {
      const res = await fetch('/data/champions.json')
      if (res.ok) {
        const json = await res.json()
        const rows = Array.isArray(json?.default ? json.default : json) ? (json?.default ?? json) : json
        const needle = q.toLowerCase()
        const found = rows.find((r:any) => {
          const f:any = r.data ? r.data : r
          const rid = (r.id ?? '').toString().toLowerCase()
          const rname = (f.name ?? '').toString().toLowerCase()
          const rkey = (f.key ?? '').toString().toLowerCase()
          return rid === needle || rname === needle || rkey === needle
        })
        if (found) {
          const foundId = found.id ?? (found.data && (found.data.id || found.data.name)) ?? (found.name || '')
          if (foundId) {
            router.push(`/champions/${encodeURIComponent(foundId)}`)
            return
          }
        }
      }
    } catch (err) {
      // ignore and fallback to search results
    }

    // fallback: go to search results page
    router.push(`/champions?q=${encodeURIComponent(q)}`)
  }

  // load champion list once for inline suggestions
  useEffect(() => {
    let mounted = true
    fetch('/data/champions.json')
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return
        const rows = Array.isArray(json?.default ? json.default : json) ? (json?.default ?? json) : json
        championsRef.current = rows.map((r:any) => ({
          id: r.id ?? (r.data && (r.data.id || r.data.name)) ?? r.name,
          name: (r.data ? r.data.name : r.name) || '',
          key: (r.data ? r.data.key : r.key) || ''
        }))
      })
      .catch(() => {
        championsRef.current = []
      })
    return () => { mounted = false }
  }, [])

  // filter suggestions as user types
  function updateSuggestions(q: string) {
    const needle = q.trim().toLowerCase()
    if (!needle) {
      setSuggestions([])
      setShowSuggestions(false)
      setSelectedIndex(-1)
      return
    }
    const list = (championsRef.current ?? []).filter((c:any) => {
      return c.name.toLowerCase().includes(needle) || (c.id || '').toString().toLowerCase().includes(needle) || (c.key || '').toString().toLowerCase().includes(needle)
    }).slice(0, 8)
    setSuggestions(list)
    setShowSuggestions(list.length > 0)
    setSelectedIndex(-1)
  }

  function handleSuggestionSelect(item:any) {
    const id = item.id
    router.push(`/champions/${encodeURIComponent(id)}`)
    setShowSuggestions(false)
    setSelectedIndex(-1)
    setQuery(item.name)
  }

  useEffect(() => {
    const supabase = getSupabase()
    if (!supabase) return

    // initial user
    supabase.auth.getUser().then((res) => {
      setUser(res.data.user || null)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) setUser(session.user)
      else setUser(null)
    })

    return () => {
      ;(listener as any)?.subscription?.unsubscribe?.()
    }
  }, [])

  // simple theme toggle that toggles a "dark" class on <html>
  useEffect(() => {
    const html = document.documentElement
    if (isDark) html.classList.add('dark')
    else html.classList.remove('dark')
  }, [isDark])

  async function handleSignOut() {
    const supabase = getSupabase()
    if (!supabase) return
    await supabase.auth.signOut()
    setUser(null)
    setDropdownOpen(false)
    setMobileOpen(false)
  }

  return (
    <header className="backdrop-blur-md bg-white/6 dark:bg-black/30 border-b border-white/6 dark:border-black/40 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* left: logo */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 no-underline">
              <div className="w-10 h-10 rounded-md flex items-center justify-center bg-gradient-to-br from-primary to-accent shadow-xl transform-gpu hover:scale-105 transition">
                {/* simple crest */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L20 7v6c0 5-4 9-8 9s-8-4-8-9V7l8-5z" fill="rgba(255,255,255,0.12)" />
                  <path d="M12 6l4 3-4 3-4-3 4-3z" fill="white" opacity="0.9" />
                </svg>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-extrabold tracking-tight">RiftForge</span>
                <span className="text-xs text-neutral-400 -mt-1">LoL Tools &amp; Builds</span>
              </div>
            </Link>
          </div>

          {/* center: nav (hidden on small) */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/champions" className="px-3 py-2 rounded hover:bg-white/4">Champions</Link>
              <Link href="/gtc" className="px-3 py-2 rounded hover:bg-white/4">GTC</Link>
              <Link href="/forum" className="px-3 py-2 rounded hover:bg-white/4">Forum</Link>
          </nav>

          {/* right: search / actions */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center bg-white/5 dark:bg-black/25 rounded-lg px-3 py-1 gap-2 border border-white/6 dark:border-black/40">
              <FaSearch className="text-neutral-300" />
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <div className="relative" ref={searchRef}>
                  <input
                    aria-label="Search champions"
                    placeholder="Search champions..."
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); updateSuggestions(e.target.value) }}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowDown') {
                        e.preventDefault()
                        if (suggestions.length > 0) setSelectedIndex(i => Math.min(i + 1, suggestions.length - 1))
                      } else if (e.key === 'ArrowUp') {
                        e.preventDefault()
                        setSelectedIndex(i => Math.max(i - 1, 0))
                      } else if (e.key === 'Enter') {
                        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
                          e.preventDefault()
                          handleSuggestionSelect(suggestions[selectedIndex])
                        }
                        // otherwise normal submit will handle exact-match redirect
                      } else if (e.key === 'Escape') {
                        setShowSuggestions(false)
                        setSelectedIndex(-1)
                      }
                    }}
                    className="bg-transparent outline-none text-sm placeholder:text-neutral-400 w-44"
                  />

                  {showSuggestions && (
                    <ul role="listbox" aria-label="Search suggestions" className="absolute left-0 mt-1 w-72 max-h-56 overflow-auto rounded-md border border-border bg-white/95 dark:bg-black/80 text-foreground dark:text-white shadow-lg z-50">
                      {suggestions.map((s, idx) => (
                        <li
                          key={s.id + '-' + idx}
                          role="option"
                          aria-selected={selectedIndex === idx}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`px-0 py-0`}
                        >
                          <Link
                            href={`/champions/${encodeURIComponent(s.id)}`}
                            onClick={() => { setShowSuggestions(false); setSelectedIndex(-1); setQuery(s.name) }}
                            className={`block px-3 py-2 cursor-pointer ${selectedIndex === idx ? 'bg-primary/10 dark:bg-primary/20' : 'hover:bg-white/6 dark:hover:bg-black/30'}`}
                          >
                            <div className="text-sm font-medium">{s.name}</div>
                            <div className="text-xs text-muted-foreground">{s.id}</div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </form>
            </div>

            <button
              onClick={() => setIsDark(d => !d)}
              className="p-2 rounded-md hover:bg-white/6 dark:hover:bg-black/40 transition"
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {isDark ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-neutral-300" />}
            </button>

            {/* auth / avatar */}
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(d => !d)}
                  className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-white/8 hover:ring-primary/50 transition"
                  aria-label="User menu"
                >
                  {user?.user_metadata?.icon ? (
                    <img src={user.user_metadata.icon} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-neutral-200"><FaUserCircle /></div>
                  )}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white/95 text-foreground dark:bg-black/30 dark:text-white border border-border dark:border-black/40 rounded-lg shadow-lg backdrop-blur-sm p-2">
                    <Link href="/dashboard" className="block px-3 py-2 text-sm hover:bg-white/4 rounded">Dashboard</Link>
                    <Link href="/profile" className="block px-3 py-2 text-sm hover:bg-white/4 rounded">Profile</Link>
                    <button onClick={handleSignOut} className="w-full text-left px-3 py-2 text-sm hover:bg-rose-600/20 rounded">Sign out</button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link href="/auth/login" className="text-sm px-3 py-1 rounded-md border border-white/8">Login</Link>
                <Link href="/auth/register" className="text-sm px-3 py-1 rounded-md bg-primary text-white">Sign Up</Link>
              </div>
            )}

            {/* mobile menu button */}
            <button className="md:hidden p-2" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <FaBars />
            </button>
          </div>
        </div>
      </div>

      {/* mobile panel */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileOpen(false)}>
          <div className="absolute right-0 top-0 w-72 h-full bg-gradient-to-b from-black/60 to-black/75 backdrop-blur p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-gradient-to-br from-primary to-accent" />
                <div>
                  <div className="font-bold">RiftForge</div>
                  <div className="text-xs text-neutral-400">LoL Tools &amp; Builds</div>
                </div>
              </div>
              <button onClick={() => setMobileOpen(false)}><FaTimes /></button>
            </div>

            <nav className="flex flex-col gap-3">
              <Link href="/champions" className="px-3 py-2 rounded hover:bg-white/4">Champions</Link>
              <Link href="/gtc" className="px-3 py-2 rounded hover:bg-white/4">GTC</Link>
              <Link href="/forum" className="px-3 py-2 rounded hover:bg-white/4">Forum</Link>
            </nav>

            <div className="mt-6">
              {user ? (
                <>
                  <Link href="/dashboard" className="block px-3 py-2 rounded bg-primary text-white mb-2">Dashboard</Link>
                  <button onClick={handleSignOut} className="w-full text-left px-3 py-2 rounded border border-white/6">Sign out</button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="block px-3 py-2 rounded border border-white/6 mb-2">Login</Link>
                  <Link href="/auth/register" className="block px-3 py-2 rounded bg-primary text-white">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
