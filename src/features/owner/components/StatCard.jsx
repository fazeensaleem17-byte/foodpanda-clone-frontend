import { Link } from 'react-router-dom'
import { Skeleton } from '@shared/components/ui'

/** Number + label tile on the owner dashboard; links somewhere when `to` is given. */
export default function StatCard({ label, value, icon: Icon, to, highlight }) {
  const body = (
    <div
      className={`card flex items-center gap-4 p-5 transition duration-300 ${to ? 'hover:-translate-y-0.5 hover:shadow-card-hover' : ''} ${highlight ? 'border-brand-200 bg-brand-50/60' : ''}`}
    >
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${highlight ? 'bg-brand-500 text-white' : 'bg-brand-50 text-brand-500'}`}
      >
        <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <div>
        {value === undefined ? (
          <Skeleton className="mb-1 h-7 w-10" />
        ) : (
          <p className="font-display text-2xl font-bold text-gray-900">{value}</p>
        )}
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  )
  return to ? <Link to={to}>{body}</Link> : body
}
