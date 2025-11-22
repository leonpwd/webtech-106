"use client";

import React, { useEffect, useState, useRef } from "react";
import getSupabase from "@/lib/supabaseClient";

export default function Dashboard() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");
  const [champions, setChampions] = useState<any[]>([]);
  const [version, setVersion] = useState("13.24.1");
  const [showIconPicker, setShowIconPicker] = useState(true);
  const [showColorPicker, setShowColorPicker] = useState(true);
  const [color, setColor] = useState<string>("#3b82f6");
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deletionEnabled, setDeletionEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    // Fetch user data
    supabase.auth.getUser().then((res) => {
      const currentUser = res.data.user;
      setUser(currentUser);
      setEmail(currentUser?.email || "");
      setName(currentUser?.user_metadata?.name || "");
      setIcon(currentUser?.user_metadata?.icon || "");
      setColor(currentUser?.user_metadata?.color || "#3b82f6");
      setLoading(false);
    });

    // Fetch champions data
    fetch("https://ddragon.leagueoflegends.com/api/versions.json")
      .then((res) => res.json())
      .then((versions) => {
        const latestVersion = versions[0];
        setVersion(latestVersion);
        return fetch(
          `https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`,
        );
      })
      .then((res) => res.json())
      .then((data) => {
        const champList = Object.values(data.data);
        setChampions(champList);
      })
      .catch((err) => console.error("Error fetching champions:", err));

    // Check if server supports account deletion (service role key configured)
    fetch("/api/account/delete/status")
      .then(async (res) => {
        try {
          const body = await res.json();
          setDeletionEnabled(!!body.enabled);
        } catch (err) {
          setDeletionEnabled(false);
        }
      })
      .catch(() => setDeletionEnabled(false));
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const supabase = getSupabase();
    if (!supabase) {
      setError("Supabase not configured.");
      return;
    }

    setUpdating(true);
    const updatePayload: any = {};
    if (email !== user?.email) updatePayload.email = email;
    if (password) updatePayload.password = password;
    if (
      name !== user?.user_metadata?.name ||
      icon !== user?.user_metadata?.icon ||
      color !== user?.user_metadata?.color
    ) {
      updatePayload.data = { ...(user?.user_metadata || {}), name, icon };
      if (color) updatePayload.data.color = color;
    }

    try {
      const { data, error } = await supabase.auth.updateUser(updatePayload);
      if (error) {
        setError(error.message);
      } else {
        setMessage("Profile updated successfully.");
        setUser(data.user);
        setPassword("");
      }
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setUpdating(false);
    }
  };

  // helper: convert #rrggbb to 'h s% l%'
  function hexToHslString(hex: string) {
    if (!hex) return "";
    const h = hex.replace("#", "");
    const r = parseInt(h.substring(0, 2), 16) / 255;
    const g = parseInt(h.substring(2, 4), 16) / 255;
    const b = parseInt(h.substring(4, 6), 16) / 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let hDeg = 0,
      s = 0,
      l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          hDeg = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          hDeg = (b - r) / d + 2;
          break;
        case b:
          hDeg = (r - g) / d + 4;
          break;
      }
      hDeg = Math.round(hDeg * 60);
    }
    return `${hDeg} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  }

  // apply color to document root when changed
  useEffect(() => {
    if (!color) return;
    try {
      const hsl = hexToHslString(color);
      if (hsl) {
        document.documentElement.style.setProperty("--primary", hsl);
        document.documentElement.style.setProperty("--accent", hsl);
      }
      // update browser theme color meta tags (default, light, dark)
      try {
        const darkenHex = (hex: string, factor = 0.75) => {
          const h = hex.replace("#", "");
          const r = Math.max(
            0,
            Math.min(255, Math.round(parseInt(h.substring(0, 2), 16) * factor)),
          );
          const g = Math.max(
            0,
            Math.min(255, Math.round(parseInt(h.substring(2, 4), 16) * factor)),
          );
          const b = Math.max(
            0,
            Math.min(255, Math.round(parseInt(h.substring(4, 6), 16) * factor)),
          );
          return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
        };

        let metaDefault = document.querySelector(
          'meta[name="theme-color"]',
        ) as HTMLMetaElement | null;
        if (!metaDefault) {
          metaDefault = document.createElement("meta");
          metaDefault.name = "theme-color";
          document.head.appendChild(metaDefault);
        }
        metaDefault.setAttribute("content", color);

        let metaLight = document.querySelector(
          'meta[name="theme-color"][media]',
        ) as HTMLMetaElement | null;
        if (!metaLight) {
          metaLight = document.createElement("meta");
          metaLight.setAttribute("name", "theme-color");
          metaLight.setAttribute("media", "(prefers-color-scheme: light)");
          document.head.appendChild(metaLight);
        }
        metaLight.setAttribute("content", color);

        let metaDark = document.querySelector(
          'meta[name="theme-color"][media="(prefers-color-scheme: dark)"]',
        ) as HTMLMetaElement | null;
        if (!metaDark) {
          metaDark = document.createElement("meta");
          metaDark.setAttribute("name", "theme-color");
          metaDark.setAttribute("media", "(prefers-color-scheme: dark)");
          document.head.appendChild(metaDark);
        }
        metaDark.setAttribute("content", darkenHex(color, 0.75));
      } catch (err) {
        // ignore
      }
    } catch (err) {
      // ignore
    }
  }, [color]);

  // debounce persistence of color changes to avoid many updateUser calls
  const colorPersistTimerRef = useRef<number | null>(null);
  const userRef = useRef<any | null>(user);

  // keep userRef up to date without causing the color effect to re-run
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    // clear any existing timer
    if (colorPersistTimerRef.current)
      window.clearTimeout(colorPersistTimerRef.current);

    // schedule a debounced save
    // set suppression so ThemeManager doesn't reapply older remote values while we save
    try {
      if (typeof window !== "undefined") {
        (window as any).__skipThemeApplyUntil = Date.now() + 2000;
      }
    } catch (err) {}

    colorPersistTimerRef.current = window.setTimeout(async () => {
      try {
        if (typeof window !== "undefined")
          (window as any).__themeUpdateInFlight = true;
        const supabase = getSupabase();
        const currentUser = userRef.current;
        if (supabase && currentUser) {
          const { data, error } = await supabase.auth.updateUser({
            data: { ...(currentUser?.user_metadata || {}), color },
          });
          if (!error && data?.user) {
            // update local state with returned user (does not re-trigger this effect)
            setUser(data.user);
          }
        } else if (typeof window !== "undefined") {
          localStorage.setItem("rf_color", color);
        }
      } catch (err) {
        // ignore persistence errors
      } finally {
        try {
          if (typeof window !== "undefined") {
            (window as any).__themeUpdateInFlight = false;
            (window as any).__skipThemeApplyUntil = Date.now() + 200;
          }
        } catch (e) {}
        colorPersistTimerRef.current = null;
      }
    }, 700);

    return () => {
      if (colorPersistTimerRef.current) {
        window.clearTimeout(colorPersistTimerRef.current);
        colorPersistTimerRef.current = null;
      }
    };
  }, [color]);

  const handleSignOut = async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    await supabase.auth.signOut();
    window.location.href = "/"; // Redirect to home after logout
  };

  // Unlink a connected provider (e.g., discord)
  const handleUnlink = async (identity: any) => {
    setError(null);
    setMessage(null);
    const supabase = getSupabase();
    if (!supabase) {
      setError("Supabase not configured.");
      return;
    }

    try {
      const { data, error } = await supabase.auth.unlinkIdentity(identity);
      if (error) {
        setError(error.message || "Failed to unlink provider");
        return;
      }
      // refresh user
      const res = await supabase.auth.getUser();
      setUser(res.data.user);
      setMessage("Provider unlinked successfully.");
    } catch (err: any) {
      setError(err?.message || String(err));
    }
  };

  // Request account deletion via server API (server will use service role key)
  const handleDeleteAccount = async () => {
    setError(null);
    setMessage(null);
    if (
      !confirm(
        "Supprimer définitivement votre compte ? Cette action est irréversible.",
      )
    )
      return;
    try {
      const supabase = getSupabase();
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      const session = sessionData?.session;
      if (sessionError || !session) {
        setError(
          "No active session found. Please sign in again before deleting your account.",
        );
        return;
      }
      // Supabase session uses `access_token` (snake_case). Older code paths or other SDKs
      // may expose `accessToken` (camelCase). Use a safe access with an any-cast
      // to satisfy TypeScript and support both shapes.
      const accessToken =
        (session as any)?.access_token || (session as any)?.accessToken || null;
      if (!accessToken) {
        setError("No session token available. Please sign in again.");
        return;
      }
      const resp = await fetch("/api/account/delete", {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!resp.ok) {
        const body = await resp
          .json()
          .catch(() => ({ error: "Unknown error" }));
        setError(body.error || "Failed to delete account");
        return;
      }
      // on success, sign out and redirect
      await supabase?.auth.signOut();
      window.location.href = "/";
    } catch (err: any) {
      setError(err?.message || String(err));
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center py-10">No user data available.</div>;
  }

  return (
    <div className="h-full relative flex flex-col md:flex-row items-start gap-6 px-4 py-6 overflow-hidden">
      <div className="bg-card/60 text-card-foreground border border-border p-6 rounded-lg shadow-md min-w-64 w-full md:w-[60vh] h-[80vh] overflow-auto text-left modern-scrollbar">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="flex items-center gap-4 mb-6">
          <img
            src={icon || "/default-icon.svg"}
            alt="User Icon"
            className="w-16 h-16 rounded-full border border-border"
          />
          <div>
            <h2 className="text-xl font-semibold text-card-foreground">
              {user.user_metadata?.name || "Unknown Name"}
            </h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-sm border px-3 py-2 bg-muted/40 text-foreground placeholder:text-muted-foreground border-border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-sm border px-3 py-2 bg-muted/40 text-foreground placeholder:text-muted-foreground border-border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              className="mt-1 block w-full rounded-sm border px-3 py-2 bg-muted/40 text-foreground placeholder:text-muted-foreground border-border"
            />
          </div>
          {error && <div className="text-sm text-red-500">{error}</div>}
          {message && <div className="text-sm text-green-500">{message}</div>}
          <button
            type="submit"
            disabled={updating}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-sm hover:bg-primary/90 disabled:opacity-50"
          >
            {updating ? "Updating..." : "Update Profile"}
          </button>
        </form>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Connected Accounts</h3>
          <div className="flex flex-col gap-2">
            {user?.identities && user.identities.length > 0 ? (
              user.identities.map((id: any) => (
                <div
                  key={id.id || id.provider + id.provider_user_id}
                  className="flex items-center justify-between bg-muted/20 p-2 rounded-sm border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="font-mono text-sm text-muted-foreground">
                      {id.provider}
                    </div>
                    <div className="text-sm text-foreground">
                      {id.provider_user_id ?? id.identity_id}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground">
                No external providers linked.
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex gap-4 items-center">
          <button
            onClick={handleSignOut}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-sm hover:bg-destructive/90"
          >
            Logout
          </button>
          {deletionEnabled === null ? (
            <div className="text-sm text-muted-foreground">
              Checking account deletion availability…
            </div>
          ) : deletionEnabled === false ? (
            <div className="text-sm text-muted-foreground">
              Account deletion is disabled on the server. Contact the site
              administrator to remove your account.
            </div>
          ) : (
            <button
              onClick={handleDeleteAccount}
              className="px-4 py-2 bg-red-700 text-white rounded-sm hover:brightness-90"
            >
              Delete Account
            </button>
          )}
        </div>
      </div>

      {showIconPicker && (
        <div className="bg-card/60 text-card-foreground p-6 rounded-lg shadow-md w-full md:max-w-md h-[80vh] transition-all duration-300 ease-out flex flex-col overflow-auto border border-border">
          <h3 className="text-lg font-semibold mb-4">Choose Your Icon</h3>
          <div className="grid grid-cols-4 gap-4 flex-1 overflow-y-auto modern-scrollbar">
            {champions.map((champ: any) => (
              <img
                key={champ.id}
                src={`https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champ.image.full}`}
                alt={champ.name}
                className={`w-20 h-20 rounded-full cursor-pointer border-2 ${icon === `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champ.image.full}` ? "border-primary" : "border-border"} hover:border-primary transition-colors`}
                onClick={() =>
                  setIcon(
                    `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${champ.image.full}`,
                  )
                }
              />
            ))}
          </div>
        </div>
      )}

      {showColorPicker && (
        <div className="bg-card/60 text-card-foreground p-6 rounded-lg shadow-md w-full md:max-w-sm transition-all duration-300 ease-out flex flex-col gap-4 border border-border">
          <h3 className="text-lg font-semibold">Accent Color</h3>
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              aria-label="Accent color"
              className="w-12 h-10 p-0 border rounded-sm border-border"
            />
            <div className="text-sm text-muted-foreground">
              Pick a color to update the site accent.
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              "#3b82f6",
              "#0ea5e9",
              "#ef4444",
              "#fb7185",
              "#10b981",
              "#34d399",
              "#f59e0b",
              "#fb923c",
              "#8b5cf6",
              "#a78bfa",
              "#06b6d4",
              "#eab308",
            ].map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{ background: c }}
                className={`w-8 h-8 rounded-sm border-2 ${color.toLowerCase() === c.toLowerCase() ? "ring-2 ring-offset-1 ring-primary" : "border-border"}`}
                aria-label={`preset ${c}`}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-sm"
              style={{
                background: color,
                border: "1px solid rgba(0,0,0,0.12)",
              }}
              aria-hidden
            />
            <div className="text-sm text-muted-foreground">
              Current: <span className="font-mono">{color}</span>
            </div>
          </div>
          <div className="mt-2">
            <button
              onClick={() => setShowColorPicker(false)}
              className="px-3 py-2 bg-muted/40 text-foreground rounded-sm border border-border"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
