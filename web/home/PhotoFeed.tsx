'use client'

import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Spinner } from '@/components/Spinner'
import { MAX_PER_PAGE_LIMIT, type FeedPhoto } from '@/lib/queries/types/photos'

const DESKTOP_QUERY = '(min-width: 1024px)'

type UpdatedFeedPhoto = Omit<FeedPhoto, 'createdAt' | 'storageURL'> & {
  createdAt: Date
  storageURL: string
}

type PhotosResponse = {
  success: boolean
  limit: number
  offset: number
  length: number
  photos: Array<UpdatedFeedPhoto>
}

function useColumnCount(): number {
  const [count, setCount] = useState(2)

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY)
    const update = () => setCount(mq.matches ? 3 : 2)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return count
}

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
function distribute(
  photos: UpdatedFeedPhoto[] | null,
  count: number
): UpdatedFeedPhoto[][] {
  const columns: UpdatedFeedPhoto[][] = Array.from({ length: count }, () => [])
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

function PhotoCard({ photo }: { photo: UpdatedFeedPhoto }) {
  return (
    <div className='group border-border relative mb-4 overflow-hidden rounded border'>
      <Image
        src={`${photo.storageURL}`}
        alt={photo.name}
        width={photo.width}
        height={photo.height}
        sizes='(min-width: 1024px) 33vw, 50vw'
        className='h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]'
      />
    </div>
  )
}

export default function PhotoFeed() {
  const [photos, setPhotos] = useState<UpdatedFeedPhoto[] | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pageCount, setPageCount] = useState(0)

  const sentinelRef = useRef<HTMLDivElement | null>(null)
  // Offset for the next page. The first request starts at 0.
  const offsetRef = useRef(0)
  const loadingRef = useRef(false)

  const columnCount = useColumnCount()
  const columns = useMemo(
    () => distribute(photos, columnCount),
    [photos, columnCount]
  )

  const fetchPage = useCallback(async (offset: number) => {
    if (loadingRef.current) return

    loadingRef.current = true

    try {
      const response = await fetch(
        `/api/photos?limit=${MAX_PER_PAGE_LIMIT}&offset=${offset}`,
        { cache: 'no-store' }
      )

      if (!response.ok) {
        throw new Error(`Could not load photos (${response.status})`)
      }

      const payload = (await response.json()) as PhotosResponse

      if (!payload.success || !Array.isArray(payload.photos)) {
        throw new Error('Unexpected response from the server')
      }

      const page: UpdatedFeedPhoto[] = payload.photos.map((photo) => ({
        ...photo,
        createdAt: new Date(photo.createdAt),
      }))

      offsetRef.current = offset + page.length
      setError(null)
      setHasMore(page.length === MAX_PER_PAGE_LIMIT)
      setPageCount((count) => count + 1)
      setPhotos((prev) => {
        const current = prev ?? []
        const seen = new Set(current.map((photo) => photo.id))
        return [...current, ...page.filter((photo) => !seen.has(photo.id))]
      })
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : 'Could not load photos.'
      )
    } finally {
      loadingRef.current = false
      setIsFetching(false)
    }
  }, [])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      void fetchPage(0)
    }, 0)

    return () => window.clearTimeout(timeout)
  }, [fetchPage])

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return

    setIsFetching(true)
    setError(null)
    await fetchPage(offsetRef.current)
  }, [fetchPage, hasMore])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore || error) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadMore()
      },
      { rootMargin: '600px 0px' }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
    // Re-observe after every appended page so the observer fires again when
    // the sentinel is still inside the margin (tall screens), and pause
    // while an error is showing so we don't hammer the API.
  }, [hasMore, error, loadMore, photos?.length, pageCount])

  if (photos === null) {
    return (
      <div className='text-muted flex min-h-48 flex-col items-center justify-center gap-2 py-24 text-center'>
        {error ? (
          <button
            type='button'
            onClick={() => {
              setIsFetching(true)
              setError(null)
              void fetchPage(0)
            }}
            className='text-accent hover:text-accent-hover cursor-pointer text-sm font-medium transition-colors'
          >
            {error} Tap to retry.
          </button>
        ) : (
          <>
            <Spinner />
            <span className='text-sm'>Loading gallery…</span>
          </>
        )}
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className='text-muted flex flex-col items-center gap-2 py-24 text-center'>
        <p className='text-sm'>Nothing to see yet — the gallery is empty.</p>
      </div>
    )
  }

  return (
    <>
      <div className='flex items-start gap-4'>
        {columns.map((column, i) => (
          <div key={i} className='min-w-0 flex-1'>
            {column.map((photo) => (
              <PhotoCard key={photo.id} photo={photo} />
            ))}
          </div>
        ))}
      </div>

      <div
        ref={sentinelRef}
        aria-live='polite'
        className='text-muted flex min-h-12 items-center justify-center gap-2 py-10'
      >
        {error ? (
          <button
            type='button'
            onClick={() => void loadMore()}
            className='text-accent hover:text-accent-hover cursor-pointer text-sm font-medium transition-colors'
          >
            {error} Tap to retry.
          </button>
        ) : isFetching ? (
          <>
            <Spinner />
            <span className='text-sm'>Loading more…</span>
          </>
        ) : !hasMore ? (
          <span className='text-xs'>You&rsquo;re all caught up.</span>
        ) : null}
      </div>
    </>
  )
}
