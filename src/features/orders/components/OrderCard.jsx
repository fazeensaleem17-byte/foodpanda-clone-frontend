import { Link } from 'react-router-dom'
import { Banknote, Bike, ChevronRight, CreditCard, MapPin, UserRound } from 'lucide-react'
import { SmartImage, StatusBadge } from '@shared/components/ui'
import { formatAddress, formatDate, formatPrice, usernameOf } from '@shared/utils/format'

/**
 * Compact order summary used in customer, owner and rider lists.
 * `actions` is rendered at the bottom (status buttons etc.).
 */
export default function OrderCard({ order, linkTo, showCustomer = false, showRider = false, actions }) {
  const items = order.order_items
  const itemsText = items.map((i) => `${i.quantity}× ${i.name}`).join(', ')
  const PayIcon = order.payment?.method === 'card' ? CreditCard : Banknote

  return (
    <div className="card animate-fade-in p-5 transition duration-300 hover:shadow-card-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold">Order #{order.id}</h3>
            <StatusBadge status={order.status} />
          </div>
          <p className="mt-0.5 text-sm text-gray-500">
            {order.restaurant_name} · {formatDate(order.created_at)}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="whitespace-nowrap font-display text-lg font-semibold text-gray-900">
            {formatPrice(order.total)}
          </p>
          {order.payment && (
            <p className="mt-0.5 flex items-center justify-end gap-1.5 text-xs text-gray-500">
              <PayIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {order.payment.method === 'card' ? 'Card' : 'Cash'}
              <StatusBadge status={order.payment.status} />
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex -space-x-2">
          {items.slice(0, 4).map((i) => (
            <SmartImage
              key={i.id}
              src={i.image}
              alt={i.name}
              rounded="rounded-lg"
              className="h-11 w-11 ring-2 ring-white"
            />
          ))}
        </div>
        <p className="line-clamp-2 min-w-0 flex-1 text-sm text-gray-700">{itemsText}</p>
      </div>

      <div className="mt-3 space-y-1 text-xs text-gray-500">
        {order.address && (
          <p className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {formatAddress(order.address)}
          </p>
        )}
        {showCustomer && (
          <p className="flex items-center gap-1.5">
            <UserRound className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Customer: {usernameOf(order.customer)}
          </p>
        )}
        {showRider && (
          <p className="flex items-center gap-1.5">
            <Bike className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            Rider: {order.rider ? usernameOf(order.rider) : 'Not assigned yet'}
          </p>
        )}
      </div>

      {(actions || linkTo) && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4">
          {actions}
          {linkTo && (
            <Link to={linkTo} className="btn-ghost btn-sm ml-auto text-brand-600">
              View details <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
