import { ConfirmDialog } from '@shared/components/ui'
import { useCart } from '../hooks/useCart'

/** Asks whether to clear the cart when adding a dish from a different restaurant. */
export default function ReplaceCartDialog({ pendingItem, restaurant, onConfirm, onCancel }) {
  const cart = useCart()
  return (
    <ConfirmDialog
      open={!!pendingItem}
      title="Start a new cart?"
      message={`Your cart already has items from ${cart.restaurant?.name}. An order can only contain items from one restaurant. Clear your cart and add ${pendingItem?.name} from ${restaurant.name}?`}
      confirmLabel="Clear cart and add"
      danger
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  )
}
