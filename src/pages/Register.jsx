import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Bike, ShoppingBag, Store } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { homeForRole } from '../components/ProtectedRoute'
import { getErrorMessage, getFieldErrors } from '../utils/errors'
import { AuthLayout } from './Login'

const ROLES = [
  { value: 'customer', icon: ShoppingBag, title: 'Customer', text: 'Order food' },
  { value: 'owner', icon: Store, title: 'Restaurant', text: 'Sell food' },
  { value: 'rider', icon: Bike, title: 'Rider', text: 'Deliver food' },
]

export default function Register() {
  const { register, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '', email: '', first_name: '', last_name: '', phone: '', role: 'customer', password: '', password2: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to={homeForRole(user.role)} replace />

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

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

  const fieldError = (k) => errors[k] && <p className="mt-1 text-xs text-red-600">{errors[k]}</p>

  return (
    <AuthLayout title="Create your account" subtitle="Join as a customer, restaurant owner or rider">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.form && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600" role="alert">{errors.form}</p>}

        <fieldset>
          <legend className="label">I want to...</legend>
          <div className="grid grid-cols-3 gap-2">
            {ROLES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => setForm((f) => ({ ...f, role: r.value }))}
                aria-pressed={form.role === r.value}
                className={`flex cursor-pointer flex-col items-center rounded-2xl border-2 p-3 text-center transition duration-200 ${form.role === r.value ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-brand-200 hover:bg-gray-50'}`}
              >
                <r.icon className={`mb-1.5 h-6 w-6 ${form.role === r.value ? 'text-brand-500' : 'text-gray-400'}`} strokeWidth={1.75} aria-hidden="true" />
                <div className="text-sm font-semibold text-gray-900">{r.title}</div>
                <div className="text-xs text-gray-500">{r.text}</div>
              </button>
            ))}
          </div>
          {fieldError('role')}
        </fieldset>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="first_name" className="label">First name</label>
            <input id="first_name" className="input" value={form.first_name} onChange={set('first_name')} />
          </div>
          <div>
            <label htmlFor="last_name" className="label">Last name</label>
            <input id="last_name" className="input" value={form.last_name} onChange={set('last_name')} />
          </div>
        </div>
        <div>
          <label htmlFor="reg-username" className="label">Username *</label>
          <input id="reg-username" className="input" autoComplete="username" required value={form.username} onChange={set('username')} />
          {fieldError('username')}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="label">Email</label>
            <input id="email" type="email" className="input" autoComplete="email" value={form.email} onChange={set('email')} />
            {fieldError('email')}
          </div>
          <div>
            <label htmlFor="phone" className="label">Phone</label>
            <input id="phone" className="input" autoComplete="tel" placeholder="03001234567" maxLength={20} value={form.phone} onChange={set('phone')} />
            {fieldError('phone')}
          </div>
        </div>
        <div>
          <label htmlFor="reg-password" className="label">Password *</label>
          <input id="reg-password" type="password" className="input" autoComplete="new-password" required value={form.password} onChange={set('password')} />
          {errors.password ? fieldError('password') : <p className="mt-1 text-xs text-gray-400">At least 8 characters, not too common or all numbers.</p>}
        </div>
        <div>
          <label htmlFor="password2" className="label">Confirm password *</label>
          <input id="password2" type="password" className="input" autoComplete="new-password" required value={form.password2} onChange={set('password2')} />
          {fieldError('password2')}
        </div>
        <button type="submit" className="btn-primary w-full py-3" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account? <Link to="/login" className="font-semibold text-brand-600 hover:underline">Log in</Link>
      </p>
    </AuthLayout>
  )
}
