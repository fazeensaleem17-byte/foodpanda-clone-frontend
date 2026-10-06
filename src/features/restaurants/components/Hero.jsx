import { Clock, Search, ShieldCheck, Store } from 'lucide-react'
import { listJoin } from '@shared/utils/format'

/** Home page hero: food photo background, headline and the search form. */
export default function Hero({ cities, searchInput, onSearchInputChange, onSubmit }) {
  return (
    <section className="relative isolate overflow-hidden">
      <img
        src="/images/hero.jpg"
        alt=""
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        fetchPriority="high"
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-r from-gray-950/90 via-gray-950/70 to-brand-900/30"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="max-w-2xl animate-fade-in">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90 ring-1 ring-white/20 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400" aria-hidden="true" />
            {cities?.length ? `Delivering in ${listJoin(cities)}` : 'Food delivery from local restaurants'}
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Your favourite food, <span className="text-brand-400">delivered fast</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-white/80 sm:text-lg">
            Order from the best local restaurants, from smoky tikka to wood-fired pizza, and track it to your
            door.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              onSubmit()
            }}
            className="mt-8 flex max-w-xl items-center gap-2 rounded-2xl bg-white p-2 shadow-2xl"
            role="search"
          >
            <Search className="ml-2 h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => onSearchInputChange(e.target.value)}
              placeholder="Restaurant or dish"
              className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-gray-900 outline-none placeholder:text-gray-400"
              aria-label="Search restaurants or dishes"
            />
            <button type="submit" className="btn-primary px-5 sm:px-6">
              Find food
            </button>
          </form>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand-400" aria-hidden="true" /> Fast delivery
            </span>
            <span className="inline-flex items-center gap-2">
              <Store className="h-4 w-4 text-brand-400" aria-hidden="true" /> Local favourites
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand-400" aria-hidden="true" /> Cash or card
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
