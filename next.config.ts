import type { NextConfig } from 'next'

const cdn = new URL(process.env.CDN_HOST ?? 'http://localhost')
const prefix = (process.env.CDN_PHOTO_PERFFIX ?? '').replace(/^\/+|\/+$/g, '')

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: cdn.protocol.replace(':', '') as 'http' | 'https',
        hostname: cdn.hostname,
        port: cdn.port || undefined,
        pathname: prefix ? `/${prefix}/**` : '/**',
      },
    ],
  },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
}

export default nextConfig
