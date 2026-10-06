import { Bike, CircleCheck, Package } from 'lucide-react'

/** Tabs of the rider dashboard. */
export const RIDER_TABS = [
  { key: 'available', label: 'Available', icon: Package },
  { key: 'active', label: 'My active', icon: Bike },
  { key: 'history', label: 'Delivered', icon: CircleCheck },
]

export const DEFAULT_RIDER_TAB = 'available'
