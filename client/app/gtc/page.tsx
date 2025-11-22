"use client";
import React, { useEffect, useMemo, useState } from "react";
import { championImageUrl } from "../../lib/ddragon";

// Simple client-side GtC (Guess the Champ) page
import championsData from "../../public/data/champions.json";
import championsMeta from "../../public/data/champions_meta.json";

function normalizeName(s: string) {
  return s.toLowerCase();
}

export default function GtC() {
  const champions = useMemo(
    () =>
      Array.isArray(championsData)
        ? championsData
        : (championsData as any).default,
    [],
  );
  const [target] = useState(
    () => champions[Math.floor(Math.random() * champions.length)],
  );
  const [query, setQuery] = useState("");
  const [candidates, setCandidates] = useState<any[]>([]);
  const [picked, setPicked] = useState<any | null>(null);
  const [won, setWon] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const metaIndex = useMemo(() => {
    const m = Array.isArray(championsMeta)
      ? championsMeta
      : (championsMeta as any).default;
    const map = new Map<string, any>();
    for (const item of m) map.set(item.id, item);
    return map;
  }, []);

  useEffect(() => {
    if (!query) return setCandidates([]);
    const q = normalizeName(query);
    // Exclude champions that have already been guessed in this session
    const guessedIds = new Set(history.map((h) => h.guess?.id).filter(Boolean));
    const matches = champions
      .filter(
        (c: any) =>
          normalizeName(c.name).startsWith(q) && !guessedIds.has(c.id),
      )
      .slice(0, 10);
    setCandidates(matches);
  }, [query, champions, history]);

  function onSelect(c: any) {
    setQuery("");
    setCandidates([]);
    submitGuess(c);
  }

  function submitGuess(c: any) {
    setPicked(c);
    const isWin = normalizeName(c.name) === normalizeName(target.name);
    setWon(isWin);
    setHistory((h) => [{ guess: c, correct: isWin, time: Date.now() }, ...h]);
    if (isWin) {
      // confetti: simple DOM-based confetti using emojis
      const root = document.getElementById("confetti");
      if (root) {
        for (let i = 0; i < 60; i++) {
          const span = document.createElement("span");
          span.textContent = "🎉";
          span.style.position = "absolute";
          span.style.left = Math.random() * 80 + "%";
          span.style.top = "-10px";
          span.style.fontSize = 12 + Math.random() * 28 + "px";
          span.style.opacity = "0.9";
          root.appendChild(span);
          setTimeout(() => root.removeChild(span), 2500);
        }
      }
    }
  }

  function compareStat(stat: string) {
    if (!picked) return "";
    const a = (picked.stats && picked.stats[stat]) || 0;
    const b = (target.stats && target.stats[stat]) || 0;
    if (a === b) return "—";
    return a > b ? "higher" : "lower";
  }

  return (
    <div className="p-6 container mx-auto relative">
      <div
        id="confetti"
        className="pointer-events-none absolute inset-0 z-50"
      ></div>
      <h1 className="text-3xl font-bold mb-4">Guess The Champ</h1>
      <p className="mb-4 text-sm opacity-80">
        Type a champion name and try to guess the hidden champion.
      </p>

      <div className="mb-4">
        <input
          className="w-full p-3 rounded bg-neutral-800/40 disabled:opacity-60 disabled:cursor-not-allowed"
          placeholder="Type champion name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {candidates.length > 0 && (
          <div className="mt-2 bg-neutral-800/50 rounded max-h-60 overflow-auto border border-neutral-700">
            {candidates.map((c) => (
              <div
                key={c.id}
                className="p-2 flex items-center gap-3 hover:bg-neutral-800/30 cursor-pointer"
                onClick={() => onSelect(c)}
              >
                <img
                  src={championImageUrl(c.image?.full ?? c.image, c.version)}
                  width={32}
                  height={32}
                  alt=""
                  className="rounded"
                />
                <div>{c.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-4 flex items-center gap-3">
        <button
          className="px-4 py-2 bg-yellow-400 rounded text-black font-semibold"
          onClick={() => (picked ? submitGuess(picked) : null)}
        >
          Guess
        </button>
        <button
          className="px-3 py-1 border rounded text-sm"
          onClick={() => {
            setQuery("");
            setCandidates([]);
            setPicked(null);
            setWon(false);
          }}
        >
          Reset
        </button>
      </div>

      {picked && (
        <div className="bg-neutral-900/60 p-4 rounded">
          <div className="flex items-center gap-4">
            <img
              src={championImageUrl(
                picked.image?.full ?? picked.image,
                picked.version,
              )}
              width={64}
              height={64}
              className="rounded"
              alt=""
            />
            <div>
              <div className="text-xl font-semibold">{picked.name}</div>
              <div className="text-sm opacity-80">{picked.title}</div>
            </div>
            <div className="ml-auto text-sm font-semibold">
              Result: {won ? "Correct 🎉" : "Try again"}
            </div>
          </div>

          {/* Attribute match indicators based on champions_meta.json */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Attribute hints</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                "genre",
                "species",
                "role",
                "resource",
                "range_type",
                "region",
                "release_year",
              ].map((attr) => {
                const pMeta = metaIndex.get(picked.id);
                const tMeta = metaIndex.get(target.id);
                let pVal: any = pMeta ? (pMeta[attr] ?? "blank") : "blank";
                let tVal: any = tMeta ? (tMeta[attr] ?? "blank") : "blank";

                // Normalize values to strings
                const pStr =
                  typeof pVal === "number" ? String(pVal) : pVal || "blank";
                const tStr =
                  typeof tVal === "number" ? String(tVal) : tVal || "blank";

                // Helper to split multi-valued fields (comma-separated)
                const tokens = (s: string) =>
                  s === "blank"
                    ? []
                    : s.split(",").map((x) => x.trim().toLowerCase());

                let state: "blank" | "exact" | "partial" | "none" = "none";
                if (pStr === "blank" || tStr === "blank") state = "blank";
                else if (attr === "release_year") {
                  // compare years
                  if (pStr === tStr) state = "exact";
                  else state = "none";
                } else {
                  if (pStr.toLowerCase() === tStr.toLowerCase())
                    state = "exact";
                  else {
                    const a = tokens(pStr);
                    const b = tokens(tStr);
                    const inter = a.filter((x) => b.includes(x));
                    if (inter.length > 0) state = "partial";
                    else state = "none";
                  }
                }

                const dotClass =
                  state === "blank"
                    ? "bg-gray-500"
                    : state === "exact"
                      ? "bg-green-500"
                      : state === "partial"
                        ? "bg-yellow-400"
                        : "bg-red-500";

                // For release_year, compute arrow (▲ younger / ▼ older) comparing target (searched) vs picked
                let yearIndicator = null;
                if (
                  attr === "release_year" &&
                  pStr !== "blank" &&
                  tStr !== "blank"
                ) {
                  const pYear = parseInt(pStr, 10);
                  const tYear = parseInt(tStr, 10);
                  if (!isNaN(pYear) && !isNaN(tYear)) {
                    if (tYear > pYear)
                      yearIndicator = (
                        <span className="ml-2 text-yellow-300">▲</span>
                      );
                    else if (tYear < pYear)
                      yearIndicator = (
                        <span className="ml-2 text-yellow-300">▼</span>
                      );
                  }
                }

                return (
                  <div
                    key={attr}
                    className="p-2 bg-neutral-800/40 rounded flex items-center gap-3"
                  >
                    <div className={`w-3 h-3 rounded-full ${dotClass}`} />
                    <div className="text-sm truncate">
                      <strong className="capitalize">
                        {attr.replace("_", " ")}
                      </strong>
                      : <span className="opacity-80">{pStr}</span>
                      {yearIndicator}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats grid removed per user request: no numeric stats displayed under attribute hints */}
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-2">Previous guesses</h4>
          <div className="space-y-2">
            {history.map((h, idx) => {
              const attrs = [
                "genre",
                "species",
                "role",
                "resource",
                "range_type",
                "region",
                "release_year",
              ];
              return (
                <div key={idx} className="p-2 bg-neutral-800/40 rounded">
                  <div className="flex items-center gap-3">
                    <img
                      src={championImageUrl(
                        h.guess.image?.full ?? h.guess.image,
                        h.guess.version,
                      )}
                      width={40}
                      height={40}
                      className="rounded"
                      alt=""
                    />
                    <div className="flex-1">
                      <div className="font-semibold">{h.guess.name}</div>
                      <div className="text-xs opacity-70">
                        {h.correct ? "Correct" : "Incorrect"}
                      </div>
                    </div>
                    <div className="text-xs opacity-60">
                      {new Date(h.time).toLocaleTimeString()}
                    </div>
                  </div>

                  {/* Attribute hints for this historic guess */}
                  <div className="mt-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {attrs.map((attr) => {
                        const pMeta = metaIndex.get(h.guess.id);
                        const tMeta = metaIndex.get(target.id);
                        let pVal: any = pMeta
                          ? (pMeta[attr] ?? "blank")
                          : "blank";
                        let tVal: any = tMeta
                          ? (tMeta[attr] ?? "blank")
                          : "blank";

                        const pStr =
                          typeof pVal === "number"
                            ? String(pVal)
                            : pVal || "blank";
                        const tStr =
                          typeof tVal === "number"
                            ? String(tVal)
                            : tVal || "blank";

                        const tokens = (s: string) =>
                          s === "blank"
                            ? []
                            : s.split(",").map((x) => x.trim().toLowerCase());

                        let state: "blank" | "exact" | "partial" | "none" =
                          "none";
                        if (pStr === "blank" || tStr === "blank")
                          state = "blank";
                        else if (attr === "release_year") {
                          if (pStr === tStr) state = "exact";
                          else state = "none";
                        } else {
                          if (pStr.toLowerCase() === tStr.toLowerCase())
                            state = "exact";
                          else {
                            const a = tokens(pStr);
                            const b = tokens(tStr);
                            const inter = a.filter((x) => b.includes(x));
                            if (inter.length > 0) state = "partial";
                            else state = "none";
                          }
                        }

                        const dotClass =
                          state === "blank"
                            ? "bg-gray-500"
                            : state === "exact"
                              ? "bg-green-500"
                              : state === "partial"
                                ? "bg-yellow-400"
                                : "bg-red-500";

                        let yearIndicator = null;
                        if (
                          attr === "release_year" &&
                          pStr !== "blank" &&
                          tStr !== "blank"
                        ) {
                          const pYear = parseInt(pStr, 10);
                          const tYear = parseInt(tStr, 10);
                          if (!isNaN(pYear) && !isNaN(tYear)) {
                            if (tYear > pYear)
                              yearIndicator = (
                                <span className="ml-2 text-yellow-300">▲</span>
                              );
                            else if (tYear < pYear)
                              yearIndicator = (
                                <span className="ml-2 text-yellow-300">▼</span>
                              );
                          }
                        }

                        return (
                          <div
                            key={attr}
                            className="p-2 bg-neutral-800/30 rounded flex items-center gap-3"
                          >
                            <div
                              className={`w-3 h-3 rounded-full ${dotClass}`}
                            />
                            <div className="text-sm truncate">
                              <strong className="capitalize">
                                {attr.replace("_", " ")}
                              </strong>
                              : <span className="opacity-80">{pStr}</span>
                              {yearIndicator}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-6 text-sm opacity-70">
        (This mini-game is local-only and uses the offline champions data.)
      </div>
    </div>
  );
}
