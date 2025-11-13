module.exports = [
"[project]/client/public/data/champions_meta.json (json, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/client_public_data_champions_meta_json_76ee8fe7._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/client/public/data/champions_meta.json (json)");
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