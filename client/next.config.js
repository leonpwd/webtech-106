const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Avoid failing the production build due to missing ESLint packages in some environments.
  // If you prefer to keep linting during build, install `eslint` and `eslint-config-next`.
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Set the tracing root to the repo root so Next can correctly infer output tracing
  // when there are multiple lockfiles (silences the workspace-root warning on Vercel).
  outputFileTracingRoot: path.resolve(__dirname, '..'),
  // We avoid custom webpack configuration so Turbopack (the default dev server
  // when using `--turbopack`) doesn't warn. Path aliases are provided via
  // `tsconfig.json`/`jsconfig.json` (see `compilerOptions.paths`) so a webpack
  // alias is unnecessary.
}

module.exports = nextConfig
