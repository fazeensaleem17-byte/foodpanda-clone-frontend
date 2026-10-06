import { Banknote, Bike, ChefHat, CircleCheck, ClipboardCheck, CreditCard, PackageCheck } from 'lucide-react'

// Mirrors the backend workflow in orders/views.py (TRANSITIONS) so the UI only
// ever offers buttons the server will accept.
//
//   pending -> confirmed -> preparing -> on_the_way -> delivered
//      \-> cancelled  <-/  (owner can cancel pending/confirmed; customer only pending)

export { STATUS_LABELS } from '@shared/utils/constants'

export const ORDER_STATUSES = ['pending', 'confirmed', 'preparing', 'on_the_way', 'delivered', 'cancelled']

// Next statuses each role may set, keyed by current status.
export const TRANSITIONS = {
  owner: {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['preparing', 'cancelled'],
  },
  rider: {
    preparing: ['on_the_way'],
    on_the_way: ['delivered'],
  },
  customer: {
    pending: ['cancelled'],
  },
}

export const nextStatuses = (role, status) => TRANSITIONS[role]?.[status] ?? []

// Button labels for each target status
export const ACTION_LABELS = {
  confirmed: 'Confirm order',
  preparing: 'Start preparing',
  on_the_way: 'Picked up - on the way',
  delivered: 'Mark delivered',
  cancelled: 'Cancel',
}

// Progress steps shown on the order detail page
export const PROGRESS_STEPS = ['pending', 'confirmed', 'preparing', 'on_the_way', 'delivered']

// Status filter tabs ('' = all)
export const CUSTOMER_STATUS_FILTERS = [
  '',
  'pending',
  'confirmed',
  'preparing',
  'on_the_way',
  'delivered',
  'cancelled',
]

// Payment choices at checkout
export const PAYMENT_METHOD_OPTIONS = [
  { value: 'cash', icon: Banknote, title: 'Cash on delivery', text: 'Pay the rider when your food arrives' },
  { value: 'card', icon: CreditCard, title: 'Card', text: 'Pay online now (simulated)' },
]
export const DEFAULT_PAYMENT_METHOD = 'cash'

// Icon for each step of the order progress timeline
export const PROGRESS_STEP_ICONS = {
  pending: ClipboardCheck,
  confirmed: CircleCheck,
  preparing: ChefHat,
  on_the_way: Bike,
  delivered: PackageCheck,
}

// "Back" link on the order detail page, per role: [path, label]
export const ORDER_BACK_LINKS = {
  customer: ['/orders', 'My orders'],
  owner: ['/owner/orders', 'Incoming orders'],
  rider: ['/rider', 'Deliveries'],
}
