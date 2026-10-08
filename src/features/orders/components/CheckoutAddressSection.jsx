import { MapPin, Plus } from 'lucide-react'
import { ADDRESS_LABEL_ICONS } from '@features/addresses'
import { formatAddress } from '@shared/utils/format'
import OptionTile from './OptionTile'

/** Step 1 of checkout: choose one of the saved addresses, or add a new one. */
export default function CheckoutAddressSection({ addresses, selectedId, onSelect, onAddNew }) {
  return (
    <section className="card p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-3 text-lg font-semibold">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-sm text-white">
            1
          </span>
          Delivery address
        </h2>
        <button type="button" onClick={onAddNew} className="btn-outline btn-sm shrink-0 whitespace-nowrap">
          <Plus className="h-4 w-4" aria-hidden="true" /> Add new
        </button>
      </div>
      {addresses.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center">
          <MapPin className="mx-auto h-8 w-8 text-gray-300" strokeWidth={1.5} aria-hidden="true" />
          <p className="mt-2 text-sm text-gray-500">You have no saved addresses yet.</p>
          <button type="button" onClick={onAddNew} className="btn-primary mt-4">
            Add delivery address
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {addresses.map((a) => {
            const Icon = ADDRESS_LABEL_ICONS[a.label] ?? MapPin
            return (
              <OptionTile
                key={a.id}
                name="address"
                selected={selectedId === a.id}
                onSelect={() => onSelect(a.id)}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-500 ring-1 ring-gray-100">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="pr-6">
                  <span className="flex items-center gap-2 text-sm font-semibold capitalize text-gray-900">
                    {a.label}
                    {a.is_default && (
                      <span className="rounded-md bg-brand-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-brand-600">
                        Default
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-sm text-gray-500">{formatAddress(a)}</span>
                </span>
              </OptionTile>
            )
          })}
        </div>
      )}
    </section>
  )
}
