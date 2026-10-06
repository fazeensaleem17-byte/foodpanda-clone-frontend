/** Two-column auth layout: food photo on large screens, form card on the right. */
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden lg:block">
        <img src="/images/hero.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div
          className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/30 to-transparent"
          aria-hidden="true"
        />
        <div className="absolute bottom-0 p-12 text-white">
          <h2 className="font-display text-3xl font-bold text-white">Good food is just a few taps away</h2>
          <p className="mt-2 max-w-md text-white/80">
            Browse local restaurants, order in minutes and follow your delivery live.
          </p>
        </div>
      </div>
      <div className="flex items-center justify-center bg-white px-4 py-12 sm:px-8">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8">
            <img src="/favicon.svg" alt="" className="mb-5 h-12 w-12" />
            <h1 className="text-3xl font-bold">{title}</h1>
            {subtitle && <p className="mt-2 text-gray-500">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
