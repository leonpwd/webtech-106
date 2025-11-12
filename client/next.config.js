const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // NOTE: Next 16 removed support for configuring ESLint via next.config.js.
  // If you want to ignore ESLint during builds, configure your CI or install
  // `eslint` and `eslint-config-next` in the project. The inline option was
  // removed to keep compatibility with Next.js's new config format.
  // Set the tracing root to the repo root so Next can correctly infer output tracing
  // when there are multiple lockfiles (silences the workspace-root warning on Vercel).
  outputFileTracingRoot: path.resolve(__dirname, '..'),
  // We avoid custom webpack configuration so Turbopack (the default dev server
  // when using `--turbopack`) doesn't warn. Path aliases are provided via
  // `tsconfig.json`/`jsconfig.json` (see `compilerOptions.paths`) so a webpack
  // alias is unnecessary.
}

module.exports = nextConfig
