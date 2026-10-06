/** Sticky bar of menu category tabs; the active one follows the section in view. */
export default function CategoryTabs({ categories, activeCategoryId, tabsRef, onSelect }) {
  if (categories.length === 0) return null

  return (
    <nav
      className="sticky top-16 z-30 mt-6 border-b border-gray-200 bg-white/95 backdrop-blur-md"
      aria-label="Menu categories"
    >
      <div
        ref={tabsRef}
        className="scrollbar-none mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8"
      >
        {categories.map((c) => {
          const active = activeCategoryId === c.id
          return (
            <button
              key={c.id}
              type="button"
              data-cat={c.id}
              onClick={() => onSelect(c.id)}
              aria-current={active ? 'true' : undefined}
              className={`relative cursor-pointer whitespace-nowrap px-4 py-3.5 text-sm font-medium transition-colors ${active ? 'text-brand-600' : 'text-gray-600 hover:text-gray-900'}`}
            >
              {c.name} <span className="text-gray-400">({c.items.length})</span>
              <span
                className={`absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-brand-500 transition-transform duration-300 ${active ? 'scale-x-100' : 'scale-x-0'}`}
                aria-hidden="true"
              />
            </button>
          )
        })}
      </div>
    </nav>
  )
}
