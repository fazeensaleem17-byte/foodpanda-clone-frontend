import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ChevronLeft, ChevronRight, Clock, MapPin, MessageSquare, Phone, Settings, ShoppingBag, Star, UtensilsCrossed } from 'lucide-react'
import { restaurantsApi } from '../api/restaurants'
import { reviewsApi } from '../api/reviews'
import { useAsync } from '../hooks/useAsync'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import MenuItemCard from '../components/MenuItemCard'
import SmartImage from '../components/SmartImage'
import StatusBadge from '../components/StatusBadge'
import QuantityStepper from '../components/QuantityStepper'
import { ConfirmDialog } from '../components/Modal'
import { ListRowsSkeleton, RestaurantPageSkeleton } from '../components/Skeletons'
import { EmptyState, ErrorState } from '../components/StateMessages'
import { Stars } from '../components/StarRating'
import { formatPrice, formatShortDate, usernameOf } from '../utils/format'
import { deliveryEstimate, initialsOf } from '../utils/restaurant'

export default function RestaurantDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const cart = useCart()
  const [pendingItem, setPendingItem] = useState(null) // item waiting for "replace cart?" confirmation
  const [activeCat, setActiveCat] = useState(null)
  const tabsRef = useRef(null)

  // GET /restaurants/{id}/menu/ -> { restaurant, categories: [{ id, name, items }] }
  const menu = useAsync(() => restaurantsApi.menu(id), [id])
  // GET /reviews/?restaurant={id}
  const [reviewPage, setReviewPage] = useState(1)
  const reviews = useAsync(() => reviewsApi.list({ restaurant: id, ordering: '-created_at', page: reviewPage }), [id, reviewPage])

  const visibleCategories = menu.data?.categories.filter((c) => c.items.length > 0) ?? []
  const catKey = visibleCategories.map((c) => c.id).join(',')

  // Scroll-spy: highlight the category tab whose section is in view.
  useEffect(() => {
    if (!catKey) return
    const sections = catKey.split(',').map((cid) => document.getElementById(`cat-${cid}`)).filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveCat(Number(visible[0].target.id.replace('cat-', '')))
      },
      { rootMargin: '-140px 0px -55% 0px' },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [catKey])

  // Keep the active tab visible inside the horizontally scrolling tab bar.
  useEffect(() => {
    tabsRef.current?.querySelector(`[data-cat="${activeCat}"]`)?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
  }, [activeCat])

  if (menu.loading) return <RestaurantPageSkeleton />
  if (menu.error) return <div className="page"><ErrorState message={menu.error} onRetry={menu.reload} /></div>

  const { restaurant } = menu.data
  const isOwnerOfThis = user?.role === 'owner' && usernameOf(restaurant.owner) === user.username
  const canOrder = (!user || user.role === 'customer') && restaurant.is_open
  const disabledReason = !restaurant.is_open ? 'Closed' : user && user.role !== 'customer' ? 'Customers only' : null
  const cartIsHere = cart.restaurant?.id === restaurant.id && cart.count > 0
  const showCartPanel = !user || user.role === 'customer'

  // Adding an item: the CartContext refuses to mix restaurants and tells us so.
  const handleAdd = (item) => {
    const result = cart.addItem(item, restaurant)
    if (result.conflict) setPendingItem(item)
    else toast.success(`${item.name} added to cart`)
  }

  const confirmReplace = () => {
    cart.addItem(pendingItem, restaurant, { replace: true })
    toast.success(`Started a new cart from ${restaurant.name}`)
    setPendingItem(null)
  }

  const jumpTo = (cid) => {
    setActiveCat(cid)
    document.getElementById(`cat-${cid}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      {/* Cover banner */}
      <section className="relative">
        <SmartImage src={restaurant.image} alt="" kind="cover" eager className="h-56 w-full sm:h-72 lg:h-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-gray-950/10 to-transparent" aria-hidden="true" />
        <div className="absolute left-0 right-0 top-4 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-sm font-medium text-gray-800 shadow-sm backdrop-blur transition hover:bg-white">
            <ChevronLeft className="h-4 w-4" aria-hidden="true" /> All restaurants
          </Link>
        </div>
      </section>

      {/* Header card overlapping the banner */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="card relative -mt-16 flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="-mt-14 shrink-0 self-start rounded-2xl bg-white p-1 shadow-md sm:-mt-16 sm:self-auto">
            <SmartImage src={restaurant.logo} alt={`${restaurant.name} logo`} kind="logo" rounded="rounded-xl" className="h-20 w-20 sm:h-24 sm:w-24" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold sm:text-3xl">{restaurant.name}</h1>
              <StatusBadge status={restaurant.is_open ? 'open' : 'closed'} label={restaurant.is_open ? 'Open now' : 'Closed'} />
            </div>
            {restaurant.description && <p className="mt-1 text-gray-500">{restaurant.description}</p>}
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
                {restaurant.review_count
                  ? <><strong className="font-semibold text-gray-900">{Number(restaurant.average_rating).toFixed(1)}</strong> ({restaurant.review_count} review{restaurant.review_count === 1 ? '' : 's'})</>
                  : 'No reviews yet'}
              </span>
              <span className="inline-flex items-center gap-1.5"><Clock className="h-4 w-4 text-gray-400" aria-hidden="true" />{deliveryEstimate(restaurant.id)}</span>
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-gray-400" aria-hidden="true" />{restaurant.address}, {restaurant.city}</span>
              {restaurant.phone && <span className="inline-flex items-center gap-1.5"><Phone className="h-4 w-4 text-gray-400" aria-hidden="true" />{restaurant.phone}</span>}
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

      {/* Sticky category tabs */}
      {visibleCategories.length > 0 && (
        <nav className="sticky top-16 z-30 mt-6 border-b border-gray-200 bg-white/95 backdrop-blur-md" aria-label="Menu categories">
          <div ref={tabsRef} className="scrollbar-none mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
            {visibleCategories.map((c) => {
              const active = activeCat === c.id
              return (
                <button
                  key={c.id}
                  type="button"
                  data-cat={c.id}
                  onClick={() => jumpTo(c.id)}
                  aria-current={active ? 'true' : undefined}
                  className={`relative cursor-pointer whitespace-nowrap px-4 py-3.5 text-sm font-medium transition-colors ${active ? 'text-brand-600' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  {c.name} <span className="text-gray-400">({c.items.length})</span>
                  <span className={`absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-brand-500 transition-transform duration-300 ${active ? 'scale-x-100' : 'scale-x-0'}`} aria-hidden="true" />
                </button>
              )
            })}
          </div>
        </nav>
      )}

      <div className={`mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:px-8 ${showCartPanel ? 'lg:grid-cols-[1fr_340px]' : ''}`}>
        <div className="min-w-0">
          {visibleCategories.length === 0 ? (
            <EmptyState icon={UtensilsCrossed} title="Menu coming soon" message="This restaurant hasn't added any dishes yet." />
          ) : (
            visibleCategories.map((c) => (
              <section key={c.id} id={`cat-${c.id}`} className="mb-10 scroll-mt-32">
                <h2 className="mb-4 text-xl font-semibold">{c.name}</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {c.items.map((item) => (
                    <MenuItemCard
                      key={item.id}
                      item={item}
                      quantity={cart.restaurant?.id === restaurant.id ? cart.quantityOf(item.id) : 0}
                      canOrder={canOrder && item.is_available}
                      disabledReason={!item.is_available ? 'Unavailable' : disabledReason}
                      onAdd={() => handleAdd(item)}
                      onChangeQty={(q) => cart.updateQuantity(item.id, q)}
                    />
                  ))}
                </div>
              </section>
            ))
          )}

          {/* Reviews */}
          <section className="mt-4 border-t border-gray-200 pt-10" aria-labelledby="reviews-heading">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 id="reviews-heading" className="text-xl font-semibold">Ratings & reviews</h2>
              {restaurant.review_count > 0 && (
                <div className="flex items-center gap-2">
                  <span className="font-display text-2xl font-bold text-gray-900">{Number(restaurant.average_rating).toFixed(1)}</span>
                  <Stars value={restaurant.average_rating} />
                  <span className="text-sm text-gray-500">({restaurant.review_count})</span>
                </div>
              )}
            </div>
            {reviews.loading ? (
              <ListRowsSkeleton rows={2} />
            ) : reviews.error ? (
              <ErrorState message={reviews.error} onRetry={reviews.reload} />
            ) : reviews.data.results.length === 0 ? (
              <EmptyState icon={MessageSquare} title="No reviews yet" message="Order and be the first to share your experience." />
            ) : (
              <>
                <ul className="grid gap-4 md:grid-cols-2">
                  {reviews.data.results.map((r) => (
                    <li key={r.id} className="card p-5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-600">{initialsOf(usernameOf(r.user))}</span>
                          <div className="leading-tight">
                            <p className="font-medium text-gray-900">{usernameOf(r.user)}</p>
                            <p className="text-xs text-gray-400">{formatShortDate(r.created_at)}</p>
                          </div>
                        </div>
                        <Stars value={r.rating} size="h-3.5 w-3.5" />
                      </div>
                      {r.comment && <p className="mt-3 text-sm leading-relaxed text-gray-600">{r.comment}</p>}
                    </li>
                  ))}
                </ul>
                {(reviews.data.next || reviews.data.previous) && (
                  <div className="mt-4 flex justify-center gap-2">
                    <button type="button" className="btn-ghost btn-sm" disabled={!reviews.data.previous} onClick={() => setReviewPage((p) => p - 1)}><ChevronLeft className="h-4 w-4" aria-hidden="true" /> Newer</button>
                    <button type="button" className="btn-ghost btn-sm" disabled={!reviews.data.next} onClick={() => setReviewPage((p) => p + 1)}>Older <ChevronRight className="h-4 w-4" aria-hidden="true" /></button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>

        {/* Sticky cart sidebar (desktop) */}
        {showCartPanel && (
          <aside className="hidden lg:block" aria-label="Your order">
            <div className="card sticky top-36 overflow-hidden">
              <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
                <ShoppingBag className="h-5 w-5 text-brand-500" aria-hidden="true" />
                <h3 className="font-semibold">Your order</h3>
              </div>
              {cartIsHere ? (
                <>
                  <ul className="max-h-[50vh] divide-y divide-gray-100 overflow-y-auto px-5">
                    {cart.items.map((i) => (
                      <li key={i.id} className="flex items-center gap-3 py-3">
                        <SmartImage src={i.image} alt="" rounded="rounded-lg" className="h-11 w-11 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900">{i.name}</p>
                          <p className="text-xs text-gray-500">{formatPrice(Number(i.price) * i.quantity)}</p>
                        </div>
                        <QuantityStepper value={i.quantity} size="sm" max={cart.MAX_QTY} removeAtMin onChange={(q) => cart.updateQuantity(i.id, q)} />
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-gray-100 bg-gray-50/60 px-5 py-4">
                    <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span>{formatPrice(cart.total)}</span></div>
                    <div className="mt-1 flex justify-between font-semibold text-gray-900"><span>Total</span><span>{formatPrice(cart.total)}</span></div>
                    <button type="button" onClick={() => navigate('/cart')} className="btn-primary mt-4 w-full">Review order</button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center px-5 py-10 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
                    <ShoppingBag className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                  </div>
                  <p className="text-sm text-gray-500">
                    {cart.count > 0
                      ? `Your cart has items from ${cart.restaurant.name}. Adding from here starts a new cart.`
                      : 'Your cart is empty. Add dishes to get started.'}
                  </p>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Mobile floating cart bar */}
      {cartIsHere && (
        <div className="fixed inset-x-0 bottom-0 z-30 animate-fade-in p-3 lg:hidden">
          <Link to="/cart" className="btn-primary flex w-full justify-between rounded-2xl py-3.5 shadow-xl">
            <span className="flex items-center gap-2">
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-white/25 px-1.5 text-xs">{cart.count}</span>
              View cart
            </span>
            <span>{formatPrice(cart.total)}</span>
          </Link>
        </div>
      )}

      <ConfirmDialog
        open={!!pendingItem}
        title="Start a new cart?"
        message={`Your cart already has items from ${cart.restaurant?.name}. An order can only contain items from one restaurant. Clear your cart and add ${pendingItem?.name} from ${restaurant.name}?`}
        confirmLabel="Clear cart and add"
        danger
        onConfirm={confirmReplace}
        onCancel={() => setPendingItem(null)}
      />
    </>
  )
}
