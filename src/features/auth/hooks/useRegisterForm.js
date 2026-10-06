import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getErrorMessage, getFieldErrors } from '@shared/utils/errors'
import { homeForRole } from '../utils'
import { useAuth } from './useAuth'

const EMPTY_FORM = {
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  phone: '',
  role: 'customer',
  password: '',
  password2: '',
}

/** State and submit logic for the register page. */
export function useRegisterForm() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const setRole = (role) => setForm((f) => ({ ...f, role }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.password2) {
      setErrors({ password2: 'Passwords do not match.' })
      return
    }
    setErrors({})
    setLoading(true)
    try {
      // POST /auth/register/ returns { user, tokens } so the user is logged in right away.
      const me = await register({ ...form, username: form.username.trim(), email: form.email.trim() })
      toast.success('Account created. Welcome to foodpanda!')
      navigate(homeForRole(me.role), { replace: true })
    } catch (err) {
      const fields = getFieldErrors(err)
      setErrors(Object.keys(fields).length ? fields : { form: getErrorMessage(err) })
    } finally {
      setLoading(false)
    }
  }

  return { form, setField, setRole, errors, loading, handleSubmit }
}
