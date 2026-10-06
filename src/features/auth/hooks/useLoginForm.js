import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@shared/utils/errors'
import { homeForRole } from '../utils'
import { useAuth } from './useAuth'

/** State and submit logic for the login page. */
export function useLoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const setField = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const fillDemo = (username) => setForm({ username, password: '' })
  const toggleShowPassword = () => setShowPassword((s) => !s)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const me = await login(form.username.trim(), form.password)
      toast.success(`Welcome back, ${me.first_name || me.username}!`)
      // Go back to the page that required login, or the role's home.
      const from = location.state?.from?.pathname
      navigate(from && from !== '/login' ? from : homeForRole(me.role), { replace: true })
    } catch (err) {
      // SimpleJWT returns 401 { detail: "No active account found with the given credentials" }
      setError(err.response?.status === 401 ? 'Incorrect username or password.' : getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return { form, setField, fillDemo, showPassword, toggleShowPassword, error, loading, handleSubmit }
}
