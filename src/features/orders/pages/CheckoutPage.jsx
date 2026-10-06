import { Navigate } from 'react-router-dom'
import { AddressForm } from '@features/addresses'
import { DetailSkeleton, ErrorState, Modal } from '@shared/components/ui'
import CheckoutAddressSection from '../components/CheckoutAddressSection'
import CheckoutPaymentSection from '../components/CheckoutPaymentSection'
import CheckoutSummary from '../components/CheckoutSummary'
import { useCheckout } from '../hooks/useCheckout'

export default function CheckoutPage() {
  const checkout = useCheckout()
  const { cart, addresses, isClosed, placing } = checkout

  if (cart.count === 0 && !placing) return <Navigate to="/cart" replace />
  if (checkout.loading) return <DetailSkeleton />
  if (addresses.error)
    return (
      <div className="page">
        <ErrorState message={addresses.error} onRetry={addresses.reload} />
      </div>
    )

  return (
    <div className="page max-w-6xl">
      <h1 className="page-title mb-6">Checkout</h1>

      {isClosed && (
        <p className="mb-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-800 ring-1 ring-amber-200">
          <strong>{cart.restaurant.name}</strong> is closed right now, so orders can&apos;t be placed. Please
          try again later.
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <CheckoutAddressSection
            addresses={addresses.data}
            selectedId={checkout.addressId}
            onSelect={checkout.setAddressId}
            onAddNew={checkout.openAddressForm}
          />
          <CheckoutPaymentSection value={checkout.paymentMethod} onChange={checkout.setPaymentMethod} />
        </div>

        <CheckoutSummary
          cart={cart}
          placing={placing}
          disabled={placing || !checkout.addressId || isClosed}
          onPlaceOrder={checkout.placeOrder}
        />
      </div>

      <Modal open={checkout.addressFormOpen} onClose={checkout.closeAddressForm} title="Add delivery address">
        <AddressForm
          initial={{ is_default: addresses.data.length === 0 }}
          onSubmit={checkout.addAddress}
          onCancel={checkout.closeAddressForm}
        />
      </Modal>
    </div>
  )
}
