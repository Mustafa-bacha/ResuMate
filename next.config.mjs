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
}

export default nextConfig
