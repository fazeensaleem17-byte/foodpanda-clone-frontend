import { Bike, ShoppingBag, Store } from 'lucide-react'

/** Role choices on the register page. */
export const ROLE_OPTIONS = [
  { value: 'customer', icon: ShoppingBag, title: 'Customer', text: 'Order food' },
  { value: 'owner', icon: Store, title: 'Restaurant', text: 'Sell food' },
  { value: 'rider', icon: Bike, title: 'Rider', text: 'Deliver food' },
]

/** Quick-fill buttons on the login page. */
export const DEMO_USERNAMES = ['demo_customer', 'demo_owner', 'demo_rider', 'demo_rider2']
