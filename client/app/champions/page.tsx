/// <reference types="react" />
import React from "react";
import ChampionCard from "../../components/ChampionCard";

// Load champions from the local JSON file (public/data/champions.json).
// The champions index uses a static API; remove Supabase usage entirely.
async function fetchChampions(query?: string) {
  try {
    const local = await import("../../public/data/champions.json");
    const rows: any[] = Array.isArray(local?.default ? local.default : local)
      ? (local?.default ?? local)
      : [];

    const normalized = rows.map((r: any) => {
      const f: any = r;
      const payload = f.data ? f.data : f;
      return {
        ...payload,
        id: f.id ?? payload.id,
        name: f.name ?? payload.name,
      };
    });

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      return normalized.filter((c) => (c.name || "").toString().toLowerCase().includes(q));
    }
    return normalized;
  } catch (err) {
    console.error("Failed to load champions JSON:", err);
    return [];
  }
}

export default async function ChampionsPage({
  searchParams,
}: {
  searchParams?: { q?: string } | Promise<{ q?: string } | undefined>;
}) {
  const params = await (searchParams as any);
  const q = params?.q ?? undefined;
  const champions = await fetchChampions(q);

  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Champions Index</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {champions.map((c: any) => (
          <ChampionCard key={c.id} champion={c} />
        ))}
      </div>
    </main>
  );
}
