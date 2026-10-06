import { ACTION_LABELS, nextStatuses } from '@features/orders'

/** The owner's next-step buttons for one order (only transitions the backend allows). */
export default function OwnerOrderActions({ order, busy, onChangeStatus }) {
  const actions = nextStatuses('owner', order.status)

  if (actions.length === 0) {
    return (
      order.status === 'preparing' &&
      !order.rider && <span className="text-xs text-gray-500">Waiting for a rider to accept</span>
    )
  }

  return actions.map((s) => (
    <button
      key={s}
      type="button"
      disabled={!!busy}
      onClick={() => onChangeStatus(order, s)}
      className={s === 'cancelled' ? 'btn-ghost btn-sm text-red-500' : 'btn-primary btn-sm'}
    >
      {busy === `${order.id}:${s}` ? 'Updating...' : ACTION_LABELS[s]}
    </button>
  ))
}
