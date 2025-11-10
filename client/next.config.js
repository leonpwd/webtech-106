const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Set the tracing root to the repo root so Next can correctly infer output tracing
  // when there are multiple lockfiles (silences the workspace-root warning on Vercel).
  outputFileTracingRoot: path.resolve(__dirname, '..'),
  webpack: (config) => {
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname),
    }
    return config
  },
}

module.exports = nextConfig
