module.exports = [
"[project]/client/.next-internal/server/app/champions/page/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[project]/client/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/client/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/client/lib/ddragon.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DDRAGON_PUBLIC_VERSION",
    ()=>DDRAGON_PUBLIC_VERSION,
    "championImageUrl",
    ()=>championImageUrl,
    "normalizeDDragon",
    ()=>normalizeDDragon
]);
const DDRAGON_PUBLIC_VERSION = process.env.NEXT_PUBLIC_DDRAGON_VERSION || '14.10.1';
function championImageUrl(filename, version) {
    const v = version || DDRAGON_PUBLIC_VERSION;
    return `https://ddragon.leagueoflegends.com/cdn/${v}/img/champion/${filename}`;
}
function normalizeDDragon(json) {
    // Accept either already-array or DDRagon object with .data
    if (!json) return [];
    if (Array.isArray(json)) return json;
    if (json.data && typeof json.data === 'object') {
        return Object.keys(json.data).map((k)=>json.data[k]);
    }
    // fallback if structure differs
    return Object.values(json);
}
}),
"[project]/client/components/ChampionCard.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChampionCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/dist/client/app-dir/link.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$lib$2f$ddragon$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/lib/ddragon.ts [app-rsc] (ecmascript)");
;
;
;
function ChampionCard({ champion }) {
    const imgFile = champion.image && (champion.image.full || champion.image) || '';
    const imageUrl = imgFile ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$lib$2f$ddragon$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["championImageUrl"])(imgFile, champion.version || undefined) : '/placeholder-champion.png';
    const primaryTag = champion.tags && champion.tags[0] || champion.role || '';
    // best-effort lane mapping: per-champion overrides + tag->lane fallback
    const LANE_OVERRIDES = {
        Akali: 'Mid',
        Fiora: 'Top',
        Evelynn: 'Jungle',
        MissFortune: 'ADC',
        Sona: 'Support',
        'LeeSin': 'Jungle'
    };
    const TAG_TO_LANE = {
        Assassin: 'Mid',
        Mage: 'Mid',
        Marksman: 'ADC',
        Support: 'Support',
        Fighter: 'Top',
        Tank: 'Top'
    };
    const lane = LANE_OVERRIDES[champion.id] || TAG_TO_LANE[primaryTag] || '—';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
        href: `/champions/${encodeURIComponent(champion.id)}`,
        className: "block p-4 border border-neutral-800 rounded-md hover:shadow-lg bg-neutral-800/40",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center gap-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                    src: imageUrl,
                    alt: champion.name,
                    width: 64,
                    height: 64,
                    className: "rounded"
                }, void 0, false, {
                    fileName: "[project]/client/components/ChampionCard.tsx",
                    lineNumber: 30,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-lg font-semibold",
                                children: champion.name
                            }, void 0, false, {
                                fileName: "[project]/client/components/ChampionCard.tsx",
                                lineNumber: 33,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/client/components/ChampionCard.tsx",
                            lineNumber: 32,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-2 flex flex-wrap gap-2",
                            children: (champion.tags || []).map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs bg-neutral-800/60 px-2 py-1 rounded-full",
                                    children: t
                                }, t, false, {
                                    fileName: "[project]/client/components/ChampionCard.tsx",
                                    lineNumber: 37,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/client/components/ChampionCard.tsx",
                            lineNumber: 35,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/client/components/ChampionCard.tsx",
                    lineNumber: 31,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/client/components/ChampionCard.tsx",
            lineNumber: 29,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/client/components/ChampionCard.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
}),
"[project]/client/app/champions/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference types="react" />
__turbopack_context__.s([
    "default",
    ()=>ChampionsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$components$2f$ChampionCard$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/components/ChampionCard.tsx [app-rsc] (ecmascript)");
;
;
// Lazy-load Supabase client and require it to be configured (no local JSON fallback)
async function fetchChampions() {
    // Dynamically import the Supabase helper so we don't cause module-evaluation errors
    let getSupabase = null;
    try {
        // Dynamically import the local client wrapper so dependencies resolve from
        // `client/node_modules` during the build.
        // @ts-ignore - the dynamically-imported module may not have exact TS types here
        const mod = await __turbopack_context__.A("[project]/client/lib/supabaseClient.ts [app-rsc] (ecmascript, async loader)");
        getSupabase = mod.default ?? mod;
    } catch (e) {
        getSupabase = null;
    }
    const supabase = typeof getSupabase === 'function' ? getSupabase() : null;
    if (!supabase) {
        // Fallback to local JSON file when Supabase env vars are not present. This
        // makes builds possible without requiring secrets in the environment.
        try {
            // Import the JSON statically from the app's public data folder.
            // Path: client/app/champions/page.tsx -> ../../public/data/champions.json
            const local = await __turbopack_context__.A("[project]/client/public/data/champions.json (json, async loader)");
            const rows = Array.isArray(local?.default ? local.default : local) ? local?.default ?? local : [];
            // rows may be raw ddragon champion objects or Supabase rows with .data
            return rows.map((r)=>{
                const f = r;
                const payload = f.data ? f.data : f;
                return {
                    ...payload,
                    id: f.id ?? payload.id,
                    name: f.name ?? payload.name
                };
            });
        } catch (err) {
            throw new Error('Supabase is not configured and local champions JSON could not be loaded');
        }
    }
    const { data, error } = await supabase.from('champions').select('id, name, data').order('name', {
        ascending: true
    });
    if (error) {
        console.error('Supabase fetch error:', error);
        throw new Error('Failed to load champions from Supabase');
    }
    const rows = Array.isArray(data) ? data : [];
    return rows.map((r)=>({
            ...r.data || {},
            id: r.id,
            name: r.name || r.data && r.data.name
        }));
}
async function ChampionsPage() {
    const champions = await fetchChampions();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "p-6 container mx-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-3xl font-bold mb-6",
                children: "Champions Index"
            }, void 0, false, {
                fileName: "[project]/client/app/champions/page.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
                children: champions.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$components$2f$ChampionCard$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                        champion: c
                    }, c.id, false, {
                        fileName: "[project]/client/app/champions/page.tsx",
                        lineNumber: 59,
                        columnNumber: 34
                    }, this))
            }, void 0, false, {
                fileName: "[project]/client/app/champions/page.tsx",
                lineNumber: 58,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/client/app/champions/page.tsx",
        lineNumber: 56,
        columnNumber: 5
    }, this);
}
}),
"[project]/client/app/champions/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/client/app/champions/page.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b484216b._.js.map