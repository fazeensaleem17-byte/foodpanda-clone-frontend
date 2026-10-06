import { ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react'
import { EmptyState, ErrorState, ListRowsSkeleton, Stars } from '@shared/components/ui'
import { formatShortDate, initialsOf, usernameOf } from '@shared/utils/format'

/**
 * "Ratings & reviews" section at the bottom of the restaurant page.
 * `reviews` comes from useRestaurantReviews(), called by the page so the
 * reviews load in parallel with the menu.
 */
export default function RestaurantReviews({ restaurant, reviews }) {
  return (
    <section className="mt-4 border-t border-gray-200 pt-10" aria-labelledby="reviews-heading">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 id="reviews-heading" className="text-xl font-semibold">
          Ratings & reviews
        </h2>
        {restaurant.review_count > 0 && (
          <div className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold text-gray-900">
              {Number(restaurant.average_rating).toFixed(1)}
            </span>
            <Stars value={restaurant.average_rating} />
            <span className="text-sm text-gray-500">({restaurant.review_count})</span>
          </div>
        )}
      </div>
      {reviews.loading ? (
        <ListRowsSkeleton rows={2} />
      ) : reviews.error ? (
        <ErrorState message={reviews.error} onRetry={reviews.reload} />
      ) : reviews.data.results.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No reviews yet"
          message="Order and be the first to share your experience."
        />
      ) : (
        <>
          <ul className="grid gap-4 md:grid-cols-2">
            {reviews.data.results.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </ul>
          {(reviews.data.next || reviews.data.previous) && (
            <div className="mt-4 flex justify-center gap-2">
              <button
                type="button"
                className="btn-ghost btn-sm"
                disabled={!reviews.data.previous}
                onClick={reviews.showNewer}
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Newer
              </button>
              <button
                type="button"
                className="btn-ghost btn-sm"
                disabled={!reviews.data.next}
                onClick={reviews.showOlder}
              >
                Older <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}

function ReviewCard({ review: r }) {
  return (
    <li className="card p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-600">
            {initialsOf(usernameOf(r.user))}
          </span>
          <div className="leading-tight">
            <p className="font-medium text-gray-900">{usernameOf(r.user)}</p>
            <p className="text-xs text-gray-400">{formatShortDate(r.created_at)}</p>
          </div>
        </div>
        <Stars value={r.rating} size="h-3.5 w-3.5" />
      </div>
      {r.comment && <p className="mt-3 text-sm leading-relaxed text-gray-600">{r.comment}</p>}
    </li>
  )
}
