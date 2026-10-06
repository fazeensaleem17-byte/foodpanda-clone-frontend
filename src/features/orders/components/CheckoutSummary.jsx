import { Link } from 'react-router-dom'
import { SmartImage, Spinner } from '@shared/components/ui'
import { formatPrice } from '@shared/utils/format'

/** Sticky order summary at checkout with the "Place order" button. */
export default function CheckoutSummary({ cart, placing, disabled, onPlaceOrder }) {
  return (
    <aside className="card h-fit overflow-hidden lg:sticky lg:top-24">
      <div className="flex items-center gap-3 border-b border-gray-100 p-5">
        <SmartImage
          src={cart.restaurant.logo}
          alt=""
          kind="logo"
          rounded="rounded-xl"
          className="h-11 w-11"
        />
        <div>
          <h2 className="font-semibold">Your order</h2>
          <Link to={`/restaurants/${cart.restaurant.id}`} className="text-sm text-brand-600 hover:underline">
            {cart.restaurant.name}
          </Link>
        </div>
      </div>
      <ul className="max-h-72 space-y-3 overflow-y-auto p-5">
        {cart.items.map((i) => (
          <li key={i.id} className="flex items-center gap-3 text-sm">
            <SmartImage src={i.image} alt="" rounded="rounded-lg" className="h-10 w-10 shrink-0" />
            <span className="min-w-0 flex-1 truncate text-gray-700">
              <span className="font-semibold text-gray-900">{i.quantity}×</span> {i.name}
            </span>
            <span className="font-medium text-gray-900">{formatPrice(Number(i.price) * i.quantity)}</span>
          </li>
        ))}
      </ul>
      <div className="border-t border-gray-100 bg-gray-50/60 p-5">
        <div className="flex justify-between text-lg font-semibold text-gray-900">
          <span>Total</span>
          <span>{formatPrice(cart.total)}</span>
        </div>
        <p className="mt-1 text-xs text-gray-400">
          The final total is confirmed with the restaurant&apos;s current prices.
        </p>
        <button
          type="button"
          onClick={onPlaceOrder}
          disabled={disabled}
          className="btn-primary mt-4 w-full py-3"
        >
          {placing ? (
            <>
              <Spinner /> Placing order...
            </>
          ) : (
            `Place order · ${formatPrice(cart.total)}`
          )}
        </button>
        <Link to="/cart" className="btn-ghost mt-2 w-full">
          Back to cart
        </Link>
      </div>
    </aside>
  )
}
