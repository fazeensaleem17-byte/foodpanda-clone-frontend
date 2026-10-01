import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Banknote, Bike, Check, ChefHat, ChevronLeft, CircleCheck, ClipboardCheck, CreditCard, MapPin, PackageCheck, RotateCcw, Star, UserRound, XCircle } from 'lucide-react'
import { ordersApi } from '../api/orders'
import { reviewsApi } from '../api/reviews'
import { resultsOf } from '../api/client'
import { useAsync } from '../hooks/useAsync'
import { useAuth } from '../context/AuthContext'
import { Spinner } from '../components/Loader'
import Modal, { ConfirmDialog } from '../components/Modal'
import ReviewForm from '../components/ReviewForm'
import SmartImage from '../components/SmartImage'
import StatusBadge from '../components/StatusBadge'
import { Stars } from '../components/StarRating'
import { DetailSkeleton, Skeleton } from '../components/Skeletons'
import { ErrorState } from '../components/StateMessages'
import { formatAddress, formatDate, formatPrice, usernameOf } from '../utils/format'
import { getErrorMessage } from '../utils/errors'
import { ACTION_LABELS, PROGRESS_STEPS, STATUS_LABELS, nextStatuses } from '../utils/orderStatus'

const BACK = { customer: ['/orders', 'My orders'], owner: ['/owner/orders', 'Incoming orders'], rider: ['/rider', 'Deliveries'] }
const STEP_ICONS = { pending: ClipboardCheck, confirmed: CircleCheck, preparing: ChefHat, on_the_way: Bike, delivered: PackageCheck }

/** Order detail page, shared by customers, owners and riders (actions depend on role). */
export default function OrderDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const role = user.role
  const [busy, setBusy] = useState(null)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [reviewOpen, setReviewOpen] = useState(false)

  const { data: order, loading, error, reload, setData } = useAsync(() => ordersApi.get(id), [id])

  // For delivered orders, customers can review the restaurant once. Look up an existing review.
  const canReview = role === 'customer' && order?.status === 'delivered'
  const myReview = useAsync(
    () => (canReview ? reviewsApi.list({ restaurant: order.restaurant, user: user.id }).then((d) => resultsOf(d)[0] ?? null) : null),
    [canReview, order?.restaurant, user.id],
  )

  if (loading) return <DetailSkeleton />
  if (error) return <div className="page"><ErrorState message={error} onRetry={reload} /></div>

  // Run an order action, replace the order with the server's response, toast the result.
  const run = async (key, fn, successMsg) => {
    setBusy(key)
    try {
      const updated = await fn()
      setData(updated)
      toast.success(typeof successMsg === 'function' ? successMsg(updated) : successMsg)
    } catch (err) {
      toast.error(getErrorMessage(err))
      reload({ silent: true }) // status may have changed elsewhere
    } finally {
      setBusy(null)
    }
  }

  const payment = order.payment
  const statusActions = role === 'customer' ? [] : nextStatuses(role, order.status)
  const canCancel = role === 'customer' && order.status === 'pending'
  const canPay = role === 'customer' && payment?.method === 'card' && payment.status === 'pending' && order.status !== 'cancelled'
  const willRefund = payment?.status === 'paid'
  const [backTo, backLabel] = BACK[role] ?? BACK.customer
  const PayIcon = payment?.method === 'card' ? CreditCard : Banknote

  const submitReview = async (payload) => {
    if (myReview.data) {
      myReview.setData(await reviewsApi.update(myReview.data.id, payload))
      toast.success('Review updated')
    } else {
      myReview.setData(await reviewsApi.create({ restaurant: order.restaurant, ...payload }))
      toast.success('Thanks for your review!')
    }
    setReviewOpen(false)
  }

  return (
    <div className="page max-w-5xl">
      <Link to={backTo} className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline">
        <ChevronLeft className="h-4 w-4" aria-hidden="true" /> {backLabel}
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="page-title">Order #{order.id}</h1>
          <p className="mt-1 text-sm text-gray-500">Placed {formatDate(order.created_at)} · Updated {formatDate(order.updated_at)}</p>
        </div>
        <StatusBadge status={order.status} className="px-3 py-1 text-sm" />
      </div>

      <StatusTimeline status={order.status} />

      {/* Actions */}
      {(statusActions.length > 0 || canCancel || canPay) && (
        <div className="card mt-6 flex animate-fade-in flex-wrap items-center gap-2 p-4">
          <span className="mr-auto text-sm font-medium text-gray-700">What's next?</span>
          {canPay && (
            <button type="button" className="btn-primary" disabled={!!busy} onClick={() => run('pay', () => ordersApi.pay(order.id), 'Payment successful')}>
              {busy === 'pay' ? <><Spinner /> Processing...</> : <><CreditCard className="h-4 w-4" aria-hidden="true" /> Pay now {formatPrice(order.total)}</>}
            </button>
          )}
          {canCancel && (
            <button type="button" className="btn-danger-outline" disabled={!!busy} onClick={() => setConfirmCancel(true)}>
              <XCircle className="h-4 w-4" aria-hidden="true" /> Cancel order
            </button>
          )}
          {statusActions.map((s) => (
            <button
              key={s}
              type="button"
              disabled={!!busy}
              className={s === 'cancelled' ? 'btn-danger-outline' : 'btn-primary'}
              onClick={() => run(s, () => ordersApi.setStatus(order.id, s), `Order marked as ${STATUS_LABELS[s].toLowerCase()}`)}
            >
              {busy === s ? <><Spinner /> Updating...</> : ACTION_LABELS[s]}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_320px]">
        {/* Items */}
        <section className="card p-6">
          <h2 className="font-semibold">
            Items from <Link to={`/restaurants/${order.restaurant}`} className="text-brand-600 hover:underline">{order.restaurant_name}</Link>
          </h2>
          <ul className="mt-4 divide-y divide-gray-100">
            {order.order_items.map((i) => (
              <li key={i.id} className="flex items-center gap-4 py-3">
                <SmartImage src={i.image} alt={i.name} rounded="rounded-xl" className="h-14 w-14 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900">{i.name}</p>
                  <p className="text-sm text-gray-500">{i.quantity} × {formatPrice(i.price)}</p>
                </div>
                <span className="font-semibold text-gray-900">{formatPrice(i.subtotal)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-2 flex justify-between border-t border-gray-100 pt-4 text-lg font-semibold text-gray-900">
            <span>Total</span><span>{formatPrice(order.total)}</span>
          </div>
        </section>

        {/* Delivery & payment */}
        <aside className="space-y-4">
          <div className="card space-y-3 p-5 text-sm">
            <h3 className="font-semibold">Delivery</h3>
            <p className="flex gap-2.5 text-gray-700">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" aria-hidden="true" />
              <span><span className="block font-medium capitalize text-gray-900">{order.address?.label}</span>{formatAddress(order.address)}</span>
            </p>
            {role !== 'customer' && (
              <p className="flex items-center gap-2.5 text-gray-700"><UserRound className="h-4 w-4 text-gray-400" aria-hidden="true" />{usernameOf(order.customer)}</p>
            )}
            <p className="flex items-center gap-2.5 text-gray-700"><Bike className="h-4 w-4 text-gray-400" aria-hidden="true" />{order.rider ? usernameOf(order.rider) : 'Rider not assigned yet'}</p>
          </div>
          {payment && (
            <div className="card p-5 text-sm">
              <h3 className="font-semibold">Payment</h3>
              <div className="mt-3 flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-700"><PayIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />{payment.method === 'card' ? 'Card' : 'Cash on delivery'}</span>
                <StatusBadge status={payment.status} />
              </div>
              <div className="mt-3 space-y-1 text-gray-500">
                <p className="flex justify-between"><span>Amount</span><span className="font-medium text-gray-900">{formatPrice(payment.amount)}</span></p>
                {payment.paid_at && <p className="flex justify-between"><span>Paid</span><span>{formatDate(payment.paid_at)}</span></p>}
              </div>
              {payment.status === 'refunded' && (
                <p className="mt-3 flex gap-2 rounded-xl bg-teal-50 p-3 text-teal-800">
                  <RotateCcw className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  This order was cancelled and the card payment of {formatPrice(payment.amount)} has been refunded.
                </p>
              )}
            </div>
          )}
        </aside>
      </div>

      {/* Review (customer, delivered orders) */}
      {canReview && (
        <section className="card mt-6 p-6">
          <h2 className="font-semibold">Your review of {order.restaurant_name}</h2>
          {myReview.loading ? (
            <div className="mt-3 space-y-2"><Skeleton className="h-4 w-28" /><Skeleton className="h-4 w-2/3" /></div>
          ) : myReview.data ? (
            <div className="mt-3">
              <Stars value={myReview.data.rating} />
              {myReview.data.comment && <p className="mt-2 text-sm text-gray-700">{myReview.data.comment}</p>}
              <button type="button" onClick={() => setReviewOpen(true)} className="btn-ghost btn-sm mt-2 -ml-3 text-brand-600">Edit review</button>
            </div>
          ) : (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-gray-500">How was your food? Your review helps others choose.</p>
              <button type="button" onClick={() => setReviewOpen(true)} className="btn-primary"><Star className="h-4 w-4" aria-hidden="true" /> Write a review</button>
            </div>
          )}
        </section>
      )}

      <Modal open={reviewOpen} onClose={() => setReviewOpen(false)} title={`Review ${order.restaurant_name}`} size="max-w-md">
        <ReviewForm
          initial={myReview.data}
          submitLabel={myReview.data ? 'Update review' : 'Submit review'}
          onSubmit={submitReview}
          onCancel={() => setReviewOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        open={confirmCancel}
        title="Cancel this order?"
        message={`The restaurant hasn't confirmed it yet, so you can still cancel.${willRefund ? ` Your card payment of ${formatPrice(payment.amount)} will be refunded.` : ''} This cannot be undone.`}
        confirmLabel="Yes, cancel order"
        danger
        busy={busy === 'cancel'}
        onCancel={() => setConfirmCancel(false)}
        onConfirm={async () => {
          await run('cancel', () => ordersApi.cancel(order.id), (o) => (o.payment?.status === 'refunded' ? 'Order cancelled and payment refunded' : 'Order cancelled'))
          setConfirmCancel(false)
        }}
      />
    </div>
  )
}

function StatusTimeline({ status }) {
  if (status === 'cancelled') {
    return (
      <p className="mt-6 flex items-center gap-2 rounded-2xl bg-gray-100 p-4 text-sm text-gray-600">
        <XCircle className="h-5 w-5 text-gray-400" aria-hidden="true" /> This order was cancelled.
      </p>
    )
  }
  const current = PROGRESS_STEPS.indexOf(status)
  return (
    <ol className="card mt-6 grid grid-cols-5 gap-1 px-2 py-5 sm:px-6">
      {PROGRESS_STEPS.map((step, i) => {
        const done = i <= current
        const Icon = i < current ? Check : STEP_ICONS[step]
        return (
          <li key={step} className="flex flex-col items-center text-center">
            <div className="flex w-full items-center">
              <div className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i === 0 ? 'invisible' : done ? 'bg-brand-500' : 'bg-gray-200'}`} />
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition duration-500 ${done ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-400'} ${i === current ? 'ring-4 ring-brand-100' : ''}`}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i === PROGRESS_STEPS.length - 1 ? 'invisible' : i < current ? 'bg-brand-500' : 'bg-gray-200'}`} />
            </div>
            <span className={`mt-2 text-[11px] leading-tight sm:text-xs ${done ? 'font-semibold text-gray-900' : 'text-gray-400'}`}>{STATUS_LABELS[step]}</span>
          </li>
        )
      })}
    </ol>
  )
}
