import { Receipt, Star } from 'lucide-react'
import { EmptyState, ErrorState, OrderListSkeleton, Pagination } from '@shared/components/ui'
import OrderCard from '../components/OrderCard'
import StatusFilterTabs from '../components/StatusFilterTabs'
import { CUSTOMER_STATUS_FILTERS, STATUS_LABELS } from '../constants'
import { useMyOrders } from '../hooks/useMyOrders'

export default function MyOrdersPage() {
  const { data, loading, error, reload, status, changeStatus, page, setPage } = useMyOrders()

  return (
    <div className="page max-w-4xl">
      <h1 className="page-title mb-4">My orders</h1>

      <StatusFilterTabs statuses={CUSTOMER_STATUS_FILTERS} value={status} onChange={changeStatus} />

      {loading ? (
        <OrderListSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data.results.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title={status ? `No ${STATUS_LABELS[status].toLowerCase()} orders` : 'No orders yet'}
          message={status ? 'Try another filter.' : 'When you place an order it will show up here.'}
          action={status ? undefined : 'Browse restaurants'}
          actionTo={status ? undefined : '/'}
        />
      ) : (
        <>
          <div className="space-y-4">
            {data.results.map((o) => (
              <OrderCard
                key={o.id}
                order={o}
                linkTo={`/orders/${o.id}`}
                actions={
                  o.status === 'delivered' && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                      <Star className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" /> Enjoyed it? Leave a
                      review on the order page.
                    </span>
                  )
                }
              />
            ))}
          </div>
          <Pagination data={data} page={page} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
