export const DDRAGON_PUBLIC_VERSION =
  process.env.NEXT_PUBLIC_DDRAGON_VERSION || "14.10.1";

export function championImageUrl(filename: string, version?: string) {
  const v = version || DDRAGON_PUBLIC_VERSION;
  return `https://ddragon.leagueoflegends.com/cdn/${v}/img/champion/${filename}`;
}

export function normalizeDDragon(json: any) {
  // Accept either already-array or DDRagon object with .data
  if (!json) return [];
  if (Array.isArray(json)) return json;
  if (json.data && typeof json.data === "object") {
    return Object.keys(json.data).map((k) => json.data[k]);
  }
  // fallback if structure differs
  return Object.values(json);
}
