import { useState } from 'react'
import { getErrorMessage } from '@shared/utils/errors'

/** Rating + comment form state. onSubmit({ rating, comment }) should return a promise. */
export function useReviewForm({ initial, onSubmit }) {
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

  return { rating, setRating, comment, setComment, error, saving, handleSubmit }
}
