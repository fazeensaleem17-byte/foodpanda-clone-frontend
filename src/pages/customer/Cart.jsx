import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ShoppingBag, Trash2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import QuantityStepper from '../../components/QuantityStepper'
import SmartImage from '../../components/SmartImage'
import { EmptyState } from '../../components/StateMessages'
import { formatPrice } from '../../utils/format'

export default function Cart() {
  const cart = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  if (cart.count === 0) {
    return (
      <div className="page max-w-3xl">
        <h1 className="page-title mb-6">Your cart</h1>
        <EmptyState icon={ShoppingBag} title="Your cart is empty" message="Browse restaurants and add some delicious dishes." action="Find food" actionTo="/" />
      </div>
    )
  }

  const goToCheckout = () => {
    // Guests are sent to login and brought back to checkout afterwards.
    if (!user) navigate('/login', { state: { from: { pathname: '/checkout' } } })
    else navigate('/checkout')
  }

  return (
    <div className="page max-w-5xl">
      <h1 className="page-title">Your cart</h1>
      <div className="mb-6 mt-3 flex items-center gap-3">
        <SmartImage src={cart.restaurant.logo} alt="" kind="logo" rounded="rounded-lg" className="h-9 w-9" />
        <p className="text-sm text-gray-500">
          From <Link to={`/restaurants/${cart.restaurant.id}`} className="font-semibold text-brand-600 hover:underline">{cart.restaurant.name}</Link>
          <span className="hidden sm:inline"> · You can order from one restaurant at a time.</span>
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <ul className="card divide-y divide-gray-100">
          {cart.items.map((item) => (
            <li key={item.id} className="flex animate-fade-in items-center gap-4 p-4">
              <SmartImage src={item.image} alt={item.name} rounded="rounded-xl" className="h-16 w-16 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">{formatPrice(item.price)} each</p>
                <p className="mt-0.5 text-sm font-semibold text-gray-900 sm:hidden">{formatPrice(Number(item.price) * item.quantity)}</p>
              </div>
              <QuantityStepper value={item.quantity} min={1} max={cart.MAX_QTY} onChange={(q) => cart.updateQuantity(item.id, q)} size="sm" />
              <p className="hidden w-24 text-right font-semibold text-gray-900 sm:block">{formatPrice(Number(item.price) * item.quantity)}</p>
              <button type="button" onClick={() => cart.removeItem(item.id)} className="cursor-pointer rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500" aria-label={`Remove ${item.name}`}>
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>

        <aside className="card h-fit p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Items ({cart.count})</span><span>{formatPrice(cart.total)}</span></div>
          </div>
          <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 text-lg font-semibold text-gray-900">
            <span>Total</span><span>{formatPrice(cart.total)}</span>
          </div>
          {user && user.role !== 'customer' ? (
            <p className="mt-5 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">Only customer accounts can place orders.</p>
          ) : (
            <button type="button" onClick={goToCheckout} className="btn-primary mt-5 w-full py-3">
              {user ? 'Proceed to checkout' : 'Log in to checkout'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
          <button type="button" onClick={cart.clearCart} className="btn-ghost mt-2 w-full text-red-500 hover:bg-red-50 hover:text-red-600">Clear cart</button>
        </aside>
      </div>
    </div>
  )
}
