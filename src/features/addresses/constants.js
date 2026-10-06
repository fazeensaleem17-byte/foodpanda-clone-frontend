import { Briefcase, Home, MapPin } from 'lucide-react'

export const ADDRESS_LABELS = ['home', 'work', 'other']

/** Icon shown for each address label. */
export const ADDRESS_LABEL_ICONS = { home: Home, work: Briefcase, other: MapPin }

export const EMPTY_ADDRESS = { label: 'home', city: '', area: '', street: '', is_default: false }
