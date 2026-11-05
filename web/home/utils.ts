import { ClientFeedPhoto } from './PhotoFeed'

/**
 * Greedy shortest-column placement, using each photo's aspect ratio as a
 * height proxy (every column has the same width, so aspect ~ rendered height).
 *
 * The algorithm is prefix-stable: an item's column depends only on the items
 * before it. Appending a new page therefore never moves existing photos —
 * new items only extend the bottom of the shortest column. A full reflow
 * happens only when the column count changes (breakpoint crossing), which is
 * expected. This is why we don't use CSS columns: the browser rebalances the
 * whole container on every insertion and reshuffles everything above the
 * fold.
 */
export function distribute(
  photos: ClientFeedPhoto[] | null,
  count: number
): ClientFeedPhoto[][] {
  const columns: ClientFeedPhoto[][] = Array.from({ length: count }, () => [])
  if (!photos) return columns

  const heights = new Array<number>(count).fill(0)

  for (const photo of photos) {
    let shortest = 0
    for (let i = 1; i < count; i++) {
      if (heights[i] < heights[shortest]) shortest = i
    }
    columns[shortest].push(photo)
    heights[shortest] += photo.height / photo.width
  }

  return columns
}
