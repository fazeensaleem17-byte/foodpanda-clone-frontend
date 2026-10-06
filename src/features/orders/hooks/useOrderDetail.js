import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '@features/auth'
import { useAsync } from '@shared/hooks/useAsync'
import { getErrorMessage } from '@shared/utils/errors'
import { ordersApi } from '../api/ordersApi'
import { ORDER_BACK_LINKS, STATUS_LABELS, nextStatuses } from '../constants'

/**
 * One order plus the actions the current user may take on it.
 * Shared by customers (cancel / pay / review), owners and riders (move the status forward).
 */
export function useOrderDetail(orderId) {
  const { user } = useAuth()
  const role = user.role
  const [busy, setBusy] = useState(null) // key of the action in progress
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)

  const { data: order, loading, error, reload, setData } = useAsync(() => ordersApi.get(orderId), [orderId])

  // Run an order action, replace the order with the server's response, toast the result.
  const run = async (key, fn, successMsg) => {
    setBusy(key)
    try {
      const updated = await fn()
      setData(updated)
      toast.success(typeof successMsg === 'function' ? successMsg(updated) : successMsg)
    } catch (err) {
      toast.error(getErrorMessage(err))
      reload({ silent: true }) // status may have changed elsewhere
    } finally {
      setBusy(null)
    }
  }

  const payment = order?.payment
  const isCustomer = role === 'customer'

  return {
    user,
    role,
    order,
    loading,
    error,
    reload,
    busy,
    backLink: ORDER_BACK_LINKS[role] ?? ORDER_BACK_LINKS.customer,
    // what this user may do with the order right now
    statusActions: order && !isCustomer ? nextStatuses(role, order.status) : [],
    canCancel: isCustomer && order?.status === 'pending',
    canPay:
      isCustomer &&
      payment?.method === 'card' &&
      payment.status === 'pending' &&
      order.status !== 'cancelled',
    canReview: isCustomer && order?.status === 'delivered',
    // cancelling an order that is already paid refunds the card payment
    willRefund: payment?.status === 'paid',
    // actions
    pay: () => run('pay', () => ordersApi.pay(order.id), 'Payment successful'),
    setStatus: (status) =>
      run(
        status,
        () => ordersApi.setStatus(order.id, status),
        `Order marked as ${STATUS_LABELS[status].toLowerCase()}`,
      ),
    cancelDialogOpen,
    openCancelDialog: () => setCancelDialogOpen(true),
    closeCancelDialog: () => setCancelDialogOpen(false),
    confirmCancel: async () => {
      await run(
        'cancel',
        () => ordersApi.cancel(order.id),
        (o) =>
          o.payment?.status === 'refunded' ? 'Order cancelled and payment refunded' : 'Order cancelled',
      )
      setCancelDialogOpen(false)
    },
  }
}
