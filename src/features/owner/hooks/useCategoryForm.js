import { useState } from 'react'
import { getErrorMessage } from '@shared/utils/errors'

/** Form state for adding / renaming a menu category. onSubmit(name) should return a promise. */
export function useCategoryForm({ initial, onSubmit }) {
  const [name, setName] = useState(initial)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await onSubmit(name.trim())
    } catch (err) {
      // unique (restaurant, name) -> non_field_errors
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return { name, setName, error, saving, handleSubmit }
}
