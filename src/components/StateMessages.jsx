import { Link } from 'react-router-dom'
import { AlertTriangle, Inbox, RotateCw } from 'lucide-react'

export function EmptyState({ icon: Icon = Inbox, title, message, action, actionTo, onAction }) {
  return (
    <div className="card flex animate-fade-in flex-col items-center px-6 py-14 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
        <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      {message && <p className="mt-1 max-w-md text-sm text-gray-500">{message}</p>}
      {action && actionTo && <Link to={actionTo} className="btn-primary mt-6">{action}</Link>}
      {action && onAction && <button type="button" onClick={onAction} className="btn-primary mt-6">{action}</button>}
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="card flex animate-fade-in flex-col items-center border-red-100 px-6 py-12 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
        <AlertTriangle className="h-7 w-7" strokeWidth={1.75} aria-hidden="true" />
      </div>
      <h3 className="font-semibold">Something went wrong</h3>
      <p className="mt-1 max-w-md text-sm text-red-600">{message}</p>
      {onRetry && (
        <button type="button" onClick={() => onRetry()} className="btn-outline mt-6">
          <RotateCw className="h-4 w-4" aria-hidden="true" /> Try again
        </button>
      )}
    </div>
  )
}
