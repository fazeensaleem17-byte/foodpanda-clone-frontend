import { STATUS_LABELS } from '../utils/orderStatus'

// One colour per order / payment / restaurant status.
const STYLES = {
  // order
  pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  confirmed: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  preparing: 'bg-violet-50 text-violet-700 ring-violet-600/20',
  on_the_way: 'bg-sky-50 text-sky-700 ring-sky-600/20',
  delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  cancelled: 'bg-gray-100 text-gray-600 ring-gray-500/20',
  // payment
  paid: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  failed: 'bg-red-50 text-red-700 ring-red-600/20',
  refunded: 'bg-teal-50 text-teal-700 ring-teal-600/25',
  // restaurant
  open: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  closed: 'bg-gray-100 text-gray-600 ring-gray-500/20',
}

export default function StatusBadge({ status, label, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${STYLES[status] || STYLES.cancelled} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {label || STATUS_LABELS[status] || status}
    </span>
  )
}
