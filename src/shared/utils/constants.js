// App-wide constants used by more than one feature.

/** Display labels for order statuses and payment statuses. */
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

/** Display labels for the three account roles. */
export const ROLE_LABELS = { customer: 'Customer', owner: 'Restaurant owner', rider: 'Rider' }

/** Matches REST_FRAMEWORK.PAGE_SIZE on the backend. */
export const PAGE_SIZE = 10

/** How often the live order boards (owner, rider) refresh, in milliseconds. */
export const ORDER_POLL_INTERVAL_MS = 20000
