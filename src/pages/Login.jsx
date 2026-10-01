import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { homeForRole } from '../components/ProtectedRoute'
import { getErrorMessage } from '../utils/errors'

export default function Login() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to={homeForRole(user.role)} replace />

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

  return (
    <AuthLayout title="Welcome back" subtitle="Log in to order your favourite food">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600" role="alert">{error}</p>}
        <div>
          <label htmlFor="username" className="label">Username</label>
          <input id="username" className="input" autoComplete="username" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
        </div>
        <div>
          <label htmlFor="password" className="label">Password</label>
          <PasswordInput id="password" autoComplete="current-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} show={showPassword} onToggle={() => setShowPassword((s) => !s)} />
        </div>
        <button type="submit" className="btn-primary w-full py-3" disabled={loading}>{loading ? 'Logging in...' : 'Log in'}</button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-500">
        New here? <Link to="/register" className="font-semibold text-brand-600 hover:underline">Create an account</Link>
      </p>
      <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-xs text-gray-600">
        <p className="font-semibold text-gray-700">Demo accounts</p>
        <p className="mt-0.5">Password for all: <code className="rounded bg-white px-1 py-0.5 font-mono text-gray-800 ring-1 ring-gray-200">Demo@12345</code></p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {['demo_customer', 'demo_owner', 'demo_rider', 'demo_rider2'].map((u) => (
            <button key={u} type="button" onClick={() => setForm({ username: u, password: '' })} className="cursor-pointer rounded-full bg-white px-3 py-1 font-medium text-brand-600 ring-1 ring-brand-200 transition hover:bg-brand-50">
              {u}
            </button>
          ))}
        </div>
      </div>
    </AuthLayout>
  )
}

export function PasswordInput({ show, onToggle, ...props }) {
  return (
    <div className="relative">
      <input type={show ? 'text' : 'password'} className="input pr-11" required {...props} />
      <button type="button" onClick={onToggle} className="absolute right-1.5 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-2 text-gray-400 transition hover:text-gray-700" aria-label={show ? 'Hide password' : 'Show password'}>
        {show ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
      </button>
    </div>
  )
}

/** Two-column auth layout: food photo on large screens, form card on the right. */
export function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img src="/images/hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/30 to-transparent" aria-hidden="true" />
        <div className="absolute bottom-0 p-12 text-white">
          <h2 className="font-display text-3xl font-bold text-white">Good food is just a few taps away</h2>
          <p className="mt-2 max-w-md text-white/80">Browse local restaurants, order in minutes and follow your delivery live.</p>
        </div>
      </div>
      <div className="flex items-center justify-center bg-white px-4 py-12 sm:px-8">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8">
            <img src="/favicon.svg" alt="" className="mb-5 h-12 w-12" />
            <h1 className="text-3xl font-bold">{title}</h1>
            {subtitle && <p className="mt-2 text-gray-500">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
