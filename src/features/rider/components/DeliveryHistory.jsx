import { History } from 'lucide-react'
import { OrderCard } from '@features/orders'
import { EmptyState, ErrorState, OrderListSkeleton, Pagination } from '@shared/components/ui'

/** "Delivered" tab: this rider's completed deliveries. */
export default function DeliveryHistory({ orders, page, onPageChange }) {
  const { data, loading, error, reload } = orders

  if (loading || !data) return <OrderListSkeleton count={2} columns={2} />
  if (error) return <ErrorState message={error} onRetry={reload} />
  if (data.results.length === 0) {
    return (
      <EmptyState
        icon={History}
        title="No deliveries yet"
        message="Completed deliveries will be listed here."
      />
    )
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {data.results.map((o) => (
          <OrderCard key={o.id} order={o} showCustomer linkTo={`/orders/${o.id}`} />
        ))}
      </div>
      <Pagination data={data} page={page} onPageChange={onPageChange} />
    </>
  )
}
