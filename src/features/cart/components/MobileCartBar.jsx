import { Link } from 'react-router-dom'
import { formatPrice } from '@shared/utils/format'
import { useCart } from '../hooks/useCart'

/** Floating "View cart" bar on the restaurant page (mobile only), shown once the cart has items from it. */
export default function MobileCartBar({ restaurant }) {
  const cart = useCart()
  const cartIsHere = cart.restaurant?.id === restaurant.id && cart.count > 0
  if (!cartIsHere) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 animate-fade-in p-3 lg:hidden">
      <Link to="/cart" className="btn-primary flex w-full justify-between rounded-2xl py-3.5 shadow-xl">
        <span className="flex items-center gap-2">
          <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white/25 px-1.5 text-xs">
            {cart.count}
          </span>
          View cart
        </span>
        <span>{formatPrice(cart.total)}</span>
      </Link>
    </div>
  )
}
