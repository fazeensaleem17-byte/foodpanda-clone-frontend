import { STATUS_LABELS } from '../constants'

/** Scrollable row of status chips ('' = "All") used to filter order lists. */
export default function StatusFilterTabs({ statuses, value, onChange }) {
  return (
    <div className="scrollbar-none -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1">
      {statuses.map((s) => (
        <button
          key={s || 'all'}
          type="button"
          onClick={() => onChange(s)}
          className={`chip ${value === s ? 'chip-active' : 'chip-idle'}`}
        >
          {s ? STATUS_LABELS[s] : 'All'}
        </button>
      ))}
    </div>
  )
}
