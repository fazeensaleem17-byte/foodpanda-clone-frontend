import { useState } from 'react'
import { useAsync } from '@shared/hooks/useAsync'
import { ordersApi } from '../api/ordersApi'

/**
 * The logged-in customer's orders, newest first, with a status filter and paging.
 * GET /orders/ - the backend scopes the list by role, so customers only get their own.
 */
export function useMyOrders() {
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)

  const { data, loading, error, reload } = useAsync(
    () => ordersApi.list({ page, ordering: '-created_at', ...(status && { status }) }),
    [status, page],
  )

  const changeStatus = (next) => {
    setStatus(next)
    setPage(1)
  }

  return { data, loading, error, reload, status, changeStatus, page, setPage }
}
