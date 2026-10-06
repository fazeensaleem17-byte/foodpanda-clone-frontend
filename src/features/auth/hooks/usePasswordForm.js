import { useState } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage, getFieldErrors } from '@shared/utils/errors'
import { authApi } from '../api/authApi'

const EMPTY_FORM = { old_password: '', new_password: '', confirm: '' }

/** State and submit logic for the "Change password" form. */
export function usePasswordForm() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const setField = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.new_password !== form.confirm) return setErrors({ confirm: 'Passwords do not match.' })
    setSaving(true)
    setErrors({})
    try {
      await authApi.changePassword(form.old_password, form.new_password)
      toast.success('Password changed')
      setForm(EMPTY_FORM)
    } catch (err) {
      const fields = getFieldErrors(err)
      setErrors(Object.keys(fields).length ? fields : { form: getErrorMessage(err) })
    } finally {
      setSaving(false)
    }
  }

  return { form, setField, errors, saving, handleSubmit }
}
