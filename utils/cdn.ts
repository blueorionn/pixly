export type CdnUrlOptions = {
  host?: string
  prefix?: string
}

function trimTrailingSlashes(value: string): string {
  return value.replace(/\/+$/, '')
}

function trimSlashes(value: string): string {
  return value.replace(/^\/+|\/+$/g, '')
}

export function cdnUrl(
  storageKey: string,
  options: CdnUrlOptions = {}
): string {
  if (/^https?:\/\//i.test(storageKey)) return storageKey

  const host = trimTrailingSlashes(options.host ?? process.env.CDN_HOST ?? '')
  const prefix = trimSlashes(
    options.prefix ??
      process.env.CDN_PHOTO_PREFIX ??
      process.env.CDN_PHOTO_PERFFIX ??
      ''
  )
  const key = storageKey.replace(/^\/+/, '')
  const path = prefix ? `${prefix}/${key}` : key

  return host ? `${host}/${path}` : `/${path}`
}
