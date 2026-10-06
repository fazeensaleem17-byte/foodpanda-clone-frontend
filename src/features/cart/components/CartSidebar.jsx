import { useNavigate } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { QuantityStepper, SmartImage } from '@shared/components/ui'
import { formatPrice } from '@shared/utils/format'
import { useCart } from '../hooks/useCart'

/** Sticky "Your order" panel on the restaurant page (desktop only). */
export default function CartSidebar({ restaurant }) {
  const cart = useCart()
  const navigate = useNavigate()
  const cartIsHere = cart.restaurant?.id === restaurant.id && cart.count > 0

  return (
    <aside className="hidden lg:block" aria-label="Your order">
      <div className="card sticky top-36 overflow-hidden">
        <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
          <ShoppingBag className="h-5 w-5 text-brand-500" aria-hidden="true" />
          <h3 className="font-semibold">Your order</h3>
        </div>
        {cartIsHere ? (
          <>
            <ul className="max-h-[50vh] divide-y divide-gray-100 overflow-y-auto px-5">
              {cart.items.map((i) => (
                <li key={i.id} className="flex items-center gap-3 py-3">
                  <SmartImage src={i.image} alt="" rounded="rounded-lg" className="h-11 w-11 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">{i.name}</p>
                    <p className="text-xs text-gray-500">{formatPrice(Number(i.price) * i.quantity)}</p>
                  </div>
                  <QuantityStepper
                    value={i.quantity}
                    size="sm"
                    max={cart.MAX_QTY}
                    removeAtMin
                    onChange={(q) => cart.updateQuantity(i.id, q)}
                  />
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-100 bg-gray-50/60 px-5 py-4">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>{formatPrice(cart.total)}</span>
              </div>
              <div className="mt-1 flex justify-between font-semibold text-gray-900">
                <span>Total</span>
                <span>{formatPrice(cart.total)}</span>
              </div>
              <button type="button" onClick={() => navigate('/cart')} className="btn-primary mt-4 w-full">
                Review order
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center px-5 py-10 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
              <ShoppingBag className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
            </div>
            <p className="text-sm text-gray-500">
              {cart.count > 0
                ? `Your cart has items from ${cart.restaurant.name}. Adding from here starts a new cart.`
                : 'Your cart is empty. Add dishes to get started.'}
            </p>
          </div>
        )}
      </div>
    </aside>
  )
}
