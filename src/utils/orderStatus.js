// Mirrors the backend workflow in orders/views.py (TRANSITIONS) so the UI only
// ever offers buttons the server will accept.
//
//   pending -> confirmed -> preparing -> on_the_way -> delivered
//      \-> cancelled  <-/  (owner can cancel pending/confirmed; customer only pending)

export const ORDER_STATUSES = ['pending', 'confirmed', 'preparing', 'on_the_way', 'delivered', 'cancelled']

export const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  on_the_way: 'On the way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  // payment statuses
  paid: 'Paid',
  failed: 'Failed',
  refunded: 'Refunded',
}

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
