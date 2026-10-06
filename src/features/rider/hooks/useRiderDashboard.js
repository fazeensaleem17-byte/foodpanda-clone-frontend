import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { ordersApi } from '@features/orders'
import { useAsync } from '@shared/hooks/useAsync'
import { usePolling } from '@shared/hooks/usePolling'
import { ORDER_POLL_INTERVAL_MS } from '@shared/utils/constants'
import { getErrorMessage } from '@shared/utils/errors'
import { DEFAULT_RIDER_TAB } from '../constants'

/**
 * Rider flow:
 *   Available  -> GET /orders/available/  ('preparing' orders with no rider)  -> Accept (POST /accept/)
 *   My active  -> GET /orders/?status=preparing|on_the_way  (assigned to me)
 *                 preparing -> on_the_way -> delivered  (POST /status/)
 *   Delivered  -> GET /orders/?status=delivered
 */
export function useRiderDashboard() {
  const [tab, setTab] = useState(DEFAULT_RIDER_TAB)
  const [page, setPage] = useState(1)
  const [busy, setBusy] = useState(null)

  const availablePage = tab === 'available' ? page : 1
  const available = useAsync(() => ordersApi.available({ page: availablePage }), [availablePage])
  // Active = my orders that are preparing (accepted, waiting pickup) or on the way.
  const active = useAsync(async () => {
    const [prep, onTheWay] = await Promise.all([
      ordersApi.list({ status: 'preparing' }),
      ordersApi.list({ status: 'on_the_way' }),
    ])
    return [...onTheWay.results, ...prep.results]
  }, [])
  const history = useAsync(
    () =>
      tab === 'history'
        ? ordersApi.list({ status: 'delivered', ordering: '-created_at', page })
        : Promise.resolve(null),
    [tab, page],
  )

  const reloadAvailable = available.reload
  const reloadActive = active.reload
  const refreshAll = useCallback(() => {
    reloadAvailable({ silent: true })
    reloadActive({ silent: true })
  }, [reloadAvailable, reloadActive])
  usePolling(refreshAll, ORDER_POLL_INTERVAL_MS)

  const switchTab = (key) => {
    setTab(key)
    setPage(1)
  }

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
      toast.success(
        next === 'delivered' ? `Order #${order.id} delivered` : `Order #${order.id} is on the way`,
      )
      refreshAll()
      if (tab === 'history') history.reload({ silent: true })
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setBusy(null)
    }
  }

  return {
    tab,
    switchTab,
    page,
    setPage,
    busy,
    available,
    active,
    history,
    counts: { available: available.data?.count, active: active.data?.length },
    hasPreparingOrders: Boolean(active.data?.some((o) => o.status === 'preparing')),
    refresh: () => {
      refreshAll()
      history.reload({ silent: true })
    },
    accept,
    changeStatus,
  }
}
