import { createContext } from 'react'

/** Holds { user, role, isAuthenticated, initializing, loggedOut, login, register, logout, updateProfile }. */
export const AuthContext = createContext(null)
