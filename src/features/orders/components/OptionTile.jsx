import { Check } from 'lucide-react'

/** Selectable radio tile used for addresses and payment methods at checkout. */
export default function OptionTile({ selected, onSelect, name, children }) {
  return (
    <label
      className={`relative flex cursor-pointer gap-3 rounded-2xl border-2 p-4 transition duration-200 ${selected ? 'border-brand-500 bg-brand-50/60' : 'border-gray-200 hover:border-brand-200 hover:bg-gray-50'}`}
    >
      <input type="radio" name={name} className="sr-only" checked={selected} onChange={onSelect} />
      {children}
      <span
        className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border-2 transition ${selected ? 'border-brand-500 bg-brand-500 text-white' : 'border-gray-300'}`}
        aria-hidden="true"
      >
        {selected && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
    </label>
  )
}
