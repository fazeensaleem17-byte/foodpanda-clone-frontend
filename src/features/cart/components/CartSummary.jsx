import { ArrowRight } from 'lucide-react'
import { formatPrice } from '@shared/utils/format'

/** "Order summary" card on the cart page with the checkout button. */
export default function CartSummary({ count, total, user, onCheckout, onClear }) {
  return (
    <aside className="card h-fit p-6 lg:sticky lg:top-24">
      <h2 className="text-lg font-semibold">Order summary</h2>
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Items ({count})</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
      <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 text-lg font-semibold text-gray-900">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
      {user && user.role !== 'customer' ? (
        <p className="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
          Only customer accounts can place orders.
        </p>
      ) : (
        <button type="button" onClick={onCheckout} className="btn-primary mt-5 w-full py-3">
          {user ? 'Proceed to checkout' : 'Log in to checkout'}{' '}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
      <button
        type="button"
        onClick={onClear}
        className="btn-ghost mt-2 w-full text-red-500 hover:bg-red-50 hover:text-red-600"
      >
        Clear cart
      </button>
    </aside>
  )
}
