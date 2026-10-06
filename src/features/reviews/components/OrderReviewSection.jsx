import { Star } from 'lucide-react'
import { Modal, Skeleton, Stars } from '@shared/components/ui'
import { useMyReview } from '../hooks/useMyReview'
import ReviewForm from './ReviewForm'

/** "Your review" card on a delivered order: shows the review or invites the customer to write one. */
export default function OrderReviewSection({ restaurantId, restaurantName, userId }) {
  const { review, loading, formOpen, openForm, closeForm, submitReview } = useMyReview({
    restaurantId,
    userId,
  })

  return (
    <>
      <section className="card mt-6 p-6">
        <h2 className="font-semibold">Your review of {restaurantName}</h2>
        {loading ? (
          <div className="mt-3 space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ) : review ? (
          <div className="mt-3">
            <Stars value={review.rating} />
            {review.comment && <p className="mt-2 text-sm text-gray-700">{review.comment}</p>}
            <button type="button" onClick={openForm} className="btn-ghost btn-sm mt-2 -ml-3 text-brand-600">
              Edit review
            </button>
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-500">How was your food? Your review helps others choose.</p>
            <button type="button" onClick={openForm} className="btn-primary">
              <Star className="h-4 w-4" aria-hidden="true" /> Write a review
            </button>
          </div>
        )}
      </section>

      <Modal open={formOpen} onClose={closeForm} title={`Review ${restaurantName}`} size="max-w-md">
        <ReviewForm
          initial={review}
          submitLabel={review ? 'Update review' : 'Submit review'}
          onSubmit={submitReview}
          onCancel={closeForm}
        />
      </Modal>
    </>
  )
}
