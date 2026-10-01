import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { BellRing, ChefHat, Eye, MapPin, Pencil, Plus, Power, Store, Trash2, UtensilsCrossed } from 'lucide-react'
import { restaurantsApi } from '../../api/restaurants'
import { ordersApi } from '../../api/orders'
import { resultsOf } from '../../api/client'
import { useAsync } from '../../hooks/useAsync'
import { useAuth } from '../../context/AuthContext'
import Modal, { ConfirmDialog } from '../../components/Modal'
import RestaurantForm from '../../components/RestaurantForm'
import SmartImage from '../../components/SmartImage'
import StatusBadge from '../../components/StatusBadge'
import { RatingBadge } from '../../components/StarRating'
import { RestaurantCardSkeleton, Skeleton } from '../../components/Skeletons'
import { EmptyState, ErrorState } from '../../components/StateMessages'
import { getErrorMessage } from '../../utils/errors'

export default function OwnerDashboard() {
  const { user } = useAuth()
  const [editing, setEditing] = useState(null) // null | 'new' | restaurant
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)
  const [togglingId, setTogglingId] = useState(null)

  // GET /restaurants/mine/ (up to 10 - owners rarely have more; paginated otherwise)
  const { data, loading, error, reload } = useAsync(() => restaurantsApi.mine().then(resultsOf), [])
  // Quick stats: orders that need the owner's attention
  const pending = useAsync(() => ordersApi.list({ status: 'pending' }), [])
  const confirmed = useAsync(() => ordersApi.list({ status: 'confirmed' }), [])

  // Text fields + image fields (File = upload as multipart, null = remove, undefined = keep).
  const save = async (payload) => {
    if (editing === 'new') {
      await restaurantsApi.create(payload)
      toast.success('Restaurant created. Now add your menu.')
    } else {
      await restaurantsApi.update(editing.id, payload)
      toast.success('Restaurant updated')
    }
    setEditing(null)
    reload({ silent: true })
  }

  const toggleOpen = async (r) => {
    setTogglingId(r.id)
    try {
      await restaurantsApi.update(r.id, { is_open: !r.is_open })
      toast.success(`${r.name} is now ${r.is_open ? 'closed' : 'open'}`)
      await reload({ silent: true })
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setTogglingId(null)
    }
  }

  const remove = async () => {
    setBusy(true)
    try {
      await restaurantsApi.remove(deleting.id)
      toast.success('Restaurant deleted')
      reload({ silent: true })
    } catch (err) {
      // 409: the restaurant has orders, so it can only be closed.
      toast.error(getErrorMessage(err, 'Could not delete this restaurant.'))
    } finally {
      setBusy(false)
      setDeleting(null)
    }
  }

  return (
    <div className="page">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Owner dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Welcome, {user.first_name || user.username}. Manage your restaurants and orders.</p>
        </div>
        <button type="button" onClick={() => setEditing('new')} className="btn-primary"><Plus className="h-4 w-4" aria-hidden="true" /> New restaurant</button>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <StatCard label="Restaurants" value={data?.length} icon={Store} />
        <StatCard label="New orders (pending)" value={pending.data?.count} icon={BellRing} to="/owner/orders?status=pending" highlight={pending.data?.count > 0} />
        <StatCard label="Confirmed, to prepare" value={confirmed.data?.count} icon={ChefHat} to="/owner/orders?status=confirmed" />
      </div>

      <h2 className="mb-4 text-xl font-semibold">My restaurants</h2>
      {loading ? (
        <RestaurantCardSkeleton count={3} />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data.length === 0 ? (
        <EmptyState icon={Store} title="No restaurants yet" message="Create your first restaurant with a cover photo and logo, then add categories and dishes." action="Create restaurant" onAction={() => setEditing('new')} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((r) => (
            <div key={r.id} className="card group flex animate-fade-in flex-col overflow-hidden transition duration-300 hover:shadow-card-hover">
              <div className="relative">
                <SmartImage src={r.image} alt="" kind="cover" className="aspect-[16/9] w-full" />
                <div className="absolute right-3 top-3"><StatusBadge status={r.is_open ? 'open' : 'closed'} label={r.is_open ? 'Open' : 'Closed'} className="bg-white shadow-sm" /></div>
                <div className="absolute -bottom-6 left-4 rounded-2xl bg-white p-1 shadow-md">
                  <SmartImage src={r.logo} alt={`${r.name} logo`} kind="logo" rounded="rounded-xl" className="h-12 w-12" />
                </div>
              </div>
              <div className="flex flex-1 flex-col px-4 pb-4 pt-8">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold">{r.name}</h3>
                  <RatingBadge rating={r.average_rating} count={r.review_count} className="shrink-0" />
                </div>
                <p className="mt-1 flex items-center gap-1 text-sm text-gray-500"><MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /><span className="truncate">{r.address}, {r.city}</span></p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 border-t border-gray-100 p-3">
                <Link to={`/owner/restaurants/${r.id}`} className="btn-primary btn-sm"><UtensilsCrossed className="h-3.5 w-3.5" aria-hidden="true" /> Menu</Link>
                <button type="button" onClick={() => toggleOpen(r)} disabled={togglingId === r.id} className="btn-outline btn-sm"><Power className="h-3.5 w-3.5" aria-hidden="true" /> {r.is_open ? 'Close' : 'Open'}</button>
                {/* Icon actions stay together so they wrap as one group on narrow cards */}
                <div className="ml-auto flex items-center">
                  <button type="button" onClick={() => setEditing(r)} className="btn-ghost btn-sm px-2" aria-label={`Edit ${r.name}`} title="Edit details and images"><Pencil className="h-4 w-4" aria-hidden="true" /></button>
                  <Link to={`/restaurants/${r.id}`} className="btn-ghost btn-sm px-2" aria-label={`View ${r.name}`} title="View public page"><Eye className="h-4 w-4" aria-hidden="true" /></Link>
                  <button type="button" onClick={() => setDeleting(r)} className="btn-ghost btn-sm px-2 text-red-500 hover:bg-red-50 hover:text-red-600" aria-label={`Delete ${r.name}`} title="Delete"><Trash2 className="h-4 w-4" aria-hidden="true" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing === 'new' ? 'New restaurant' : `Edit ${editing?.name}`} size="max-w-2xl">
        {editing && <RestaurantForm initial={editing === 'new' ? undefined : editing} onSubmit={save} onCancel={() => setEditing(null)} />}
      </Modal>
      <ConfirmDialog
        open={!!deleting}
        title="Delete restaurant?"
        message={`This permanently deletes ${deleting?.name} with its categories and dishes. A restaurant that already has orders can't be deleted; close it instead.`}
        confirmLabel="Delete restaurant"
        danger
        busy={busy}
        onConfirm={remove}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}

function StatCard({ label, value, icon: Icon, to, highlight }) {
  const body = (
    <div className={`card flex items-center gap-4 p-5 transition duration-300 ${to ? 'hover:-translate-y-0.5 hover:shadow-card-hover' : ''} ${highlight ? 'border-brand-200 bg-brand-50/60' : ''}`}>
      <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${highlight ? 'bg-brand-500 text-white' : 'bg-brand-50 text-brand-500'}`}>
        <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <div>
        {value === undefined ? <Skeleton className="mb-1 h-7 w-10" /> : <p className="font-display text-2xl font-bold text-gray-900">{value}</p>}
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  )
  return to ? <Link to={to}>{body}</Link> : body
}
