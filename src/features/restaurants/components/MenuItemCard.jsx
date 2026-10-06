import { Plus } from 'lucide-react'
import { QuantityStepper, SmartImage } from '@shared/components/ui'
import { formatPrice } from '@shared/utils/format'

/**
 * One dish on the restaurant page: text on the left, photo on the right
 * with the add button overlapping it.
 * - canOrder=false hides the add button (e.g. owners / riders browsing).
 * - quantity > 0 shows a stepper instead of the "+" button.
 */
export default function MenuItemCard({ item, quantity = 0, canOrder, disabledReason, onAdd, onChangeQty }) {
  return (
    <div
      className={`card group flex gap-4 p-4 transition duration-300 hover:border-brand-100 hover:shadow-card-hover ${item.is_available ? '' : 'opacity-60'}`}
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <h4 className="font-semibold">{item.name}</h4>
        {item.description && (
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-gray-500">{item.description}</p>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-3">
          <span className="whitespace-nowrap font-semibold text-gray-900">{formatPrice(item.price)}</span>
          {!canOrder && disabledReason && (
            <span className="whitespace-nowrap rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
              {disabledReason}
            </span>
          )}
        </div>
      </div>
      <div className="relative shrink-0">
        <SmartImage
          src={item.image}
          alt={item.name}
          rounded="rounded-xl"
          className="h-28 w-28 sm:h-32 sm:w-32"
        />
        {canOrder && (
          <div className="absolute -bottom-2 -right-2">
            {quantity > 0 ? (
              <QuantityStepper value={quantity} onChange={onChangeQty} size="sm" removeAtMin />
            ) : (
              <button
                type="button"
                onClick={onAdd}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white text-brand-600 shadow-md ring-1 ring-gray-100 transition duration-200 hover:scale-110 hover:bg-brand-500 hover:text-white"
                aria-label={`Add ${item.name} to cart`}
              >
                <Plus className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
