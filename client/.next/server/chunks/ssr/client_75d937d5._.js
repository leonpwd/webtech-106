module.exports = [
"[project]/client/lib/supabaseClient.ts [app-rsc] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/1e749_@supabase_node-fetch_lib_index_6b4a1a92.js",
  "server/chunks/ssr/1e749_5f682075._.js",
  "server/chunks/ssr/[root-of-the-server]__3c5194f5._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/client/lib/supabaseClient.ts [app-rsc] (ecmascript)");
    });
});
}),
"[project]/client/public/data/champions.json (json, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/client_public_data_champions_json_adf72371._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/client/public/data/champions.json (json)");
    });
});
}),
];