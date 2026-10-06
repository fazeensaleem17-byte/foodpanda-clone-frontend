import { SearchX } from 'lucide-react'
import { EmptyState, ErrorState, Pagination, RestaurantCardSkeleton } from '@shared/components/ui'
import RestaurantCard from './RestaurantCard'

/** Restaurant cards with their loading, error and empty states, plus pagination. */
export default function RestaurantGrid({
  data,
  loading,
  error,
  page,
  hasFilters,
  onRetry,
  onClearFilters,
  onPageChange,
}) {
  if (loading) return <RestaurantCardSkeleton />
  if (error) return <ErrorState message={error} onRetry={onRetry} />

  if (data.results.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No restaurants found"
        message={
          hasFilters ? 'Try a different search or clear the filters.' : 'No restaurants have been added yet.'
        }
        action={hasFilters ? 'Clear filters' : undefined}
        onAction={hasFilters ? onClearFilters : undefined}
      />
    )
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.results.map((r) => (
          <RestaurantCard key={r.id} restaurant={r} />
        ))}
      </div>
      <Pagination data={data} page={page} onPageChange={onPageChange} />
    </>
  )
}
