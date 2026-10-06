import { CreditCard, XCircle } from 'lucide-react'
import { Spinner } from '@shared/components/ui'
import { formatPrice } from '@shared/utils/format'
import { ACTION_LABELS } from '../constants'

/** "What's next?" bar on the order page: pay, cancel, or move the status forward, depending on the role. */
export default function OrderActions({
  order,
  busy,
  canPay,
  canCancel,
  statusActions,
  onPay,
  onCancel,
  onSetStatus,
}) {
  if (statusActions.length === 0 && !canCancel && !canPay) return null

  return (
    <div className="card mt-6 flex animate-fade-in flex-wrap items-center gap-2 p-4">
      <span className="mr-auto text-sm font-medium text-gray-700">What&apos;s next?</span>
      {canPay && (
        <button type="button" className="btn-primary" disabled={!!busy} onClick={onPay}>
          {busy === 'pay' ? (
            <>
              <Spinner /> Processing...
            </>
          ) : (
            <>
              <CreditCard className="h-4 w-4" aria-hidden="true" /> Pay now {formatPrice(order.total)}
            </>
          )}
        </button>
      )}
      {canCancel && (
        <button type="button" className="btn-danger-outline" disabled={!!busy} onClick={onCancel}>
          <XCircle className="h-4 w-4" aria-hidden="true" /> Cancel order
        </button>
      )}
      {statusActions.map((s) => (
        <button
          key={s}
          type="button"
          disabled={!!busy}
          className={s === 'cancelled' ? 'btn-danger-outline' : 'btn-primary'}
          onClick={() => onSetStatus(s)}
        >
          {busy === s ? (
            <>
              <Spinner /> Updating...
            </>
          ) : (
            ACTION_LABELS[s]
          )}
        </button>
      ))}
    </div>
  )
}
