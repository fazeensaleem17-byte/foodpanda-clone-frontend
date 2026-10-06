import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { setAuthFailureHandler } from '@shared/lib/apiClient'
import { tokenStore } from '@shared/lib/tokenStorage'
import { authApi } from '../api/authApi'
import { AuthContext } from './AuthContext'

/**
 * AuthProvider holds the logged-in user for the whole app (read it with useAuth()).
 *
 * Flow:
 *  1. On app start, if an access/refresh token is in localStorage we call
 *     GET /auth/me/ to load the user. (If the access token has expired the
 *     axios interceptor refreshes it transparently first.)
 *  2. login(): POST /auth/login/ -> save tokens -> GET /auth/me/ (login only
 *     returns tokens, not the user, so we need a second call for the role).
 *  3. register(): POST /auth/register/ returns both user and tokens.
 *  4. logout(): clear tokens + user. The interceptor also calls this through
 *     setAuthFailureHandler when a token refresh fails.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // true until the initial /auth/me/ check finishes, so ProtectedRoute
  // doesn't redirect to /login while we are still restoring the session.
  const [initializing, setInitializing] = useState(true)
  // true after the user clicks "Log out" (vs. a session that expired), so
  // ProtectedRoute sends them home instead of to the login page.
  const [loggedOut, setLoggedOut] = useState(false)
  const userRef = useRef(null)
  userRef.current = user

  const logout = useCallback((message) => {
    tokenStore.clear()
    setLoggedOut(true)
    setUser(null)
    if (message) toast.success(message)
  }, [])

  // Let the axios interceptor log us out when the refresh token is rejected.
  useEffect(() => {
    setAuthFailureHandler(() => {
      if (userRef.current) {
        setUser(null)
        toast.error('Your session has expired. Please log in again.')
      }
    })
  }, [])

  // Restore the session on first load.
  useEffect(() => {
    let cancelled = false
    async function restore() {
      if (!tokenStore.getAccess() && !tokenStore.getRefresh()) {
        setInitializing(false)
        return
      }
      try {
        const me = await authApi.me()
        if (!cancelled) setUser(me)
      } catch {
        tokenStore.clear()
      } finally {
        if (!cancelled) setInitializing(false)
      }
    }
    restore()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (username, password) => {
    const tokens = await authApi.login(username, password)
    tokenStore.set(tokens)
    const me = await authApi.me()
    setLoggedOut(false)
    setUser(me)
    return me
  }, [])

  const register = useCallback(async (payload) => {
    const { user: newUser, tokens } = await authApi.register(payload)
    tokenStore.set(tokens)
    setLoggedOut(false)
    setUser(newUser)
    return newUser
  }, [])

  const updateProfile = useCallback(async (payload) => {
    const updated = await authApi.updateMe(payload)
    setUser(updated)
    return updated
  }, [])

  const value = useMemo(
    () => ({
      user,
      role: user?.role ?? null,
      isAuthenticated: !!user,
      initializing,
      loggedOut,
      login,
      register,
      logout,
      updateProfile,
    }),
    [user, initializing, loggedOut, login, register, logout, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
