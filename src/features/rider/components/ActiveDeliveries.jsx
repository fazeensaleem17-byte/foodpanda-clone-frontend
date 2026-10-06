import { Bike } from 'lucide-react'
import { ACTION_LABELS, OrderCard, nextStatuses } from '@features/orders'
import { EmptyState, ErrorState, OrderListSkeleton } from '@shared/components/ui'

/** "My active" tab: orders this rider accepted, with the next-step button. */
export default function ActiveDeliveries({ orders, busy, onChangeStatus, onSeeAvailable }) {
  const { data, loading, error, reload } = orders

  if (loading) return <OrderListSkeleton count={2} columns={2} />
  if (error) return <ErrorState message={error} onRetry={reload} />
  if (data.length === 0) {
    return (
      <EmptyState
        icon={Bike}
        title="No active deliveries"
        message="Accept an order from the Available tab to start delivering."
        action="See available orders"
        onAction={onSeeAvailable}
      />
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {data.map((o) => (
        <OrderCard
          key={o.id}
          order={o}
          showCustomer
          linkTo={`/orders/${o.id}`}
          actions={nextStatuses('rider', o.status).map((s) => (
            <button
              key={s}
              type="button"
              className="btn-primary btn-sm"
              disabled={!!busy}
              onClick={() => onChangeStatus(o, s)}
            >
              {busy === `${o.id}:${s}` ? 'Updating...' : ACTION_LABELS[s]}
            </button>
          ))}
        />
      ))}
    </div>
  )
}
