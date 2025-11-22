"use client";
import React, { useState } from "react";

export default function ChampionAbilities({
  passive,
  spells,
  version,
}: {
  passive: any;
  spells: any[];
  version: string;
}) {
  const [selected, setSelected] = useState<any>(
    passive || (spells && spells[0]) || null,
  );

  const spellIcon = (img: string, kind: "passive" | "spell") => {
    if (!img) return "";
    if (kind === "passive")
      return `https://ddragon.leagueoflegends.com/cdn/${version}/img/passive/${img}`;
    return `https://ddragon.leagueoflegends.com/cdn/${version}/img/spell/${img}`;
  };

  const getAbilityKey = (index: number) => {
    if (index === -1) return "P";
    return ["Q", "W", "E", "R"][index] || "";
  };

  const parseDescription = (text: string) => {
    // Remove HTML tags and decode basic entities
    return text
      .replace(/<[^>]*>/g, "")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&");
  };

  const cleanupScalingLabel = (label: string) => {
    // Clean up template variable names to be more readable
    return label
      .replace(/@AbilityResourceName@/g, "Resource")
      .replace(/Cost.*Cost/g, "Cost")
      .replace(/Damage/g, "Damage")
      .replace(/basedamage/gi, "Damage")
      .replace(/movementspeed/gi, "Move Speed")
      .replace(/baseduration/gi, "Duration")
      .replace(/cooldown/gi, "Cooldown")
      .trim();
  };

  const cleanupScalingEffect = (effect: string) => {
    // Clean up template placeholders and extract actual values
    const cleaned = effect
      .replace(/{{ [^}]+ }}/g, "")
      .replace(/{{ [^}]+NL }}/g, "")
      .replace(/\s*->\s*/g, " → ")
      .trim();
    return cleaned === "" ? "—" : cleaned;
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {passive && (
          <button
            onClick={() => setSelected(passive)}
            className={`relative p-3 rounded border-2 transition flex flex-col items-center gap-2 ${selected === passive ? "border-blue-500 bg-blue-900/40" : "border-neutral-600 bg-neutral-800/80 hover:border-neutral-500"}`}
            title={passive.name}
          >
            <div className="relative">
              <img
                src={spellIcon(passive.image?.full, "passive")}
                alt={passive.name}
                width={56}
                height={56}
                className="rounded"
              />
              <div className="absolute -top-2 -right-2 bg-purple-600 rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold text-white border border-purple-500">
                P
              </div>
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold leading-tight">
                {passive.name}
              </p>
            </div>
          </button>
        )}
        {spells &&
          spells.map((s: any, i: number) => (
            <button
              key={i}
              onClick={() => setSelected(s)}
              className={`relative p-3 rounded border-2 transition flex flex-col items-center gap-2 ${selected === s ? "border-blue-500 bg-blue-900/40" : "border-neutral-600 bg-neutral-800/80 hover:border-neutral-500"}`}
              title={s.name}
            >
              <div className="relative">
                <img
                  src={spellIcon(s.image?.full, "spell")}
                  alt={s.name}
                  width={56}
                  height={56}
                  className="rounded"
                />
                <div className="absolute -top-2 -right-2 bg-blue-600 rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold text-white border border-blue-500">
                  {getAbilityKey(i)}
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold leading-tight">{s.name}</p>
              </div>
            </button>
          ))}
      </div>

      {selected && (
        <div className="bg-neutral-900/80 p-6 rounded border border-neutral-700">
          <div className="flex items-start gap-4 mb-4">
            <img
              src={spellIcon(
                selected.image?.full,
                selected === passive ? "passive" : "spell",
              )}
              alt={selected.name}
              width={72}
              height={72}
              className="rounded"
            />
            <div className="flex-1">
              <h4 className="text-2xl font-bold">{selected.name}</h4>
              {selected.costType && (
                <p className="text-sm text-neutral-400 mb-2">
                  {selected.costType}
                </p>
              )}
              <p className="text-sm text-neutral-300 leading-relaxed">
                {parseDescription(
                  selected.description ||
                    selected.tooltip ||
                    selected.sanitizedDescription ||
                    "",
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-neutral-700">
            {selected.cooldown && (
              <div>
                <p className="text-xs text-neutral-400 uppercase tracking-wide">
                  Cooldown
                </p>
                <p className="text-sm font-semibold">
                  {Array.isArray(selected.cooldown)
                    ? selected.cooldown.join(" / ")
                    : selected.cooldown}
                  s
                </p>
              </div>
            )}
            {selected.cost &&
              selected.costBurn &&
              selected.costBurn !== "0" && (
                <div>
                  <p className="text-xs text-neutral-400 uppercase tracking-wide">
                    Cost
                  </p>
                  <p className="text-sm font-semibold">{selected.costBurn}</p>
                </div>
              )}
            {selected.range && (
              <div>
                <p className="text-xs text-neutral-400 uppercase tracking-wide">
                  Range
                </p>
                <p className="text-sm font-semibold">
                  {Array.isArray(selected.range)
                    ? selected.range[0]
                    : selected.range}
                </p>
              </div>
            )}
            {selected.maxrank && (
              <div>
                <p className="text-xs text-neutral-400 uppercase tracking-wide">
                  Max Rank
                </p>
                <p className="text-sm font-semibold">{selected.maxrank}</p>
              </div>
            )}
          </div>

          {/* Show level tips if available */}
          {selected.leveltip && selected.leveltip.label && (
            <div className="mt-4 pt-4 border-t border-neutral-700">
              <p className="text-xs text-neutral-400 uppercase tracking-wide mb-3">
                Scaling per Level
              </p>
              <div className="space-y-2">
                {selected.leveltip.label.map((label: string, idx: number) => {
                  const cleanedLabel = cleanupScalingLabel(label);
                  const cleanedEffect = cleanupScalingEffect(
                    selected.leveltip.effect[idx],
                  );
                  if (!cleanedLabel) return null;
                  return (
                    <div key={idx} className="text-sm flex items-center gap-2">
                      <span className="text-neutral-400 flex-shrink-0 min-w-max">
                        {cleanedLabel}:
                      </span>
                      <span className="text-blue-400 font-semibold">
                        {cleanedEffect}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
