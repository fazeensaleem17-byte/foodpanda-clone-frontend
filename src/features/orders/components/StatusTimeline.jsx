import { Check, XCircle } from 'lucide-react'
import { PROGRESS_STEPS, PROGRESS_STEP_ICONS, STATUS_LABELS } from '../constants'

/** Five-step progress bar for an order (or a "cancelled" notice). */
export default function StatusTimeline({ status }) {
  if (status === 'cancelled') {
    return (
      <p className="mt-6 flex items-center gap-2 rounded-2xl bg-gray-100 p-4 text-sm text-gray-600">
        <XCircle className="h-5 w-5 text-gray-400" aria-hidden="true" /> This order was cancelled.
      </p>
    )
  }
  const current = PROGRESS_STEPS.indexOf(status)
  return (
    <ol className="card mt-6 grid grid-cols-5 gap-1 px-2 py-5 sm:px-6">
      {PROGRESS_STEPS.map((step, i) => {
        const done = i <= current
        const Icon = i < current ? Check : PROGRESS_STEP_ICONS[step]
        return (
          <li key={step} className="flex flex-col items-center text-center">
            <div className="flex w-full items-center">
              <div
                className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i === 0 ? 'invisible' : done ? 'bg-brand-500' : 'bg-gray-200'}`}
              />
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition duration-500 ${done ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-400'} ${i === current ? 'ring-4 ring-brand-100' : ''}`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div
                className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i === PROGRESS_STEPS.length - 1 ? 'invisible' : i < current ? 'bg-brand-500' : 'bg-gray-200'}`}
              />
            </div>
            <span
              className={`mt-2 text-[11px] leading-tight sm:text-xs ${done ? 'font-semibold text-gray-900' : 'text-gray-400'}`}
            >
              {STATUS_LABELS[step]}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
