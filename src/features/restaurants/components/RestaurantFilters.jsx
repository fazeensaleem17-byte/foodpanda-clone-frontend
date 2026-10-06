import { MapPin, X } from 'lucide-react'
import { SORT_OPTIONS } from '../constants'

/** Heading of the restaurant list plus its city / sort / open-now controls. */
export default function RestaurantFilters({
  search,
  resultCount,
  cities,
  city,
  ordering,
  openNow,
  hasFilters,
  onCityChange,
  onOrderingChange,
  onToggleOpenNow,
  onClear,
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h2 className="text-2xl font-semibold">{search ? `Results for "${search}"` : 'All restaurants'}</h2>
        <p className="mt-1 text-sm text-gray-500">
          {resultCount != null
            ? `${resultCount} restaurant${resultCount === 1 ? '' : 's'} found`
            : 'Finding restaurants near you'}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <label className="relative">
          <span className="sr-only">Filter by city</span>
          <MapPin
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <select
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            className="input w-auto cursor-pointer py-2 pl-9"
          >
            <option value="">All cities</option>
            {(cities || []).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Sort by</span>
          <select
            value={ordering}
            onChange={(e) => onOrderingChange(e.target.value)}
            className="input w-auto cursor-pointer py-2"
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={onToggleOpenNow}
          className={`chip ${openNow ? 'chip-active' : 'chip-idle'}`}
          aria-pressed={openNow}
        >
          <span
            className={`h-2 w-2 rounded-full ${openNow ? 'bg-white' : 'bg-emerald-500'}`}
            aria-hidden="true"
          />{' '}
          Open now
        </button>
        {hasFilters && (
          <button type="button" onClick={onClear} className="btn-ghost btn-sm">
            <X className="h-3.5 w-3.5" aria-hidden="true" /> Clear
          </button>
        )}
      </div>
    </div>
  )
}
