import { Link } from 'react-router-dom'
import { ChevronLeft, Clock, MapPin, Phone, Settings, Star } from 'lucide-react'
import { SmartImage, StatusBadge } from '@shared/components/ui'
import { deliveryEstimate } from '../utils/deliveryEstimate'

/** Top of the restaurant page: cover banner, then the info card (logo, name, rating, address) overlapping it. */
export default function RestaurantHeader({ restaurant, isOwnerOfThis }) {
  return (
    <>
      {/* Cover banner */}
      <section className="relative">
        <SmartImage
          src={restaurant.image}
          alt=""
          kind="cover"
          eager
          className="h-56 w-full sm:h-72 lg:h-80"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-gray-950/10 to-transparent"
          aria-hidden="true"
        />
        <div className="absolute left-0 right-0 top-4 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-gray-800 shadow-sm backdrop-blur transition hover:bg-white"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" /> All restaurants
          </Link>
        </div>
      </section>

      {/* Header card overlapping the banner */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="card relative -mt-16 flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="-mt-14 shrink-0 self-start rounded-2xl bg-white p-1 shadow-md sm:-mt-16 sm:self-auto">
            <SmartImage
              src={restaurant.logo}
              alt={`${restaurant.name} logo`}
              kind="logo"
              rounded="rounded-xl"
              className="h-20 w-20 sm:h-24 sm:w-24"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold sm:text-3xl">{restaurant.name}</h1>
              <StatusBadge
                status={restaurant.is_open ? 'open' : 'closed'}
                label={restaurant.is_open ? 'Open now' : 'Closed'}
              />
            </div>
            {restaurant.description && <p className="mt-1 text-gray-500">{restaurant.description}</p>}
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                {restaurant.review_count ? (
                  <>
                    <strong className="font-semibold text-gray-900">
                      {Number(restaurant.average_rating).toFixed(1)}
                    </strong>{' '}
                    ({restaurant.review_count} review{restaurant.review_count === 1 ? '' : 's'})
                  </>
                ) : (
                  'No reviews yet'
                )}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-gray-400" aria-hidden="true" />
                {deliveryEstimate(restaurant.id)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-gray-400" aria-hidden="true" />
                {restaurant.address}, {restaurant.city}
              </span>
              {restaurant.phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-gray-400" aria-hidden="true" />
                  {restaurant.phone}
                </span>
              )}
            </div>
          </div>
          {isOwnerOfThis && (
            <Link to={`/owner/restaurants/${restaurant.id}`} className="btn-outline shrink-0">
              <Settings className="h-4 w-4" aria-hidden="true" /> Manage menu
            </Link>
          )}
        </div>

        {!restaurant.is_open && (
          <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
            This restaurant is closed right now. You can browse the menu, but ordering is paused.
          </p>
        )}
      </div>
    </>
  )
}
