import { useAuth } from '@features/auth'
import { useAddToCart, useCart } from '@features/cart'
import { useRestaurantReviews } from '@features/reviews'
import { usernameOf } from '@shared/utils/format'
import { useCategoryScrollSpy } from './useCategoryScrollSpy'
import { useRestaurantMenu } from './useRestaurantMenu'

/** Everything the public restaurant page needs: menu, reviews, cart actions and what the viewer may do. */
export function useRestaurantPage(restaurantId) {
  const { user } = useAuth()
  const cart = useCart()
  const menu = useRestaurantMenu(restaurantId)
  const reviews = useRestaurantReviews(restaurantId)

  const restaurant = menu.data?.restaurant ?? null
  // Categories without dishes are hidden from the public page.
  const categories = menu.data?.categories.filter((c) => c.items.length > 0) ?? []
  const scrollSpy = useCategoryScrollSpy(categories)
  const addToCart = useAddToCart(restaurant)

  const isCustomerOrGuest = !user || user.role === 'customer'
  const permissions = restaurant && {
    isOwnerOfThis: user?.role === 'owner' && usernameOf(restaurant.owner) === user.username,
    canOrder: isCustomerOrGuest && restaurant.is_open,
    disabledReason: !restaurant.is_open ? 'Closed' : !isCustomerOrGuest ? 'Customers only' : null,
    showCartPanel: isCustomerOrGuest,
  }

  /** Quantity of a dish in the cart (0 when the cart belongs to another restaurant). */
  const quantityOf = (itemId) => (cart.restaurant?.id === restaurant?.id ? cart.quantityOf(itemId) : 0)

  return {
    menu,
    reviews,
    restaurant,
    categories,
    permissions,
    scrollSpy,
    addToCart,
    quantityOf,
    changeQuantity: cart.updateQuantity,
  }
}
