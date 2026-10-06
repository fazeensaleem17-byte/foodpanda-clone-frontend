import { useNavigate } from 'react-router-dom'
import { useAuth } from '@features/auth'
import { useCart } from './useCart'

/** Data and actions for the cart page. */
export function useCartPage() {
  const cart = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const goToCheckout = () => {
    // Guests are sent to login and brought back to checkout afterwards.
    if (!user) navigate('/login', { state: { from: { pathname: '/checkout' } } })
    else navigate('/checkout')
  }

  return { cart, user, goToCheckout }
}
