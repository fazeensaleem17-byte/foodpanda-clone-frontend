import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { addressesApi, useAddresses } from '@features/addresses'
import { useCart } from '@features/cart'
import { restaurantsApi } from '@features/restaurants'
import { useAsync } from '@shared/hooks/useAsync'
import { getErrorMessage } from '@shared/utils/errors'
import { ordersApi } from '../api/ordersApi'
import { DEFAULT_PAYMENT_METHOD } from '../constants'

/** State and actions for the checkout page: address choice, payment method and placing the order. */
export function useCheckout() {
  const cart = useCart()
  const navigate = useNavigate()
  const [addressId, setAddressId] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState(DEFAULT_PAYMENT_METHOD)
  const [addressFormOpen, setAddressFormOpen] = useState(false)
  const [placing, setPlacing] = useState(false)

  const addresses = useAddresses()
  // Re-check the restaurant is still open (the server refuses orders to closed restaurants).
  const restaurant = useAsync(
    () => (cart.restaurant ? restaurantsApi.get(cart.restaurant.id) : null),
    [cart.restaurant?.id],
  )

  // Pre-select the default address (the API returns it first).
  useEffect(() => {
    if (addresses.data?.length && !addressId) {
      setAddressId((addresses.data.find((a) => a.is_default) || addresses.data[0]).id)
    }
  }, [addresses.data, addressId])

  const addAddress = async (payload) => {
    const created = await addressesApi.create(payload)
    toast.success('Address added')
    setAddressFormOpen(false)
    await addresses.reload({ silent: true })
    setAddressId(created.id)
  }

  /**
   * Place the order:
   *  1. POST /orders/ with restaurant, address, payment method and
   *     [{ menu_item, quantity }]. The SERVER validates everything and
   *     computes the real total from current menu prices.
   *  2. For card payments, immediately call POST /orders/{id}/pay/
   *     (simulated gateway). If that fails the order still exists and the
   *     customer can retry "Pay now" from the order page.
   *  3. Clear the cart and open the order detail page.
   */
  const placeOrder = async () => {
    if (!addressId) return toast.error('Please choose a delivery address.')
    setPlacing(true)
    try {
      const order = await ordersApi.create({
        restaurant: cart.restaurant.id,
        address: addressId,
        payment_method: paymentMethod,
        items: cart.items.map((i) => ({ menu_item: i.id, quantity: i.quantity })),
      })

      if (paymentMethod === 'card') {
        try {
          await ordersApi.pay(order.id)
          toast.success('Card payment successful')
        } catch (err) {
          toast.error(
            `Order placed, but payment failed: ${getErrorMessage(err)} You can retry from the order page.`,
          )
        }
      }

      cart.clearCart()
      toast.success(`Order #${order.id} placed!`)
      navigate(`/orders/${order.id}`, { replace: true })
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not place your order.'))
      setPlacing(false)
    }
  }

  return {
    cart,
    addresses,
    loading: addresses.loading || restaurant.loading,
    isClosed: Boolean(restaurant.data && !restaurant.data.is_open),
    addressId,
    setAddressId,
    paymentMethod,
    setPaymentMethod,
    addressFormOpen,
    openAddressForm: () => setAddressFormOpen(true),
    closeAddressForm: () => setAddressFormOpen(false),
    addAddress,
    placing,
    placeOrder,
  }
}
