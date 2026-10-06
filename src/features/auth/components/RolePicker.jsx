import { ROLE_OPTIONS } from '../constants'

/** Three-way role choice (customer / restaurant / rider) on the register page. */
export default function RolePicker({ value, onChange, error }) {
  return (
    <fieldset>
      <legend className="label">I want to...</legend>
      <div className="grid grid-cols-3 gap-2">
        {ROLE_OPTIONS.map((r) => (
          <button
            key={r.value}
            type="button"
            onClick={() => onChange(r.value)}
            aria-pressed={value === r.value}
            className={`flex cursor-pointer flex-col items-center rounded-2xl border-2 p-3 text-center transition duration-200 ${value === r.value ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-brand-200 hover:bg-gray-50'}`}
          >
            <r.icon
              className={`mb-1.5 h-6 w-6 ${value === r.value ? 'text-brand-500' : 'text-gray-400'}`}
              strokeWidth={1.75}
              aria-hidden="true"
            />
            <div className="text-sm font-semibold text-gray-900">{r.title}</div>
            <div className="text-xs text-gray-500">{r.text}</div>
          </button>
        ))}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </fieldset>
  )
}
