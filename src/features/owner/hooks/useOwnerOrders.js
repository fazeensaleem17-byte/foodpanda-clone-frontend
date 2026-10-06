import { useCallback, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { STATUS_LABELS, ordersApi } from '@features/orders'
import { restaurantsApi } from '@features/restaurants'
import { useAsync } from '@shared/hooks/useAsync'
import { usePolling } from '@shared/hooks/usePolling'
import { resultsOf } from '@shared/lib/apiClient'
import { ORDER_POLL_INTERVAL_MS } from '@shared/utils/constants'
import { getErrorMessage } from '@shared/utils/errors'
import { DEFAULT_OWNER_ORDER_TAB } from '../constants'

/**
 * Incoming orders for all of the owner's restaurants.
 * The status and restaurant filters live in the URL (?status=&restaurant=),
 * so the dashboard can link straight to "pending" or "confirmed".
 */
export function useOwnerOrders() {
  const [params, setParams] = useSearchParams()
  const status = params.get('status') ?? DEFAULT_OWNER_ORDER_TAB
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
    () =>
      ordersApi.list({
        page,
        ordering: status === 'pending' ? 'created_at' : '-created_at',
        ...(status && { status }),
        ...(restaurant && { restaurant }),
      }),
    [status, restaurant, page],
  )

  // Refresh silently so new orders show up without reloading.
  const silentReload = useCallback(() => reload({ silent: true }), [reload])
  usePolling(silentReload, ORDER_POLL_INTERVAL_MS)

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

  return {
    data,
    loading,
    error,
    reload,
    restaurants: restaurants.data || [],
    status,
    restaurant,
    setStatusFilter: (value) => setFilter('status', value),
    setRestaurantFilter: (value) => setFilter('restaurant', value),
    page,
    setPage,
    busy,
    changeStatus,
  }
}
