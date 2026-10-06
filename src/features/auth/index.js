// Public API of the auth feature. Other features import from '@features/auth' only.
export { authApi } from './api/authApi'
export { AuthProvider } from './context/AuthProvider'
export { useAuth } from './hooks/useAuth'
export { default as ProtectedRoute } from './components/ProtectedRoute'
export { default as LoginPage } from './pages/LoginPage'
export { default as RegisterPage } from './pages/RegisterPage'
export { default as ProfilePage } from './pages/ProfilePage'
export { homeForRole } from './utils'
