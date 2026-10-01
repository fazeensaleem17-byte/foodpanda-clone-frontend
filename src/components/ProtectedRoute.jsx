import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PageSkeleton } from './Skeletons'

/**
 * Guards a group of routes.
 *  - Not logged in      -> redirect to /login (remembering where the user wanted to go)
 *  - Wrong role         -> redirect to that role's home page
 *  - Otherwise          -> render the nested route (<Outlet />)
 *
 * Usage: <Route element={<ProtectedRoute roles={['owner']} />}> ...child routes... </Route>
 */
export default function ProtectedRoute({ roles, children }) {
  const { user, initializing, loggedOut } = useAuth()
  const location = useLocation()

  // Wait for the session restore (GET /auth/me/) before deciding.
  if (initializing) return <PageSkeleton />

  // Explicit logout -> home page; otherwise (never logged in / session expired) -> login.
  if (!user) return loggedOut ? <Navigate to="/" replace /> : <Navigate to="/login" replace state={{ from: location }} />

  if (roles && !roles.includes(user.role)) return <Navigate to={homeForRole(user.role)} replace />

  return children ?? <Outlet />
}

export function homeForRole(role) {
  if (role === 'owner') return '/owner'
  if (role === 'rider') return '/rider'
  return '/'
}
