/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Necesario para Firebase Hosting con SSR
  images: {
    domains: ['localhost', 'supabase.co', 'firebasestorage.googleapis.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.firebasestorage.googleapis.com',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Optimizaciones de rendimiento
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
}

module.exports = nextConfig

