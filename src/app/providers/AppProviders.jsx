import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '@features/auth'
import { CartProvider } from '@features/cart'

/**
 * All app-wide providers in one place, outermost first:
 * router -> auth (current user) -> cart.
 */
export default function AppProviders({ children }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
