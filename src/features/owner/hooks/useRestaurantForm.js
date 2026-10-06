import { useState } from 'react'
import { getErrorMessage, getFieldErrors } from '@shared/utils/errors'

const EMPTY_RESTAURANT = { name: '', description: '', city: '', address: '', phone: '', is_open: true }

/**
 * Form state for creating / editing a restaurant, including cover photo and logo.
 * onSubmit(payload) should return a promise. Image fields are
 * File (upload) | null (remove) | undefined (leave unchanged).
 */
export function useRestaurantForm({ initial, onSubmit }) {
  const [form, setForm] = useState(() => {
    const src = { ...EMPTY_RESTAURANT, ...initial }
    return {
      name: src.name,
      description: src.description,
      city: src.city,
      address: src.address,
      phone: src.phone,
      is_open: src.is_open,
    }
  })
  const [image, setImage] = useState(undefined)
  const [logo, setLogo] = useState(undefined)
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
        ...form,
        name: form.name.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
        image,
        logo,
      })
    } catch (err) {
      const fields = getFieldErrors(err)
      setErrors(Object.keys(fields).length ? fields : { form: getErrorMessage(err) })
    } finally {
      setSaving(false)
    }
  }

  return { form, setField, image, setImage, logo, setLogo, errors, setErrors, saving, handleSubmit }
}
