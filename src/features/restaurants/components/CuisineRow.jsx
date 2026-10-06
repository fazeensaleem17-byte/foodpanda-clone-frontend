import { Skeleton, SmartImage } from '@shared/components/ui'

/** Horizontal row of round cuisine tiles; clicking one searches for that cuisine. */
export default function CuisineRow({ cuisines, loading, activeQuery, onPick }) {
  if (!loading && cuisines.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8" aria-labelledby="cuisines-heading">
      <h2 id="cuisines-heading" className="mb-4 text-xl font-semibold">
        Popular cuisines
      </h2>
      <div className="scrollbar-none -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex shrink-0 flex-col items-center gap-2">
                <Skeleton className="h-20 w-20 rounded-full sm:h-24 sm:w-24" />
                <Skeleton className="h-4 w-14" />
              </div>
            ))
          : cuisines.map((c) => {
              const active = activeQuery === c.q
              return (
                <button
                  key={c.q}
                  type="button"
                  onClick={() => onPick(c.q)}
                  aria-pressed={active}
                  className="group flex shrink-0 cursor-pointer flex-col items-center gap-2"
                >
                  <SmartImage
                    src={c.image}
                    alt=""
                    rounded="rounded-full"
                    className={`h-20 w-20 ring-2 ring-offset-2 transition duration-300 group-hover:scale-105 sm:h-24 sm:w-24 ${active ? 'ring-brand-500' : 'ring-transparent group-hover:ring-brand-200'}`}
                  />
                  <span
                    className={`text-sm font-medium transition ${active ? 'text-brand-600' : 'text-gray-700 group-hover:text-brand-600'}`}
                  >
                    {c.label}
                  </span>
                </button>
              )
            })}
      </div>
    </section>
  )
}
