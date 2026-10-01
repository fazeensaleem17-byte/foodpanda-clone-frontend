import { useState } from 'react'
import { StarInput } from './StarRating'
import { getErrorMessage } from '../utils/errors'

const HINTS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent']

/** Rating + comment form. onSubmit({ rating, comment }) should return a promise. */
export default function ReviewForm({ initial, onSubmit, onCancel, submitLabel = 'Submit review' }) {
  const [rating, setRating] = useState(initial?.rating ?? 0)
  const [comment, setComment] = useState(initial?.comment ?? '')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating) return setError('Please choose a rating.')
    setSaving(true)
    setError('')
    try {
      await onSubmit({ rating, comment: comment.trim() })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600" role="alert">{error}</p>}
      <div className="flex flex-col items-center gap-1">
        <StarInput value={rating} onChange={setRating} />
        <span className="h-5 text-sm font-medium text-gray-600">{HINTS[rating]}</span>
      </div>
      <div>
        <label htmlFor="review-comment" className="label">Comment (optional)</label>
        <textarea id="review-comment" rows={4} className="input" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="What did you like? How was the delivery?" />
      </div>
      <div className="flex justify-end gap-2">
        {onCancel && <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>}
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : submitLabel}</button>
      </div>
    </form>
  )
}
