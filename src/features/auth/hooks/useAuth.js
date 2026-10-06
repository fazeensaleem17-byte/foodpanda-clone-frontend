import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

/** Access the current user and the auth actions from any component. */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
