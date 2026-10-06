import { RIDER_TABS } from '../constants'

/** Segmented control switching between Available / My active / Delivered, with counts. */
export default function RiderTabs({ tab, counts, onChange }) {
  return (
    <div className="mb-6 grid grid-cols-3 gap-1.5 rounded-2xl border border-gray-100 bg-white p-1.5 shadow-card">
      {RIDER_TABS.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onChange(t.key)}
          className={`cursor-pointer rounded-xl px-2 py-2.5 text-sm font-semibold transition ${tab === t.key ? 'bg-brand-500 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <t.icon className="mr-1.5 inline h-4 w-4 align-[-3px]" aria-hidden="true" />
          <span className="hidden sm:inline">{t.label}</span>
          <span className="sm:hidden">{t.label.replace('My ', '')}</span>
          {counts[t.key] > 0 && (
            <span
              className={`ml-1.5 rounded-full px-1.5 text-xs ${tab === t.key ? 'bg-white/25' : 'bg-brand-100 text-brand-600'}`}
            >
              {counts[t.key]}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
