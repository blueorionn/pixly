import { createSerwistRoute } from '@serwist/turbopack'

const revision = process.env.VERCEL_GIT_COMMIT_SHA ?? 'dev'

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } =
  createSerwistRoute({
    additionalPrecacheEntries: [{ url: '/~offline', revision }],
    swSrc: 'app/sw.ts',
    // nextConfig,
    // If set to `false`, Serwist will attempt to use `esbuild-wasm`.
    useNativeEsbuild: true,
  })
