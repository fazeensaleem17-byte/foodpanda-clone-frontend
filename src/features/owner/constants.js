/** Status tabs on the owner's "Incoming orders" page, in workflow order ('' = all). */
export const OWNER_ORDER_TABS = [
  'pending',
  'confirmed',
  'preparing',
  'on_the_way',
  'delivered',
  'cancelled',
  '',
]

export const DEFAULT_OWNER_ORDER_TAB = 'pending'

/** Order statuses in which a rider is (or was) involved, so the card shows the rider line. */
export const STATUSES_WITH_RIDER = ['preparing', 'on_the_way', 'delivered']
