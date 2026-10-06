import { Banknote, Bike, CreditCard, MapPin, RotateCcw, UserRound } from 'lucide-react'
import { StatusBadge } from '@shared/components/ui'
import { formatAddress, formatDate, formatPrice, usernameOf } from '@shared/utils/format'

/** Side cards on the order page: where the order goes and how it is paid. */

export function OrderDeliveryCard({ order, showCustomer }) {
  return (
    <div className="card space-y-3 p-5 text-sm">
      <h3 className="font-semibold">Delivery</h3>
      <p className="flex gap-2.5 text-gray-700">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
        <span>
          <span className="block font-medium capitalize text-gray-900">{order.address?.label}</span>
          {formatAddress(order.address)}
        </span>
      </p>
      {showCustomer && (
        <p className="flex items-center gap-2.5 text-gray-700">
          <UserRound className="h-4 w-4 text-gray-400" aria-hidden="true" />
          {usernameOf(order.customer)}
        </p>
      )}
      <p className="flex items-center gap-2.5 text-gray-700">
        <Bike className="h-4 w-4 text-gray-400" aria-hidden="true" />
        {order.rider ? usernameOf(order.rider) : 'Rider not assigned yet'}
      </p>
    </div>
  )
}

export function OrderPaymentCard({ payment }) {
  const PayIcon = payment.method === 'card' ? CreditCard : Banknote
  return (
    <div className="card p-5 text-sm">
      <h3 className="font-semibold">Payment</h3>
      <div className="mt-3 flex items-center justify-between">
        <span className="flex items-center gap-2 text-gray-700">
          <PayIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
          {payment.method === 'card' ? 'Card' : 'Cash on delivery'}
        </span>
        <StatusBadge status={payment.status} />
      </div>
      <div className="mt-3 space-y-1 text-gray-500">
        <p className="flex justify-between">
          <span>Amount</span>
          <span className="font-medium text-gray-900">{formatPrice(payment.amount)}</span>
        </p>
        {payment.paid_at && (
          <p className="flex justify-between">
            <span>Paid</span>
            <span>{formatDate(payment.paid_at)}</span>
          </p>
        )}
      </div>
      {payment.status === 'refunded' && (
        <p className="mt-3 flex gap-2 rounded-xl bg-teal-50 p-3 text-teal-800">
          <RotateCcw className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          This order was cancelled and the card payment of {formatPrice(payment.amount)} has been refunded.
        </p>
      )}
    </div>
  )
}
