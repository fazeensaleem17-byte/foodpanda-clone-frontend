import { Trash2 } from 'lucide-react'
import { QuantityStepper, SmartImage } from '@shared/components/ui'
import { formatPrice } from '@shared/utils/format'

/** One line of the cart page: photo, name, quantity stepper, line total, remove button. */
export default function CartItemRow({ item, maxQuantity, onChangeQuantity, onRemove }) {
  return (
    <li className="flex animate-fade-in flex-wrap items-center gap-x-4 gap-y-3 p-4 sm:flex-nowrap">
      <SmartImage src={item.image} alt={item.name} rounded="rounded-xl" className="h-16 w-16 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-gray-900">{item.name}</p>
        <p className="text-sm text-gray-500">{formatPrice(item.price)} each</p>
        <p className="mt-0.5 text-sm font-semibold text-gray-900 sm:hidden">
          {formatPrice(Number(item.price) * item.quantity)}
        </p>
      </div>
      {/* On phones the controls drop to their own right-aligned row so nothing overflows.
          From 640px up, "contents" removes this wrapper and the row is laid out exactly as before. */}
      <div className="flex w-full items-center justify-end gap-2 sm:contents">
        <QuantityStepper
          value={item.quantity}
          min={1}
          max={maxQuantity}
          onChange={onChangeQuantity}
          size="sm"
        />
        <p className="hidden w-24 text-right font-semibold text-gray-900 sm:block">
          {formatPrice(Number(item.price) * item.quantity)}
        </p>
        <button
          type="button"
          onClick={onRemove}
          className="cursor-pointer rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500 max-lg:p-3"
          aria-label={`Remove ${item.name}`}
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </li>
  )
}
