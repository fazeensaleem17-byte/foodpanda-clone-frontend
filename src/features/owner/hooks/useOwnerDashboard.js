import { useState } from 'react'
import toast from 'react-hot-toast'
import { ordersApi } from '@features/orders'
import { restaurantsApi } from '@features/restaurants'
import { useAsync } from '@shared/hooks/useAsync'
import { resultsOf } from '@shared/lib/apiClient'
import { getErrorMessage } from '@shared/utils/errors'

/** The owner's restaurants, the order counters, and create / edit / open-close / delete actions. */
export function useOwnerDashboard() {
  const [editing, setEditing] = useState(null) // null | 'new' | restaurant
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)
  const [togglingId, setTogglingId] = useState(null)

  // GET /restaurants/mine/ (up to 10 - owners rarely have more; paginated otherwise)
  const { data, loading, error, reload } = useAsync(() => restaurantsApi.mine().then(resultsOf), [])
  // Quick stats: orders that need the owner's attention
  const pending = useAsync(() => ordersApi.list({ status: 'pending' }), [])
  const confirmed = useAsync(() => ordersApi.list({ status: 'confirmed' }), [])

  // Text fields + image fields (File = upload as multipart, null = remove, undefined = keep).
  const save = async (payload) => {
    if (editing === 'new') {
      await restaurantsApi.create(payload)
      toast.success('Restaurant created. Now add your menu.')
    } else {
      await restaurantsApi.update(editing.id, payload)
      toast.success('Restaurant updated')
    }
    setEditing(null)
    reload({ silent: true })
  }

  const toggleOpen = async (r) => {
    setTogglingId(r.id)
    try {
      await restaurantsApi.update(r.id, { is_open: !r.is_open })
      toast.success(`${r.name} is now ${r.is_open ? 'closed' : 'open'}`)
      await reload({ silent: true })
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setTogglingId(null)
    }
  }

  const remove = async () => {
    setBusy(true)
    try {
      await restaurantsApi.remove(deleting.id)
      toast.success('Restaurant deleted')
      reload({ silent: true })
    } catch (err) {
      // 409: the restaurant has orders, so it can only be closed.
      toast.error(getErrorMessage(err, 'Could not delete this restaurant.'))
    } finally {
      setBusy(false)
      setDeleting(null)
    }
  }

  return {
    restaurants: data,
    loading,
    error,
    reload,
    pendingCount: pending.data?.count,
    confirmedCount: confirmed.data?.count,
    editing,
    setEditing,
    deleting,
    setDeleting,
    busy,
    togglingId,
    save,
    toggleOpen,
    remove,
  }
}
