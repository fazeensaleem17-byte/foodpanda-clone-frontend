import { useCallback, useEffect, useRef, useState } from 'react'
import { getErrorMessage } from '@shared/utils/errors'

/**
 * Run an async loader (usually an api/* call) and track loading / error / data.
 *
 *   const { data, loading, error, reload, setData } = useAsync(() => ordersApi.list({ page }), [page])
 *
 * Stale responses are ignored if deps change before a request finishes.
 */
export function useAsync(loader, deps = [], { immediate = true } = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)
  const requestId = useRef(0)

  // Like useEffect, this hook takes its dependency list from the caller, so the
  // linter cannot check it here. Callers pass every value their loader reads.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(loader, deps)

  const reload = useCallback(
    async ({ silent = false } = {}) => {
      const id = ++requestId.current
      if (!silent) setLoading(true)
      setError(null)
      try {
        const result = await run()
        if (id === requestId.current) setData(result)
        return result
      } catch (err) {
        if (id === requestId.current) setError(getErrorMessage(err))
      } finally {
        if (id === requestId.current) setLoading(false)
      }
    },
    [run],
  )

  useEffect(() => {
    if (immediate) reload()
  }, [reload, immediate])

  return { data, loading, error, reload, setData }
}
