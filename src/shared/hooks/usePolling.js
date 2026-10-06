import { useEffect } from 'react'

/** Call `fn` every `ms` milliseconds while the tab is visible (live order boards). */
export function usePolling(fn, ms = 30000) {
  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') fn()
    }, ms)
    return () => clearInterval(id)
  }, [fn, ms])
}
