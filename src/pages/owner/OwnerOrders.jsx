import { useCallback, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Inbox, RefreshCw } from 'lucide-react'
import { ordersApi } from '../../api/orders'
import { restaurantsApi } from '../../api/restaurants'
import { resultsOf } from '../../api/client'
import { useAsync } from '../../hooks/useAsync'
import { usePolling } from '../../hooks/usePolling'
import { OrderListSkeleton } from '../../components/Skeletons'
import OrderCard from '../../components/OrderCard'
import Pagination from '../../components/Pagination'
import { EmptyState, ErrorState } from '../../components/StateMessages'
import { getErrorMessage } from '../../utils/errors'
import { ACTION_LABELS, STATUS_LABELS, nextStatuses } from '../../utils/orderStatus'

const TABS = ['pending', 'confirmed', 'preparing', 'on_the_way', 'delivered', 'cancelled', '']

/** Owner: incoming orders for all my restaurants, with the next valid status buttons. */
export default function OwnerOrders() {
  const [params, setParams] = useSearchParams()
  const status = params.get('status') ?? 'pending'
  const restaurant = params.get('restaurant') ?? ''
  const [page, setPage] = useState(1)
  const [busy, setBusy] = useState(null) // `${orderId}:${status}`

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params)
    next.set(key, value)
    setParams(next, { replace: true })
    setPage(1)
  }

  const restaurants = useAsync(() => restaurantsApi.mine().then(resultsOf), [])
  // GET /orders/ - for owners the backend returns only orders of their restaurants
  const { data, loading, error, reload } = useAsync(
    () => ordersApi.list({ page, ordering: status === 'pending' ? 'created_at' : '-created_at', ...(status && { status }), ...(restaurant && { restaurant }) }),
    [status, restaurant, page],
  )

  // Refresh silently every 20 seconds so new orders show up without reloading.
  const silentReload = useCallback(() => reload({ silent: true }), [reload])
  usePolling(silentReload, 20000)

  const changeStatus = async (order, next) => {
    setBusy(`${order.id}:${next}`)
    try {
      await ordersApi.setStatus(order.id, next)
      toast.success(`Order #${order.id} → ${STATUS_LABELS[next]}`)
      await silentReload()
    } catch (err) {
      toast.error(getErrorMessage(err))
      silentReload()
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="page max-w-5xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Incoming orders</h1>
          <p className="text-sm text-gray-500">Auto-refreshes every 20 seconds.</p>
        </div>
        <div className="flex gap-2">
          <select value={restaurant} onChange={(e) => setFilter('restaurant', e.target.value)} className="input w-auto cursor-pointer" aria-label="Filter by restaurant">
            <option value="">All my restaurants</option>
            {(restaurants.data || []).map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
          <button type="button" onClick={() => reload()} className="btn-outline px-3" aria-label="Refresh"><RefreshCw className="h-4 w-4" aria-hidden="true" /></button>
        </div>
      </div>

      <div className="scrollbar-none -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1">
        {TABS.map((s) => (
          <button
            key={s || 'all'}
            type="button"
            onClick={() => setFilter('status', s)}
            className={`chip ${status === s ? 'chip-active' : 'chip-idle'}`}
          >
            {s ? STATUS_LABELS[s] : 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <OrderListSkeleton count={4} columns={2} />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data.results.length === 0 ? (
        <EmptyState icon={Inbox} title={status ? `No ${STATUS_LABELS[status].toLowerCase()} orders` : 'No orders yet'} message="New orders will appear here automatically." />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {data.results.map((o) => {
              const actions = nextStatuses('owner', o.status)
              return (
                <OrderCard
                  key={o.id}
                  order={o}
                  showCustomer
                  showRider={['preparing', 'on_the_way', 'delivered'].includes(o.status)}
                  linkTo={`/orders/${o.id}`}
                  actions={
                    actions.length > 0
                      ? actions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          disabled={!!busy}
                          onClick={() => changeStatus(o, s)}
                          className={s === 'cancelled' ? 'btn-ghost btn-sm text-red-500' : 'btn-primary btn-sm'}
                        >
                          {busy === `${o.id}:${s}` ? 'Updating...' : ACTION_LABELS[s]}
                        </button>
                      ))
                      : o.status === 'preparing' && !o.rider && <span className="text-xs text-gray-500">Waiting for a rider to accept</span>
                  }
                />
              )
            })}
          </div>
          <Pagination data={data} page={page} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}
