import { Link } from 'react-router-dom'
import { SmartImage } from '@shared/components/ui'
import { formatPrice } from '@shared/utils/format'

/** The dishes in an order with quantities, line totals and the order total. */
export default function OrderItemsCard({ order }) {
  return (
    <section className="card p-6">
      <h2 className="font-semibold">
        Items from{' '}
        <Link to={`/restaurants/${order.restaurant}`} className="text-brand-600 hover:underline">
          {order.restaurant_name}
        </Link>
      </h2>
      <ul className="mt-4 divide-y divide-gray-100">
        {order.order_items.map((i) => (
          <li key={i.id} className="flex items-center gap-4 py-3">
            <SmartImage src={i.image} alt={i.name} rounded="rounded-xl" className="h-14 w-14 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-gray-900">{i.name}</p>
              <p className="text-sm text-gray-500">
                {i.quantity} × {formatPrice(i.price)}
              </p>
            </div>
            <span className="font-semibold text-gray-900">{formatPrice(i.subtotal)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex justify-between border-t border-gray-100 pt-4 text-lg font-semibold text-gray-900">
        <span>Total</span>
        <span>{formatPrice(order.total)}</span>
      </div>
    </section>
  )
}
