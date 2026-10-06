import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { EmptyState, SmartImage } from '@shared/components/ui'
import CartItemRow from '../components/CartItemRow'
import CartSummary from '../components/CartSummary'
import { useCartPage } from '../hooks/useCartPage'

export default function CartPage() {
  const { cart, user, goToCheckout } = useCartPage()

  if (cart.count === 0) {
    return (
      <div className="page max-w-3xl">
        <h1 className="page-title mb-6">Your cart</h1>
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          message="Browse restaurants and add some delicious dishes."
          action="Find food"
          actionTo="/"
        />
      </div>
    )
  }

  return (
    <div className="page max-w-5xl">
      <h1 className="page-title">Your cart</h1>
      <div className="mb-6 mt-3 flex items-center gap-3">
        <SmartImage src={cart.restaurant.logo} alt="" kind="logo" rounded="rounded-lg" className="h-9 w-9" />
        <p className="text-sm text-gray-500">
          From{' '}
          <Link
            to={`/restaurants/${cart.restaurant.id}`}
            className="font-semibold text-brand-600 hover:underline"
          >
            {cart.restaurant.name}
          </Link>
          <span className="hidden sm:inline"> · You can order from one restaurant at a time.</span>
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <ul className="card divide-y divide-gray-100">
          {cart.items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              maxQuantity={cart.MAX_QTY}
              onChangeQuantity={(q) => cart.updateQuantity(item.id, q)}
              onRemove={() => cart.removeItem(item.id)}
            />
          ))}
        </ul>

        <CartSummary
          count={cart.count}
          total={cart.total}
          user={user}
          onCheckout={goToCheckout}
          onClear={cart.clearCart}
        />
      </div>
    </div>
  )
}
