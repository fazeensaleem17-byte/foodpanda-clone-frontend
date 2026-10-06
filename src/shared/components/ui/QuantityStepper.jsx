import { Minus, Plus, Trash2 } from 'lucide-react'

/** − qty + control. With `removeAtMin`, the minus button becomes a bin at quantity 1. */
export default function QuantityStepper({
  value,
  onChange,
  min = 0,
  max = 50,
  size = 'md',
  removeAtMin = false,
}) {
  const box = size === 'sm' ? 'h-8 w-8' : 'h-9 w-9'
  const showBin = removeAtMin && value <= 1
  return (
    <div className="inline-flex items-center rounded-full border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={!showBin && value <= min}
        className={`${box} flex cursor-pointer items-center justify-center rounded-full text-brand-600 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40`}
        aria-label={showBin ? 'Remove item' : 'Decrease quantity'}
      >
        {showBin ? (
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Minus className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
      <span className="w-7 text-center text-sm font-semibold text-gray-900" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        className={`${box} flex cursor-pointer items-center justify-center rounded-full text-brand-600 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-40`}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
}
