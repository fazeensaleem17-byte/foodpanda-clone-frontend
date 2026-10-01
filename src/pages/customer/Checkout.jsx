import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Banknote, Briefcase, Check, CreditCard, Home, MapPin, Plus } from 'lucide-react'
import { addressesApi } from '../../api/addresses'
import { ordersApi } from '../../api/orders'
import { restaurantsApi } from '../../api/restaurants'
import { resultsOf } from '../../api/client'
import { useAsync } from '../../hooks/useAsync'
import { useCart } from '../../context/CartContext'
import AddressForm from '../../components/AddressForm'
import { Spinner } from '../../components/Loader'
import Modal from '../../components/Modal'
import SmartImage from '../../components/SmartImage'
import { DetailSkeleton } from '../../components/Skeletons'
import { ErrorState } from '../../components/StateMessages'
import { formatAddress, formatPrice } from '../../utils/format'
import { getErrorMessage } from '../../utils/errors'

const PAYMENT_METHODS = [
  { value: 'cash', icon: Banknote, title: 'Cash on delivery', text: 'Pay the rider when your food arrives' },
  { value: 'card', icon: CreditCard, title: 'Card', text: 'Pay online now (simulated)' },
]
const LABEL_ICONS = { home: Home, work: Briefcase, other: MapPin }

/** Selectable tile used for addresses and payment methods. */
function OptionTile({ selected, onSelect, name, children }) {
  return (
    <label className={`relative flex cursor-pointer gap-3 rounded-2xl border-2 p-4 transition duration-200 ${selected ? 'border-brand-500 bg-brand-50/60' : 'border-gray-200 hover:border-brand-200 hover:bg-gray-50'}`}>
      <input type="radio" name={name} className="sr-only" checked={selected} onChange={onSelect} />
      {children}
      <span className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full border-2 transition ${selected ? 'border-brand-500 bg-brand-500 text-white' : 'border-gray-300'}`} aria-hidden="true">
        {selected && <Check className="h-3 w-3" strokeWidth={3} />}
      </span>
    </label>
  )
}

export default function Checkout() {
  const cart = useCart()
  const navigate = useNavigate()
  const [addressId, setAddressId] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [placing, setPlacing] = useState(false)

  const addresses = useAsync(() => addressesApi.list().then(resultsOf), [])
  // Re-check the restaurant is still open (the server refuses orders to closed restaurants).
  const restaurant = useAsync(() => (cart.restaurant ? restaurantsApi.get(cart.restaurant.id) : null), [cart.restaurant?.id])

  // Pre-select the default address (the API returns it first).
  useEffect(() => {
    if (addresses.data?.length && !addressId) {
      setAddressId((addresses.data.find((a) => a.is_default) || addresses.data[0]).id)
    }
  }, [addresses.data, addressId])

  if (cart.count === 0 && !placing) return <Navigate to="/cart" replace />
  if (addresses.loading || restaurant.loading) return <DetailSkeleton />
  if (addresses.error) return <div className="page"><ErrorState message={addresses.error} onRetry={addresses.reload} /></div>

  const isClosed = restaurant.data && !restaurant.data.is_open

  const handleAddAddress = async (payload) => {
    const created = await addressesApi.create(payload)
    toast.success('Address added')
    setShowAddressForm(false)
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
          toast.error(`Order placed, but payment failed: ${getErrorMessage(err)} You can retry from the order page.`)
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

  return (
    <div className="page max-w-6xl">
      <h1 className="page-title mb-6">Checkout</h1>

      {isClosed && (
        <p className="mb-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 ring-1 ring-amber-200">
          <strong>{cart.restaurant.name}</strong> is closed right now, so orders can't be placed. Please try again later.
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {/* Delivery address */}
          <section className="card p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-3 text-lg font-semibold">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-sm text-white">1</span>
                Delivery address
              </h2>
              <button type="button" onClick={() => setShowAddressForm(true)} className="btn-outline btn-sm"><Plus className="h-4 w-4" aria-hidden="true" /> Add new</button>
            </div>
            {addresses.data.length === 0 ? (
              <div className="rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center">
                <MapPin className="mx-auto h-8 w-8 text-gray-300" strokeWidth={1.5} aria-hidden="true" />
                <p className="mt-2 text-sm text-gray-500">You have no saved addresses yet.</p>
                <button type="button" onClick={() => setShowAddressForm(true)} className="btn-primary mt-4">Add delivery address</button>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {addresses.data.map((a) => {
                  const Icon = LABEL_ICONS[a.label] ?? MapPin
                  return (
                    <OptionTile key={a.id} name="address" selected={addressId === a.id} onSelect={() => setAddressId(a.id)}>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-500 ring-1 ring-gray-100"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                      <span className="pr-6">
                        <span className="flex items-center gap-2 text-sm font-semibold capitalize text-gray-900">
                          {a.label}
                          {a.is_default && <span className="rounded-md bg-brand-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-brand-600">Default</span>}
                        </span>
                        <span className="mt-0.5 block text-sm text-gray-500">{formatAddress(a)}</span>
                      </span>
                    </OptionTile>
                  )
                })}
              </div>
            )}
          </section>

          {/* Payment */}
          <section className="card p-6">
            <h2 className="mb-5 flex items-center gap-3 text-lg font-semibold">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-sm text-white">2</span>
              Payment method
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {PAYMENT_METHODS.map((m) => (
                <OptionTile key={m.value} name="payment" selected={paymentMethod === m.value} onSelect={() => setPaymentMethod(m.value)}>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-brand-500 ring-1 ring-gray-100"><m.icon className="h-5 w-5" aria-hidden="true" /></span>
                  <span className="pr-6">
                    <span className="block text-sm font-semibold text-gray-900">{m.title}</span>
                    <span className="text-sm text-gray-500">{m.text}</span>
                  </span>
                </OptionTile>
              ))}
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside className="card h-fit overflow-hidden lg:sticky lg:top-24">
          <div className="flex items-center gap-3 border-b border-gray-100 p-5">
            <SmartImage src={cart.restaurant.logo} alt="" kind="logo" rounded="rounded-xl" className="h-11 w-11" />
            <div>
              <h2 className="font-semibold">Your order</h2>
              <Link to={`/restaurants/${cart.restaurant.id}`} className="text-sm text-brand-600 hover:underline">{cart.restaurant.name}</Link>
            </div>
          </div>
          <ul className="max-h-72 space-y-3 overflow-y-auto p-5">
            {cart.items.map((i) => (
              <li key={i.id} className="flex items-center gap-3 text-sm">
                <SmartImage src={i.image} alt="" rounded="rounded-lg" className="h-10 w-10 shrink-0" />
                <span className="min-w-0 flex-1 truncate text-gray-700"><span className="font-semibold text-gray-900">{i.quantity}×</span> {i.name}</span>
                <span className="font-medium text-gray-900">{formatPrice(Number(i.price) * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-100 bg-gray-50/60 p-5">
            <div className="flex justify-between text-lg font-semibold text-gray-900"><span>Total</span><span>{formatPrice(cart.total)}</span></div>
            <p className="mt-1 text-xs text-gray-400">The final total is confirmed with the restaurant's current prices.</p>
            <button type="button" onClick={placeOrder} disabled={placing || !addressId || isClosed} className="btn-primary mt-4 w-full py-3">
              {placing ? <><Spinner /> Placing order...</> : `Place order · ${formatPrice(cart.total)}`}
            </button>
            <Link to="/cart" className="btn-ghost mt-2 w-full">Back to cart</Link>
          </div>
        </aside>
      </div>

      <Modal open={showAddressForm} onClose={() => setShowAddressForm(false)} title="Add delivery address">
        <AddressForm
          initial={{ is_default: addresses.data.length === 0 }}
          onSubmit={handleAddAddress}
          onCancel={() => setShowAddressForm(false)}
        />
      </Modal>
    </div>
  )
}
