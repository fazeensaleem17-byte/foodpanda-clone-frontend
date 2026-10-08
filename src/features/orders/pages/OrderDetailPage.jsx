import { Link, useParams } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { OrderReviewSection } from '@features/reviews'
import { ConfirmDialog, DetailSkeleton, ErrorState, StatusBadge } from '@shared/components/ui'
import { formatDate, formatPrice } from '@shared/utils/format'
import OrderActions from '../components/OrderActions'
import { OrderDeliveryCard, OrderPaymentCard } from '../components/OrderInfoCards'
import OrderItemsCard from '../components/OrderItemsCard'
import StatusTimeline from '../components/StatusTimeline'
import { useOrderDetail } from '../hooks/useOrderDetail'

/** Order detail page, shared by customers, owners and riders (actions depend on role). */
export default function OrderDetailPage() {
  const { id } = useParams()
  const detail = useOrderDetail(id)
  const { user, role, order, loading, error, reload, busy } = detail

  if (loading) return <DetailSkeleton />
  if (error)
    return (
      <div className="page">
        <ErrorState message={error} onRetry={reload} />
      </div>
    )

  const [backTo, backLabel] = detail.backLink
  const payment = order.payment

  return (
    <div className="page max-w-5xl">
      <Link
        to={backTo}
        className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline max-lg:min-h-10"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" /> {backLabel}
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="page-title">Order #{order.id}</h1>
          <p className="mt-1 text-sm text-gray-500">
            Placed {formatDate(order.created_at)} · Updated {formatDate(order.updated_at)}
          </p>
        </div>
        <StatusBadge status={order.status} className="px-3 py-1 text-sm" />
      </div>

      <StatusTimeline status={order.status} />

      <OrderActions
        order={order}
        busy={busy}
        canPay={detail.canPay}
        canCancel={detail.canCancel}
        statusActions={detail.statusActions}
        onPay={detail.pay}
        onCancel={detail.openCancelDialog}
        onSetStatus={detail.setStatus}
      />

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_320px]">
        <OrderItemsCard order={order} />
        <aside className="space-y-4">
          <OrderDeliveryCard order={order} showCustomer={role !== 'customer'} />
          {payment && <OrderPaymentCard payment={payment} />}
        </aside>
      </div>

      {/* Review (customer, delivered orders) */}
      {detail.canReview && (
        <OrderReviewSection
          restaurantId={order.restaurant}
          restaurantName={order.restaurant_name}
          userId={user.id}
        />
      )}

      <ConfirmDialog
        open={detail.cancelDialogOpen}
        title="Cancel this order?"
        message={`The restaurant hasn't confirmed it yet, so you can still cancel.${detail.willRefund ? ` Your card payment of ${formatPrice(payment.amount)} will be refunded.` : ''} This cannot be undone.`}
        confirmLabel="Yes, cancel order"
        danger
        busy={busy === 'cancel'}
        onCancel={detail.closeCancelDialog}
        onConfirm={detail.confirmCancel}
      />
    </div>
  )
}
