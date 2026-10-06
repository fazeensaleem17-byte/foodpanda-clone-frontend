import { StarInput } from '@shared/components/ui'
import { RATING_HINTS } from '../constants'
import { useReviewForm } from '../hooks/useReviewForm'

/** Rating + comment form. onSubmit({ rating, comment }) should return a promise. */
export default function ReviewForm({ initial, onSubmit, onCancel, submitLabel = 'Submit review' }) {
  const { rating, setRating, comment, setComment, error, saving, handleSubmit } = useReviewForm({
    initial,
    onSubmit,
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <div className="flex flex-col items-center gap-1">
        <StarInput value={rating} onChange={setRating} />
        <span className="h-5 text-sm font-medium text-gray-600">{RATING_HINTS[rating]}</span>
      </div>
      <div>
        <label htmlFor="review-comment" className="label">
          Comment (optional)
        </label>
        <textarea
          id="review-comment"
          rows={4}
          className="input"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you like? How was the delivery?"
        />
      </div>
      <div className="flex justify-end gap-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-ghost">
            Cancel
          </button>
        )}
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
