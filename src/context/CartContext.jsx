import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'fp_cart'
const MAX_QTY = 50 // the backend rejects quantities above 50

const emptyCart = { restaurant: null, items: [] }

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (saved && Array.isArray(saved.items)) return saved
  } catch {
    /* corrupted storage -> start fresh */
  }
  return emptyCart
}

/**
 * CartContext keeps the shopping cart in memory and in localStorage
 * (so it survives page reloads).
 *
 * Shape: {
 *   restaurant: { id, name, city, is_open, logo } | null,
 *   items: [{ id, name, price, image, quantity }]   // id = menu item id
 * }
 *
 * RULE: an order belongs to ONE restaurant (the backend rejects items from
 * other restaurants), so the cart can only hold items from one restaurant.
 * addItem() returns { conflict: true } instead of mixing restaurants; the
 * page then asks the user whether to clear the cart and start a new one
 * (calling addItem again with { replace: true }).
 */
export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  const addItem = useCallback(
    (item, restaurant, { replace = false } = {}) => {
      if (cart.restaurant && cart.restaurant.id !== restaurant.id && cart.items.length && !replace) {
        return { conflict: true, currentRestaurant: cart.restaurant }
      }
      setCart((prev) => {
        const base = prev.restaurant?.id === restaurant.id ? prev : emptyCart
        const existing = base.items.find((i) => i.id === item.id)
        const items = existing
          ? base.items.map((i) => (i.id === item.id ? { ...i, quantity: Math.min(i.quantity + 1, MAX_QTY) } : i))
          : [...base.items, { id: item.id, name: item.name, price: item.price, image: item.image ?? null, quantity: 1 }]
        return {
          restaurant: { id: restaurant.id, name: restaurant.name, city: restaurant.city, is_open: restaurant.is_open, logo: restaurant.logo ?? null },
          items,
        }
      })
      return { conflict: false }
    },
    [cart],
  )

  const updateQuantity = useCallback((itemId, quantity) => {
    setCart((prev) => {
      const items = quantity <= 0
        ? prev.items.filter((i) => i.id !== itemId)
        : prev.items.map((i) => (i.id === itemId ? { ...i, quantity: Math.min(quantity, MAX_QTY) } : i))
      return items.length ? { ...prev, items } : emptyCart
    })
  }, [])

  const removeItem = useCallback((itemId) => updateQuantity(itemId, 0), [updateQuantity])
  const clearCart = useCallback(() => setCart(emptyCart), [])

  const value = useMemo(() => {
    const count = cart.items.reduce((sum, i) => sum + i.quantity, 0)
    // Display total only - the server recalculates the real total from menu prices.
    const total = cart.items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0)
    const quantityOf = (id) => cart.items.find((i) => i.id === id)?.quantity ?? 0
    return { ...cart, count, total, quantityOf, addItem, updateQuantity, removeItem, clearCart, MAX_QTY }
  }, [cart, addItem, updateQuantity, removeItem, clearCart])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
