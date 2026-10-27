/**
 * Validates a post-login redirect target (the ?next= param).
 *
 * Only same-site relative paths are allowed — this is the open-redirect
 * guard. Rejects:
 *  - anything not starting with "/" (external URLs, 'javascript:', etc.)
 *  - "//evil.com" (protocol-relative → external)
 *  - "/\evil.com" (backslash that browsers normalize to "//")
 *
 * Returns the value if safe, otherwise null.
 */
export function safeRedirectPath(
  value: string | null | undefined
): string | null {
  if (!value) return null
  if (!value.startsWith('/')) return null
  if (value.startsWith('//') || value.startsWith('/\\')) return null
  return value
}
