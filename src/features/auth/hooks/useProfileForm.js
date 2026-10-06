import { useState } from 'react'
import toast from 'react-hot-toast'
import { getErrorMessage, getFieldErrors } from '@shared/utils/errors'
import { useAuth } from './useAuth'

/** State and submit logic for the "Personal details" form on the profile page. */
export function useProfileForm() {
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || '',
    phone: user.phone || '',
    bio: user.profile?.bio || '',
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const setField = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      // PATCH /auth/me/ - bio lives on the nested profile object
      const { bio, ...fields } = form
      await updateProfile({ ...fields, profile: { bio } })
      toast.success('Profile updated')
    } catch (err) {
      setErrors(getFieldErrors(err))
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return { user, form, setField, errors, saving, handleSubmit }
}
