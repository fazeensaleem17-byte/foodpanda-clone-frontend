import { useState } from 'react'
import { getErrorMessage, getFieldErrors } from '@shared/utils/errors'

/**
 * Form state for creating / editing a dish, including its photo.
 * `initial` is an existing item, or { categoryId } for a new dish in that category.
 * The image is File (upload) | null (remove) | undefined (leave unchanged).
 */
export function useMenuItemForm({ initial, categories, onSubmit }) {
  const [form, setForm] = useState({
    name: initial.name ?? '',
    description: initial.description ?? '',
    price: initial.price ?? '',
    category: initial.category ?? initial.categoryId ?? categories[0]?.id,
    is_available: initial.is_available ?? true,
  })
  const [image, setImage] = useState(undefined)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const setField = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      await onSubmit({
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price).toFixed(2),
        category: Number(form.category),
        is_available: form.is_available,
        image,
      })
    } catch (err) {
      const fields = getFieldErrors(err)
      setErrors(Object.keys(fields).length ? fields : { form: getErrorMessage(err) })
    } finally {
      setSaving(false)
    }
  }

  return { form, setField, image, setImage, errors, setErrors, saving, handleSubmit }
}
