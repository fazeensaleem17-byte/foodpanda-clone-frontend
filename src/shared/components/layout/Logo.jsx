import { Link } from 'react-router-dom'

export default function Logo({ light = false }) {
  return (
    <Link
      to="/"
      className={`flex items-center gap-2 font-display text-xl font-bold tracking-tight ${light ? 'text-white' : 'text-brand-500'}`}
    >
      <img src="/favicon.svg" alt="" className="h-8 w-8" />
      <span>foodpanda</span>
    </Link>
  )
}
