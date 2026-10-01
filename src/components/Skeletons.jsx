// Skeleton placeholders shown while data loads (instead of spinners).
// Each mirrors the layout of the real content so the page doesn't jump.

export function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />
}

export function RestaurantCardSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading restaurants">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card overflow-hidden">
          <Skeleton className="h-44 rounded-none" />
          <div className="space-y-3 p-4">
            <div className="flex justify-between gap-4"><Skeleton className="h-5 w-2/3" /><Skeleton className="h-5 w-12" /></div>
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-3"><Skeleton className="h-4 w-20" /><Skeleton className="h-4 w-16" /></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function DishCardSkeleton({ count = 4 }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card flex gap-4 p-4">
          <div className="flex-1 space-y-2.5">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="mt-4 h-5 w-20" />
          </div>
          <Skeleton className="h-28 w-28 shrink-0 rounded-xl" />
        </div>
      ))}
    </div>
  )
}

export function RestaurantPageSkeleton() {
  return (
    <div role="status" aria-label="Loading restaurant">
      <Skeleton className="h-56 rounded-none sm:h-72" />
      <div className="page">
        <div className="-mt-20 mb-8 flex items-end gap-4">
          <Skeleton className="h-24 w-24 rounded-2xl ring-4 ring-white" />
          <div className="flex-1 space-y-2 pb-2"><Skeleton className="h-7 w-64" /><Skeleton className="h-4 w-80 max-w-full" /></div>
        </div>
        <div className="mb-6 flex gap-2">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-9 w-24 rounded-full" />)}</div>
        <Skeleton className="mb-4 h-6 w-32" />
        <DishCardSkeleton />
      </div>
    </div>
  )
}

export function OrderListSkeleton({ count = 3, columns = 1 }) {
  return (
    <div className={`grid gap-4 ${columns === 2 ? 'md:grid-cols-2' : ''}`} role="status" aria-label="Loading orders">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card space-y-4 p-5">
          <div className="flex justify-between"><div className="space-y-2"><Skeleton className="h-5 w-32" /><Skeleton className="h-3.5 w-48" /></div><Skeleton className="h-6 w-20" /></div>
          <div className="flex gap-2">{[0, 1, 2].map((j) => <Skeleton key={j} className="h-12 w-12 rounded-lg" />)}</div>
          <Skeleton className="h-3.5 w-2/3" />
        </div>
      ))}
    </div>
  )
}

export function DetailSkeleton() {
  return (
    <div className="page max-w-5xl" role="status" aria-label="Loading">
      <Skeleton className="mb-4 h-4 w-24" />
      <Skeleton className="mb-2 h-8 w-56" />
      <Skeleton className="mb-8 h-4 w-72" />
      <Skeleton className="mb-8 h-12 w-full rounded-2xl" />
      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="card space-y-4 p-5">{[0, 1, 2].map((i) => <div key={i} className="flex items-center gap-3"><Skeleton className="h-14 w-14 rounded-xl" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-1/2" /><Skeleton className="h-3 w-1/4" /></div></div>)}</div>
        <div className="space-y-4"><Skeleton className="h-32 rounded-2xl" /><Skeleton className="h-28 rounded-2xl" /></div>
      </div>
    </div>
  )
}

export function ListRowsSkeleton({ rows = 3 }) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-100 p-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="flex-1 space-y-2"><Skeleton className="h-4 w-1/3" /><Skeleton className="h-3 w-2/3" /></div>
        </div>
      ))}
    </div>
  )
}

/** Generic page placeholder used while the session is being restored. */
export function PageSkeleton() {
  return (
    <div className="page" role="status" aria-label="Loading">
      <Skeleton className="mb-3 h-8 w-64" />
      <Skeleton className="mb-8 h-4 w-96 max-w-full" />
      <RestaurantCardSkeleton count={3} />
    </div>
  )
}
