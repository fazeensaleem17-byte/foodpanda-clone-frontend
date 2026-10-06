import { Link, Navigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import RolePicker from '../components/RolePicker'
import { useAuth } from '../hooks/useAuth'
import { useRegisterForm } from '../hooks/useRegisterForm'
import { homeForRole } from '../utils'

export default function RegisterPage() {
  const { user } = useAuth()
  const { form, setField, setRole, errors, loading, handleSubmit } = useRegisterForm()

  if (user) return <Navigate to={homeForRole(user.role)} replace />

  const fieldError = (k) => errors[k] && <p className="mt-1 text-xs text-red-600">{errors[k]}</p>

  return (
    <AuthLayout title="Create your account" subtitle="Join as a customer, restaurant owner or rider">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.form && (
          <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600" role="alert">
            {errors.form}
          </p>
        )}

        <RolePicker value={form.role} onChange={setRole} error={errors.role} />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="first_name" className="label">
              First name
            </label>
            <input
              id="first_name"
              className="input"
              value={form.first_name}
              onChange={setField('first_name')}
            />
          </div>
          <div>
            <label htmlFor="last_name" className="label">
              Last name
            </label>
            <input id="last_name" className="input" value={form.last_name} onChange={setField('last_name')} />
          </div>
        </div>
        <div>
          <label htmlFor="reg-username" className="label">
            Username *
          </label>
          <input
            id="reg-username"
            className="input"
            autoComplete="username"
            required
            value={form.username}
            onChange={setField('username')}
          />
          {fieldError('username')}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input"
              autoComplete="email"
              value={form.email}
              onChange={setField('email')}
            />
            {fieldError('email')}
          </div>
          <div>
            <label htmlFor="phone" className="label">
              Phone
            </label>
            <input
              id="phone"
              className="input"
              autoComplete="tel"
              placeholder="03001234567"
              maxLength={20}
              value={form.phone}
              onChange={setField('phone')}
            />
            {fieldError('phone')}
          </div>
        </div>
        <div>
          <label htmlFor="reg-password" className="label">
            Password *
          </label>
          <input
            id="reg-password"
            type="password"
            className="input"
            autoComplete="new-password"
            required
            value={form.password}
            onChange={setField('password')}
          />
          {errors.password ? (
            fieldError('password')
          ) : (
            <p className="mt-1 text-xs text-gray-400">
              At least 8 characters, not too common or all numbers.
            </p>
          )}
        </div>
        <div>
          <label htmlFor="password2" className="label">
            Confirm password *
          </label>
          <input
            id="password2"
            type="password"
            className="input"
            autoComplete="new-password"
            required
            value={form.password2}
            onChange={setField('password2')}
          />
          {fieldError('password2')}
        </div>
        <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-brand-600 hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}
