import { Inbox, RefreshCw } from 'lucide-react'
import { OrderCard, STATUS_LABELS, StatusFilterTabs } from '@features/orders'
import { EmptyState, ErrorState, OrderListSkeleton, Pagination } from '@shared/components/ui'
import OwnerOrderActions from '../components/OwnerOrderActions'
import { OWNER_ORDER_TABS, STATUSES_WITH_RIDER } from '../constants'
import { useOwnerOrders } from '../hooks/useOwnerOrders'

/** Owner: incoming orders for all my restaurants, with the next valid status buttons. */
export default function OwnerOrdersPage() {
  const orders = useOwnerOrders()
  const { data, loading, error, reload, status } = orders

  return (
    <div className="page max-w-5xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Incoming orders</h1>
          <p className="text-sm text-gray-500">Auto-refreshes every 20 seconds.</p>
        </div>
        <div className="flex gap-2">
          <select
            value={orders.restaurant}
            onChange={(e) => orders.setRestaurantFilter(e.target.value)}
            className="input w-auto cursor-pointer"
            aria-label="Filter by restaurant"
          >
            <option value="">All my restaurants</option>
            {orders.restaurants.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          <button type="button" onClick={() => reload()} className="btn-outline px-3" aria-label="Refresh">
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <StatusFilterTabs statuses={OWNER_ORDER_TABS} value={status} onChange={orders.setStatusFilter} />

      {loading ? (
        <OrderListSkeleton count={4} columns={2} />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data.results.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={status ? `No ${STATUS_LABELS[status].toLowerCase()} orders` : 'No orders yet'}
          message="New orders will appear here automatically."
        />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {data.results.map((o) => (
              <OrderCard
                key={o.id}
                order={o}
                showCustomer
                showRider={STATUSES_WITH_RIDER.includes(o.status)}
                linkTo={`/orders/${o.id}`}
                actions={
                  <OwnerOrderActions order={o} busy={orders.busy} onChangeStatus={orders.changeStatus} />
                }
              />
            ))}
          </div>
          <Pagination data={data} page={orders.page} onPageChange={orders.setPage} />
        </>
      )}
    </div>
  )
}
