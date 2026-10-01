import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { Bike, CircleCheck, Hand, History, Package, PackageOpen, RefreshCw } from 'lucide-react'
import { ordersApi } from '../../api/orders'
import { useAsync } from '../../hooks/useAsync'
import { usePolling } from '../../hooks/usePolling'
import { useAuth } from '../../context/AuthContext'
import { OrderListSkeleton } from '../../components/Skeletons'
import OrderCard from '../../components/OrderCard'
import Pagination from '../../components/Pagination'
import { EmptyState, ErrorState } from '../../components/StateMessages'
import { getErrorMessage } from '../../utils/errors'
import { ACTION_LABELS, STATUS_LABELS, nextStatuses } from '../../utils/orderStatus'

const TABS = [
  { key: 'available', label: 'Available', icon: Package },
  { key: 'active', label: 'My active', icon: Bike },
  { key: 'history', label: 'Delivered', icon: CircleCheck },
]

/**
 * Rider flow:
 *   Available  -> GET /orders/available/  ('preparing' orders with no rider)  -> Accept (POST /accept/)
 *   My active  -> GET /orders/?status=preparing|on_the_way  (assigned to me)
 *                 preparing -> on_the_way -> delivered  (POST /status/)
 *   Delivered  -> GET /orders/?status=delivered
 */
export default function RiderDashboard() {
  const { user } = useAuth()
  const [tab, setTab] = useState('available')
  const [page, setPage] = useState(1)
  const [busy, setBusy] = useState(null)

  const available = useAsync(() => ordersApi.available({ page: tab === 'available' ? page : 1 }), [tab === 'available' ? page : 1])
  // Active = my orders that are preparing (accepted, waiting pickup) or on the way.
  const active = useAsync(async () => {
    const [prep, onTheWay] = await Promise.all([
      ordersApi.list({ status: 'preparing' }),
      ordersApi.list({ status: 'on_the_way' }),
    ])
    return [...onTheWay.results, ...prep.results]
  }, [])
  const history = useAsync(
    () => (tab === 'history' ? ordersApi.list({ status: 'delivered', ordering: '-created_at', page }) : Promise.resolve(null)),
    [tab, page],
  )

  const refreshAll = useCallback(() => {
    available.reload({ silent: true })
    active.reload({ silent: true })
  }, [available.reload, active.reload])
  usePolling(refreshAll, 20000)

  const switchTab = (key) => { setTab(key); setPage(1) }

  const accept = async (order) => {
    setBusy(`${order.id}:accept`)
    try {
      await ordersApi.accept(order.id)
      toast.success(`Order #${order.id} accepted! Pick it up from ${order.restaurant_name}.`)
      refreshAll()
      setTab('active')
    } catch (err) {
      // Another rider may have claimed it first.
      toast.error(getErrorMessage(err))
      refreshAll()
    } finally {
      setBusy(null)
    }
  }

  const changeStatus = async (order, next) => {
    setBusy(`${order.id}:${next}`)
    try {
      await ordersApi.setStatus(order.id, next)
      toast.success(next === 'delivered' ? `Order #${order.id} delivered` : `Order #${order.id} is on the way`)
      refreshAll()
      if (tab === 'history') history.reload({ silent: true })
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setBusy(null)
    }
  }

  const counts = {
    available: available.data?.count,
    active: active.data?.length,
  }

  let content
  if (tab === 'available') {
    const { data, loading, error, reload } = available
    content = loading ? <OrderListSkeleton count={2} columns={2} /> : error ? <ErrorState message={error} onRetry={reload} /> : data.results.length === 0 ? (
      <EmptyState icon={PackageOpen} title="No orders waiting" message="Orders appear here once a restaurant starts preparing them. This page refreshes automatically." />
    ) : (
      <>
        <div className="grid gap-4 md:grid-cols-2">
          {data.results.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              showCustomer
              actions={
                <button type="button" className="btn-primary btn-sm" disabled={!!busy} onClick={() => accept(o)}>
                  {busy === `${o.id}:accept` ? 'Accepting...' : <><Hand className="h-3.5 w-3.5" aria-hidden="true" /> Accept delivery</>}
                </button>
              }
            />
          ))}
        </div>
        <Pagination data={data} page={page} onPageChange={setPage} />
      </>
    )
  } else if (tab === 'active') {
    const { data, loading, error, reload } = active
    content = loading ? <OrderListSkeleton count={2} columns={2} /> : error ? <ErrorState message={error} onRetry={reload} /> : data.length === 0 ? (
      <EmptyState icon={Bike} title="No active deliveries" message="Accept an order from the Available tab to start delivering." action="See available orders" onAction={() => switchTab('available')} />
    ) : (
      <div className="grid gap-4 md:grid-cols-2">
        {data.map((o) => (
          <OrderCard
            key={o.id}
            order={o}
            showCustomer
            linkTo={`/orders/${o.id}`}
            actions={nextStatuses('rider', o.status).map((s) => (
              <button key={s} type="button" className="btn-primary btn-sm" disabled={!!busy} onClick={() => changeStatus(o, s)}>
                {busy === `${o.id}:${s}` ? 'Updating...' : ACTION_LABELS[s]}
              </button>
            ))}
          />
        ))}
      </div>
    )
  } else {
    const { data, loading, error, reload } = history
    content = loading || !data ? <OrderListSkeleton count={2} columns={2} /> : error ? <ErrorState message={error} onRetry={reload} /> : data.results.length === 0 ? (
      <EmptyState icon={History} title="No deliveries yet" message="Completed deliveries will be listed here." />
    ) : (
      <>
        <div className="grid gap-4 md:grid-cols-2">
          {data.results.map((o) => <OrderCard key={o.id} order={o} showCustomer linkTo={`/orders/${o.id}`} />)}
        </div>
        <Pagination data={data} page={page} onPageChange={setPage} />
      </>
    )
  }

  return (
    <div className="page max-w-5xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Rider dashboard</h1>
          <p className="text-sm text-gray-500">Hi {user.first_name || user.username}! Auto-refreshes every 20 seconds.</p>
        </div>
        <button type="button" onClick={() => { refreshAll(); history.reload({ silent: true }) }} className="btn-outline"><RefreshCw className="h-4 w-4" aria-hidden="true" /> Refresh</button>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-1.5 rounded-2xl border border-gray-100 bg-white p-1.5 shadow-card">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => switchTab(t.key)}
            className={`cursor-pointer rounded-xl px-2 py-2.5 text-sm font-semibold transition ${tab === t.key ? 'bg-brand-500 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <t.icon className="mr-1.5 inline h-4 w-4 align-[-3px]" aria-hidden="true" /><span className="hidden sm:inline">{t.label}</span><span className="sm:hidden">{t.label.replace('My ', '')}</span>
            {counts[t.key] > 0 && (
              <span className={`ml-1.5 rounded-full px-1.5 text-xs ${tab === t.key ? 'bg-white/25' : 'bg-brand-100 text-brand-600'}`}>{counts[t.key]}</span>
            )}
          </button>
        ))}
      </div>

      {tab === 'active' && active.data?.some((o) => o.status === 'preparing') && (
        <p className="mb-4 rounded-xl bg-violet-50 p-3 text-sm text-violet-800">
          Orders still <strong>{STATUS_LABELS.preparing.toLowerCase()}</strong> are being cooked — mark them "on the way" once you pick them up.
        </p>
      )}

      {content}
    </div>
  )
}
