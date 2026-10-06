import { useContext } from 'react'
import { CartContext } from '../context/CartContext'

/** Access the cart (items, count, total) and its actions from any component. */
export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
