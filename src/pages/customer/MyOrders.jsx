import { useState } from 'react'
import { Receipt, Star } from 'lucide-react'
import { ordersApi } from '../../api/orders'
import { useAsync } from '../../hooks/useAsync'
import OrderCard from '../../components/OrderCard'
import Pagination from '../../components/Pagination'
import { OrderListSkeleton } from '../../components/Skeletons'
import { EmptyState, ErrorState } from '../../components/StateMessages'
import { STATUS_LABELS } from '../../utils/orderStatus'

const FILTERS = ['', 'pending', 'confirmed', 'preparing', 'on_the_way', 'delivered', 'cancelled']

export default function MyOrders() {
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  // GET /orders/ -> only this customer's orders (the backend scopes by role)
  const { data, loading, error, reload } = useAsync(
    () => ordersApi.list({ page, ordering: '-created_at', ...(status && { status }) }),
    [status, page],
  )

  return (
    <div className="page max-w-4xl">
      <h1 className="page-title mb-4">My orders</h1>

      <div className="scrollbar-none -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1">
        {FILTERS.map((s) => (
          <button
            key={s || 'all'}
            type="button"
            onClick={() => { setStatus(s); setPage(1) }}
            className={`chip ${status === s ? 'chip-active' : 'chip-idle'}`}
          >
            {s ? STATUS_LABELS[s] : 'All'}
          </button>
        ))}
      </div>

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
                actions={o.status === 'delivered' && <span className="inline-flex items-center gap-1.5 text-xs text-gray-500"><Star className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" /> Enjoyed it? Leave a review on the order page.</span>}
              />
            ))}
          </div>
          <Pagination data={data} page={page} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
