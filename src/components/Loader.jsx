import { Loader2 } from 'lucide-react'

/** Small inline spinner for buttons that are busy (page loading uses skeletons). */
export function Spinner({ className = 'h-4 w-4' }) {
  return <Loader2 className={`animate-spin ${className}`} aria-hidden="true" />
}
