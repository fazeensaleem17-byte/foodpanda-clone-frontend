import { Hand, PackageOpen } from 'lucide-react'
import { OrderCard } from '@features/orders'
import { EmptyState, ErrorState, OrderListSkeleton, Pagination } from '@shared/components/ui'

/** "Available" tab: orders being prepared that no rider has claimed yet. */
export default function AvailableOrders({ orders, page, busy, onPageChange, onAccept }) {
  const { data, loading, error, reload } = orders

  if (loading) return <OrderListSkeleton count={2} columns={2} />
  if (error) return <ErrorState message={error} onRetry={reload} />
  if (data.results.length === 0) {
    return (
      <EmptyState
        icon={PackageOpen}
        title="No orders waiting"
        message="Orders appear here once a restaurant starts preparing them. This page refreshes automatically."
      />
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {data.results.map((o) => (
          <OrderCard
            key={o.id}
            order={o}
            showCustomer
            actions={
              <button
                type="button"
                className="btn-primary btn-sm"
                disabled={!!busy}
                onClick={() => onAccept(o)}
              >
                {busy === `${o.id}:accept` ? (
                  'Accepting...'
                ) : (
                  <>
                    <Hand className="h-3.5 w-3.5" aria-hidden="true" /> Accept delivery
                  </>
                )}
              </button>
            }
          />
        ))}
      </div>
      <Pagination data={data} page={page} onPageChange={onPageChange} />
    </>
  )
}
