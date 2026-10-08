import { Link, Navigate } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'
import PasswordInput from '../components/PasswordInput'
import { useAuth } from '../hooks/useAuth'
import { useLoginForm } from '../hooks/useLoginForm'
import { homeForRole } from '../utils'

export default function LoginPage() {
  const { user } = useAuth()
  const { form, setField, showPassword, toggleShowPassword, error, loading, handleSubmit } = useLoginForm()

  if (user) return <Navigate to={homeForRole(user.role)} replace />

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to order your favourite food">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="username" className="label">
            Username
          </label>
          <input
            id="username"
            className="input"
            autoComplete="username"
            required
            value={form.username}
            onChange={setField('username')}
          />
        </div>
        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            value={form.password}
            onChange={setField('password')}
            show={showPassword}
            onToggle={toggleShowPassword}
          />
        </div>
        <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-500">
        New here?{' '}
        <Link to="/register" className="font-semibold text-brand-600 hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  )
}
