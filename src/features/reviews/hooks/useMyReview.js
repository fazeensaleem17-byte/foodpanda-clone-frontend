import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAsync } from '@shared/hooks/useAsync'
import { resultsOf } from '@shared/lib/apiClient'
import { reviewsApi } from '../api/reviewsApi'

/**
 * The current customer's review of one restaurant (a customer may review a
 * restaurant once, after a delivered order), plus create / update logic.
 */
export function useMyReview({ restaurantId, userId }) {
  const [formOpen, setFormOpen] = useState(false)
  const myReview = useAsync(
    () => reviewsApi.list({ restaurant: restaurantId, user: userId }).then((d) => resultsOf(d)[0] ?? null),
    [restaurantId, userId],
  )

  const submitReview = async (payload) => {
    if (myReview.data) {
      myReview.setData(await reviewsApi.update(myReview.data.id, payload))
      toast.success('Review updated')
    } else {
      myReview.setData(await reviewsApi.create({ restaurant: restaurantId, ...payload }))
      toast.success('Thanks for your review!')
    }
    setFormOpen(false)
  }

  return {
    review: myReview.data,
    loading: myReview.loading,
    formOpen,
    openForm: () => setFormOpen(true),
    closeForm: () => setFormOpen(false),
    submitReview,
  }
}
