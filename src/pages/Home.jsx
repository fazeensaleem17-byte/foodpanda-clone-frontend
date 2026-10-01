import { useEffect, useMemo, useState } from 'react'
import { Clock, MapPin, Search, SearchX, ShieldCheck, Store, X } from 'lucide-react'
import { menuItemsApi, restaurantsApi } from '../api/restaurants'
import { useAsync } from '../hooks/useAsync'
import RestaurantCard from '../components/RestaurantCard'
import Pagination from '../components/Pagination'
import SmartImage from '../components/SmartImage'
import { RestaurantCardSkeleton, Skeleton } from '../components/Skeletons'
import { EmptyState, ErrorState } from '../components/StateMessages'

const SORTS = [
  { value: '-average_rating', label: 'Top rated' },
  { value: '-created_at', label: 'Newest' },
  { value: 'name', label: 'Name (A-Z)' },
]

// Cuisine shortcuts. Each keyword is a dish-name search the backend supports
// (restaurant search matches dish names). A tile only appears when some dish
// matches, and it uses that dish's real photo.
const CUISINES = [
  { label: 'Biryani', q: 'biryani' },
  { label: 'Pizza', q: 'pizza' },
  { label: 'Tikka', q: 'tikka' },
  { label: 'Karahi', q: 'karahi' },
  { label: 'Kebabs', q: 'kabab' },
  { label: 'Pulao', q: 'pulao' },
  { label: 'Naan', q: 'naan' },
  { label: 'Fries', q: 'fries' },
  { label: 'Burgers', q: 'burger' },
  { label: 'Lassi', q: 'lassi' },
]

const listJoin = (arr) => (arr.length < 2 ? arr.join('') : `${arr.slice(0, -1).join(', ')} and ${arr[arr.length - 1]}`)

export default function Home() {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('')
  const [openNow, setOpenNow] = useState(false)
  const [ordering, setOrdering] = useState('-average_rating')
  const [page, setPage] = useState(1)

  // Debounce the search box so we don't call the API on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput.trim()); setPage(1) }, 350)
    return () => clearTimeout(t)
  }, [searchInput])

  const { data: cities } = useAsync(() => restaurantsApi.cities(), [])
  const dishes = useAsync(() => menuItemsApi.all(), [])

  const cuisines = useMemo(() => {
    if (!dishes.data) return []
    return CUISINES.map((c) => {
      const matches = dishes.data.filter((d) => d.name.toLowerCase().includes(c.q))
      if (!matches.length) return null
      return { ...c, image: (matches.find((d) => d.image) || matches[0]).image }
    }).filter(Boolean)
  }, [dishes.data])

  // GET /restaurants/?search=&city=&is_open=&ordering=&page=
  const { data, loading, error, reload } = useAsync(() => {
    const params = { page, ordering }
    if (search) params.search = search
    if (city) params.city = city
    if (openNow) params.is_open = true
    return restaurantsApi.list(params)
  }, [search, city, openNow, ordering, page])

  const hasFilters = search || city || openNow
  const clearFilters = () => { setSearchInput(''); setSearch(''); setCity(''); setOpenNow(false); setPage(1) }
  const pickCuisine = (q) => {
    setSearchInput(q === search ? '' : q)
    document.getElementById('restaurants')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <img src="/images/hero.jpg" alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" fetchPriority="high" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-gray-950/90 via-gray-950/70 to-brand-900/30" aria-hidden="true" />
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
              Order from the best local restaurants, from smoky tikka to wood-fired pizza, and track it to your door.
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); setSearch(searchInput.trim()); setPage(1); document.getElementById('restaurants')?.scrollIntoView({ behavior: 'smooth' }) }}
              className="mt-8 flex max-w-xl items-center gap-2 rounded-2xl bg-white p-2 shadow-2xl"
              role="search"
            >
              <Search className="ml-2 h-5 w-5 shrink-0 text-gray-400" aria-hidden="true" />
              <input
                type="search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Restaurant or dish"
                className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-gray-900 outline-none placeholder:text-gray-400"
                aria-label="Search restaurants or dishes"
              />
              <button type="submit" className="btn-primary px-5 sm:px-6">Find food</button>
            </form>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
              <span className="inline-flex items-center gap-2"><Clock className="h-4 w-4 text-brand-400" aria-hidden="true" /> Fast delivery</span>
              <span className="inline-flex items-center gap-2"><Store className="h-4 w-4 text-brand-400" aria-hidden="true" /> Local favourites</span>
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-brand-400" aria-hidden="true" /> Cash or card</span>
            </div>
          </div>
        </div>
      </section>

      {/* Popular cuisines */}
      {(dishes.loading || cuisines.length > 0) && (
        <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8" aria-labelledby="cuisines-heading">
          <h2 id="cuisines-heading" className="mb-4 text-xl font-semibold">Popular cuisines</h2>
          <div className="scrollbar-none -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
            {dishes.loading
              ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex shrink-0 flex-col items-center gap-2"><Skeleton className="h-20 w-20 rounded-full sm:h-24 sm:w-24" /><Skeleton className="h-4 w-14" /></div>
              ))
              : cuisines.map((c) => {
                const active = search === c.q
                return (
                  <button key={c.q} type="button" onClick={() => pickCuisine(c.q)} aria-pressed={active} className="group flex shrink-0 cursor-pointer flex-col items-center gap-2">
                    <SmartImage
                      src={c.image}
                      alt=""
                      rounded="rounded-full"
                      className={`h-20 w-20 ring-2 ring-offset-2 transition duration-300 group-hover:scale-105 sm:h-24 sm:w-24 ${active ? 'ring-brand-500' : 'ring-transparent group-hover:ring-brand-200'}`}
                    />
                    <span className={`text-sm font-medium transition ${active ? 'text-brand-600' : 'text-gray-700 group-hover:text-brand-600'}`}>{c.label}</span>
                  </button>
                )
              })}
          </div>
        </section>
      )}

      <section id="restaurants" className="page scroll-mt-16">
        {/* Heading + filters */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">{search ? `Results for "${search}"` : 'All restaurants'}</h2>
            <p className="mt-1 text-sm text-gray-500">
              {data ? `${data.count} restaurant${data.count === 1 ? '' : 's'} found` : 'Finding restaurants near you'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative">
              <span className="sr-only">Filter by city</span>
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <select value={city} onChange={(e) => { setCity(e.target.value); setPage(1) }} className="input w-auto cursor-pointer py-2 pl-9">
                <option value="">All cities</option>
                {(cities || []).map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label>
              <span className="sr-only">Sort by</span>
              <select value={ordering} onChange={(e) => { setOrdering(e.target.value); setPage(1) }} className="input w-auto cursor-pointer py-2">
                {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </label>
            <button type="button" onClick={() => { setOpenNow((v) => !v); setPage(1) }} className={`chip ${openNow ? 'chip-active' : 'chip-idle'}`} aria-pressed={openNow}>
              <span className={`h-2 w-2 rounded-full ${openNow ? 'bg-white' : 'bg-emerald-500'}`} aria-hidden="true" /> Open now
            </button>
            {hasFilters && (
              <button type="button" onClick={clearFilters} className="btn-ghost btn-sm">
                <X className="h-3.5 w-3.5" aria-hidden="true" /> Clear
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <RestaurantCardSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : data.results.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No restaurants found"
            message={hasFilters ? 'Try a different search or clear the filters.' : 'No restaurants have been added yet.'}
            action={hasFilters ? 'Clear filters' : undefined}
            onAction={hasFilters ? clearFilters : undefined}
          />
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.results.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
            </div>
            <Pagination data={data} page={page} onPageChange={(p) => { setPage(p); document.getElementById('restaurants')?.scrollIntoView({ behavior: 'smooth' }) }} />
          </>
        )}
      </section>
    </>
  )
}
