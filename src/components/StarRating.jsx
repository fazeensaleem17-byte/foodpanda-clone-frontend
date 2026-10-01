import { Star } from 'lucide-react'

/** Read-only star display (rounded to whole stars). */
export function Stars({ value = 0, size = 'h-4 w-4', className = '' }) {
  const rounded = Math.round(Number(value) || 0)
  return (
    <span className={`inline-flex gap-0.5 ${className}`} role="img" aria-label={`${Number(value || 0).toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} className={`${size} ${n <= rounded ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} aria-hidden="true" />
      ))}
    </span>
  )
}

/** Compact "star 4.2 (12)" rating badge used on cards. */
export function RatingBadge({ rating, count, className = '' }) {
  if (!count) return <span className={`text-xs font-medium text-gray-400 ${className}`}>New</span>
  return (
    <span className={`inline-flex items-center gap-1 text-sm font-semibold text-gray-900 ${className}`}>
      <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
      {Number(rating).toFixed(1)}
      <span className="font-normal text-gray-400">({count})</span>
    </span>
  )
}

/** Clickable 1-5 star input. */
export function StarInput({ value, onChange }) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          onClick={() => onChange(n)}
          className="cursor-pointer rounded-md p-0.5 transition hover:scale-110 focus-visible:outline-2 focus-visible:outline-brand-500"
        >
          <Star className={`h-8 w-8 transition ${n <= value ? 'fill-amber-400 text-amber-400' : 'fill-gray-100 text-gray-300'}`} aria-hidden="true" />
        </button>
      ))}
    </div>
  )
}
