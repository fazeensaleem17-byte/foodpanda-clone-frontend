import { PAYMENT_METHOD_OPTIONS } from '../constants'
import OptionTile from './OptionTile'

/** Step 2 of checkout: cash on delivery or (simulated) card. */
export default function CheckoutPaymentSection({ value, onChange }) {
  return (
    <section className="card p-6">
      <h2 className="mb-5 flex items-center gap-3 text-lg font-semibold">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-sm text-white">
          2
        </span>
        Payment method
      </h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {PAYMENT_METHOD_OPTIONS.map((m) => (
          <OptionTile
            key={m.value}
            name="payment"
            selected={value === m.value}
            onSelect={() => onChange(m.value)}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-500 ring-1 ring-gray-100">
              <m.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="pr-6">
              <span className="block text-sm font-semibold text-gray-900">{m.title}</span>
              <span className="text-sm text-gray-500">{m.text}</span>
            </span>
          </OptionTile>
        ))}
      </div>
    </section>
  )
}
