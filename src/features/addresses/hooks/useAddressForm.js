import { useState } from 'react'
import { getErrorMessage, getFieldErrors } from '@shared/utils/errors'
import { EMPTY_ADDRESS } from '../constants'

/** Form state for creating / editing an address. onSubmit(payload) should return a promise. */
export function useAddressForm({ initial, onSubmit }) {
  const [form, setForm] = useState({ ...EMPTY_ADDRESS, ...initial })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const setField = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
  const setLabel = (label) => setForm((f) => ({ ...f, label }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      const { label, city, area, street, is_default } = form
      await onSubmit({ label, city: city.trim(), area: area.trim(), street: street.trim(), is_default })
    } catch (err) {
      const fields = getFieldErrors(err)
      setErrors(Object.keys(fields).length ? fields : { form: getErrorMessage(err) })
    } finally {
      setSaving(false)
    }
  }

  return { form, setField, setLabel, errors, saving, handleSubmit }
}
