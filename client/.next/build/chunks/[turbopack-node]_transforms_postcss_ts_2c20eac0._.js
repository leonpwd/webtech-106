module.exports = [
"[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/client/postcss.config.cjs [postcss] (ecmascript)\" } [postcss] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "build/chunks/1e749_d36c037a._.js",
  "build/chunks/[root-of-the-server]__b1532290._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[turbopack-node]/transforms/postcss.ts { CONFIG => \"[project]/client/postcss.config.cjs [postcss] (ecmascript)\" } [postcss] (ecmascript)");
    });
});
}),
];