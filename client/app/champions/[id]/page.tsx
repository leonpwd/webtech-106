import React from "react";
import { championImageUrl, DDRAGON_PUBLIC_VERSION } from "../../../lib/ddragon";
import ChampionAbilities from "../../../components/ChampionAbilities";
import ChampionStats from "../../../components/ChampionStats";

// fetch champion by id - use local public data JSON as fallback
async function fetchChampionById(id: string) {
  try {
    const local = await import("../../../public/data/champions.json");
    const rows = Array.isArray(local?.default ? local.default : local)
      ? (local?.default ?? local)
      : [];
    const needle = (id || "").toString().toLowerCase().trim();
    const found = rows.find((r: any) => {
      const f: any = r.data ? r.data : r;
      const rid = (r.id ?? "").toString().toLowerCase();
      const rname = (f.name ?? "").toString().toLowerCase();
      const rkey = (f.key ?? "").toString().toLowerCase();
      return rid === needle || rname === needle || rkey === needle;
    });
    if (found) {
      // support both Supabase row format (with .data) and raw ddragon objects
      const f: any = found;
      const payload = f.data ? f.data : f;
      return {
        ...payload,
        id: f.id ?? payload.id,
        name: f.name ?? payload.name,
      };
    }
  } catch (e) {
    /* ignore */
  }
  // not found - return null
  return null;
}

export default async function ChampionPage(props: any) {
  // Next may provide `props`/`params` as thenable proxies — await before accessing
  const { params } = await props;
  const { id } = await params;
  const champ = await fetchChampionById(id);
  if (!champ) {
    return (
      <main className="p-6 container mx-auto">
        <h1 className="text-2xl font-bold">Champion not found</h1>
        <p>No champion with id "{id}" was found.</p>
      </main>
    );
  }

  // build splash art URL using champion name (DDDragon public splash path)
  const splashUrl =
    champ && champ.name
      ? `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${encodeURIComponent(champ.name)}_0.jpg`
      : "";

  // load generated champion meta (genre, species, region, etc.)
  let champMeta: any = null;
  try {
    const localMeta = await import("../../../public/data/champions_meta.json");
    const list = Array.isArray(
      localMeta?.default ? localMeta.default : localMeta,
    )
      ? (localMeta?.default ?? localMeta)
      : [];
    champMeta = list.find((m: any) => m.id === champ.id) || null;
  } catch (e) {
    champMeta = null;
  }

  // fetch full champion data (spells / passive) from DDragon
  let champFull: any = null;
  try {
    const version = champ.version || DDRAGON_PUBLIC_VERSION;
    const res = await fetch(
      `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion/${encodeURIComponent(champ.id)}.json`,
    );
    if (res.ok) {
      const j = await res.json();
      champFull = j.data && j.data[champ.id] ? j.data[champ.id] : null;
    }
  } catch (e) {
    champFull = null;
  }

  return (
    <main
      className="min-h-screen relative bg-background text-foreground dark:bg-black dark:text-white"
      style={{
        backgroundImage: splashUrl ? `url(${splashUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* brighten backdrop slightly in light mode, darken in dark mode for readability */}
      <div className="min-h-screen p-8 backdrop-brightness-105 dark:backdrop-brightness-50">
        <div className="max-w-3xl mx-auto bg-card/60 text-card-foreground p-6 rounded">
          <h1 className="text-4xl font-bold mb-2">{champ.name}</h1>
          <p className="mb-4 text-lg text-neutral-300">{champ.title || ""}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold">Role</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {(champ.tags || []).map((t: string) => (
                  <div
                    key={t}
                    className="px-3 py-1 bg-blue-900/60 rounded text-sm font-semibold"
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Stats</h3>
              {/* Client component renders interactive stats with level slider */}
              {/* @ts-ignore server -> client import allowed by Next */}
              <ChampionStats
                stats={champ.stats || {}}
                info={champ.info || {}}
              />
            </div>
          </div>

          {champFull && (
            <div className="mt-6">
              <h3 className="text-2xl font-semibold mb-4">Abilities</h3>
              <ChampionAbilities
                passive={champFull.passive}
                spells={champFull.spells}
                version={
                  champFull.version || champ.version || DDRAGON_PUBLIC_VERSION
                }
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
