'use client'

import { useEffect, useRef, useState } from 'react'

export type UseFetchOptions = Omit<RequestInit, 'signal'>

export type UseFetchResult<T> = {
  data: T | null
  error: Error | null
  loading: boolean
}

type FetchState<T> = {
  url: string | null
  data: T | null
  error: Error | null
  loading: boolean
}

/**
 * Fetches JSON from `url` and keeps the request in sync with the component.
 * Pass `null` to disable fetching.
 *
 * Options are read when a request starts. Changing them alone does not
 * trigger a new request; change `url` to fetch again.
 */
export function useFetch<T>(
  url: string | null,
  options?: UseFetchOptions
): UseFetchResult<T> {
  const [state, setState] = useState<FetchState<T>>({
    url: null,
    data: null,
    error: null,
    loading: false,
  })

  const optionsRef = useRef(options)

  useEffect(() => {
    optionsRef.current = options
  })

  useEffect(() => {
    if (!url) return

    const requestUrl = url
    const controller = new AbortController()
    let active = true

    async function load() {
      setState({
        url: requestUrl,
        data: null,
        error: null,
        loading: true,
      })

      try {
        const response = await fetch(requestUrl, {
          ...optionsRef.current,
          signal: controller.signal,
        })

        if (!response.ok) {
          const message = response.statusText
            ? `Request failed: ${response.status} ${response.statusText}`
            : `Request failed with status ${response.status}`

          throw new Error(message)
        }

        const result =
          response.status === 204 ? null : ((await response.json()) as T)

        if (active) {
          setState({
            url: requestUrl,
            data: result,
            error: null,
            loading: false,
          })
        }
      } catch (caught) {
        if (!active || controller.signal.aborted) return

        setState({
          url: requestUrl,
          data: null,
          error:
            caught instanceof Error
              ? caught
              : new Error('Something went wrong'),
          loading: false,
        })
      }
    }

    void load()

    return () => {
      active = false
      controller.abort()
    }
  }, [url])

  const isCurrent = state.url === url

  return {
    data: isCurrent ? state.data : null,
    error: isCurrent ? state.error : null,
    loading: url ? !isCurrent || state.loading : false,
  }
}
