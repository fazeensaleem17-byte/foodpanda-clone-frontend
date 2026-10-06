import { Link } from 'react-router-dom'
import { Eye, MapPin, Pencil, Power, Trash2, UtensilsCrossed } from 'lucide-react'
import { RatingBadge, SmartImage, StatusBadge } from '@shared/components/ui'

/** One of the owner's restaurants on the dashboard, with its management actions. */
export default function OwnerRestaurantCard({ restaurant: r, toggling, onToggleOpen, onEdit, onDelete }) {
  return (
    <div className="card group flex animate-fade-in flex-col overflow-hidden transition duration-300 hover:shadow-card-hover">
      <div className="relative">
        <SmartImage src={r.image} alt="" kind="cover" className="aspect-[16/9] w-full" />
        <div className="absolute right-3 top-3">
          <StatusBadge
            status={r.is_open ? 'open' : 'closed'}
            label={r.is_open ? 'Open' : 'Closed'}
            className="bg-white shadow-sm"
          />
        </div>
        <div className="absolute -bottom-6 left-4 rounded-2xl bg-white p-1 shadow-md">
          <SmartImage
            src={r.logo}
            alt={`${r.name} logo`}
            kind="logo"
            rounded="rounded-xl"
            className="h-12 w-12"
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-8">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold">{r.name}</h3>
          <RatingBadge rating={r.average_rating} count={r.review_count} className="shrink-0" />
        </div>
        <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">
            {r.address}, {r.city}
          </span>
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-1.5 border-t border-gray-100 p-3">
        <Link to={`/owner/restaurants/${r.id}`} className="btn-primary btn-sm">
          <UtensilsCrossed className="h-3.5 w-3.5" aria-hidden="true" /> Menu
        </Link>
        <button type="button" onClick={onToggleOpen} disabled={toggling} className="btn-outline btn-sm">
          <Power className="h-3.5 w-3.5" aria-hidden="true" /> {r.is_open ? 'Close' : 'Open'}
        </button>
        {/* Icon actions stay together so they wrap as one group on narrow cards */}
        <div className="ml-auto flex items-center">
          <button
            type="button"
            onClick={onEdit}
            className="btn-ghost btn-sm px-2"
            aria-label={`Edit ${r.name}`}
            title="Edit details and images"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </button>
          <Link
            to={`/restaurants/${r.id}`}
            className="btn-ghost btn-sm px-2"
            aria-label={`View ${r.name}`}
            title="View public page"
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={onDelete}
            className="btn-ghost btn-sm px-2 text-red-500 hover:bg-red-50 hover:text-red-600"
            aria-label={`Delete ${r.name}`}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}
