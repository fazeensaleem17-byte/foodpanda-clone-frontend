import { DEMO_USERNAMES } from '../constants'

/** Box on the login page listing the seeded demo accounts; clicking one fills the username. */
export default function DemoAccounts({ onPick }) {
  return (
    <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50 p-4 text-xs text-gray-600">
      <p className="font-semibold text-gray-700">Demo accounts</p>
      <p className="mt-0.5">
        Password for all:{' '}
        <code className="rounded bg-white px-1 py-0.5 font-mono text-gray-800 ring-1 ring-gray-200">
          Demo@12345
        </code>
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {DEMO_USERNAMES.map((u) => (
          <button
            key={u}
            type="button"
            onClick={() => onPick(u)}
            className="cursor-pointer rounded-full bg-white px-3 py-1 font-medium text-brand-600 ring-1 ring-brand-200 transition hover:bg-brand-50"
          >
            {u}
          </button>
        ))}
      </div>
    </div>
  )
}
