/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Prevent pdf-parse (and other Node-only modules) from being bundled by Turbopack/webpack
  serverExternalPackages: ['pdf-parse'],
  // Ensure the scripts directory is included in the serverless deployment
  outputFileTracingIncludes: {
    '/api/**/*': ['./scripts/**/*'],
  },
}

export default nextConfig
