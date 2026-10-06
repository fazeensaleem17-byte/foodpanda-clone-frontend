import { useState } from 'react'
import toast from 'react-hot-toast'
import { useCart } from './useCart'

/**
 * "Add to cart" for one restaurant's menu.
 *
 * The cart refuses to mix restaurants and reports a conflict instead. In that
 * case the item is parked in `pendingItem` so the page can show
 * <ReplaceCartDialog>; confirmReplace() then clears the cart and adds it.
 */
export function useAddToCart(restaurant) {
  const cart = useCart()
  const [pendingItem, setPendingItem] = useState(null) // item waiting for "replace cart?" confirmation

  const addItem = (item) => {
    const result = cart.addItem(item, restaurant)
    if (result.conflict) setPendingItem(item)
    else toast.success(`${item.name} added to cart`)
  }

  const confirmReplace = () => {
    cart.addItem(pendingItem, restaurant, { replace: true })
    toast.success(`Started a new cart from ${restaurant.name}`)
    setPendingItem(null)
  }

  const cancelReplace = () => setPendingItem(null)

  return { addItem, pendingItem, confirmReplace, cancelReplace }
}
