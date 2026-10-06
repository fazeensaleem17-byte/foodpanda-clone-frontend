import { Bike, ClipboardList, LayoutDashboard, Receipt, Store, UtensilsCrossed } from 'lucide-react'

// Links shown for each role (guests see the public ones only).
export const NAV_LINKS = {
  guest: [{ to: '/', label: 'Restaurants', icon: UtensilsCrossed, end: true }],
  customer: [
    { to: '/', label: 'Restaurants', icon: UtensilsCrossed, end: true },
    { to: '/orders', label: 'My Orders', icon: Receipt },
  ],
  owner: [
    { to: '/owner', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/owner/orders', label: 'Incoming Orders', icon: ClipboardList },
    { to: '/', label: 'Browse', icon: Store, end: true },
  ],
  rider: [
    { to: '/rider', label: 'Deliveries', icon: Bike, end: true },
    { to: '/', label: 'Browse', icon: Store, end: true },
  ],
}
