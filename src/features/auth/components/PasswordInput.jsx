import { Eye, EyeOff } from 'lucide-react'

/** Password field with a show / hide toggle. */
export default function PasswordInput({ show, onToggle, ...props }) {
  return (
    <div className="relative">
      <input type={show ? 'text' : 'password'} className="input pr-11 max-lg:pr-12" required {...props} />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-1.5 top-1/2 -translate-y-1/2 cursor-pointer rounded-lg p-2 text-gray-400 transition hover:text-gray-700 max-lg:right-0.5 max-lg:p-3"
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? (
          <EyeOff className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Eye className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    </div>
  )
}
