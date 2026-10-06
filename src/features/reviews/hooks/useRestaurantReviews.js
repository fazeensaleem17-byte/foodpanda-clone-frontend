import { useState } from 'react'
import { useAsync } from '@shared/hooks/useAsync'
import { reviewsApi } from '../api/reviewsApi'

/** Paginated reviews of one restaurant, newest first. GET /reviews/?restaurant={id} */
export function useRestaurantReviews(restaurantId) {
  const [page, setPage] = useState(1)
  const reviews = useAsync(
    () => reviewsApi.list({ restaurant: restaurantId, ordering: '-created_at', page }),
    [restaurantId, page],
  )
  return {
    ...reviews,
    showNewer: () => setPage((p) => p - 1),
    showOlder: () => setPage((p) => p + 1),
  }
}
