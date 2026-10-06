import CuisineRow from '../components/CuisineRow'
import Hero from '../components/Hero'
import RestaurantFilters from '../components/RestaurantFilters'
import RestaurantGrid from '../components/RestaurantGrid'
import { useCities } from '../hooks/useCities'
import { useCuisines } from '../hooks/useCuisines'
import { useRestaurants } from '../hooks/useRestaurants'

const scrollToRestaurants = () =>
  document.getElementById('restaurants')?.scrollIntoView({ behavior: 'smooth' })

export default function HomePage() {
  const cities = useCities()
  const { cuisines, loading: cuisinesLoading } = useCuisines()
  const restaurants = useRestaurants()

  return (
    <>
      <Hero
        cities={cities}
        searchInput={restaurants.searchInput}
        onSearchInputChange={restaurants.setSearchInput}
        onSubmit={() => {
          restaurants.submitSearch()
          scrollToRestaurants()
        }}
      />

      <CuisineRow
        cuisines={cuisines}
        loading={cuisinesLoading}
        activeQuery={restaurants.search}
        onPick={(q) => {
          restaurants.toggleCuisine(q)
          scrollToRestaurants()
        }}
      />

      <section id="restaurants" className="page scroll-mt-16">
        <RestaurantFilters
          search={restaurants.search}
          resultCount={restaurants.data?.count}
          cities={cities}
          city={restaurants.city}
          ordering={restaurants.ordering}
          openNow={restaurants.openNow}
          hasFilters={restaurants.hasFilters}
          onCityChange={restaurants.changeCity}
          onOrderingChange={restaurants.changeOrdering}
          onToggleOpenNow={restaurants.toggleOpenNow}
          onClear={restaurants.clearFilters}
        />

        <RestaurantGrid
          data={restaurants.data}
          loading={restaurants.loading}
          error={restaurants.error}
          page={restaurants.page}
          hasFilters={restaurants.hasFilters}
          onRetry={restaurants.reload}
          onClearFilters={restaurants.clearFilters}
          onPageChange={(p) => {
            restaurants.setPage(p)
            scrollToRestaurants()
          }}
        />
      </section>
    </>
  )
}
