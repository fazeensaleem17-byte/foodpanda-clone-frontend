import { Link } from 'react-router-dom'
import { Clock, MapPin } from 'lucide-react'
import SmartImage from './SmartImage'
import { RatingBadge } from './StarRating'
import { deliveryEstimate } from '../utils/restaurant'

export default function RestaurantCard({ restaurant }) {
  const { id, name, description, city, image, logo, is_open, average_rating, review_count } = restaurant
  return (
    <Link to={`/restaurants/${id}`} className="card card-hover group flex flex-col overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500">
      <div className="relative">
        <SmartImage src={image} alt="" kind="cover" className="aspect-[16/9] w-full [&_img]:transition-transform [&_img]:duration-500 group-hover:[&_img]:scale-105" />
        {!is_open && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/55">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-800">Closed for now</span>
          </div>
        )}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-gray-800 shadow-sm">
          <Clock className="h-3.5 w-3.5 text-brand-500" aria-hidden="true" /> {deliveryEstimate(id)}
        </span>
        <div className="absolute -bottom-6 left-4 rounded-2xl bg-white p-1 shadow-md">
          <SmartImage src={logo} alt={`${name} logo`} kind="logo" rounded="rounded-xl" className="h-12 w-12" />
        </div>
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-8">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 font-semibold transition-colors group-hover:text-brand-600">{name}</h3>
          <RatingBadge rating={average_rating} count={review_count} className="shrink-0" />
        </div>
        {description && <p className="mt-1 line-clamp-1 text-sm text-gray-500">{description}</p>}
        <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-gray-500">
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {city}
        </p>
      </div>
    </Link>
  )
}
