import { BellRing, ChefHat, Plus, Store } from 'lucide-react'
import { useAuth } from '@features/auth'
import { ConfirmDialog, EmptyState, ErrorState, Modal, RestaurantCardSkeleton } from '@shared/components/ui'
import OwnerRestaurantCard from '../components/OwnerRestaurantCard'
import RestaurantForm from '../components/RestaurantForm'
import StatCard from '../components/StatCard'
import { useOwnerDashboard } from '../hooks/useOwnerDashboard'

export default function OwnerDashboardPage() {
  const { user } = useAuth()
  const dashboard = useOwnerDashboard()
  const { restaurants, loading, error, reload, editing, setEditing, deleting, setDeleting } = dashboard

  return (
    <div className="page">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="page-title">Owner dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome, {user.first_name || user.username}. Manage your restaurants and orders.
          </p>
        </div>
        <button type="button" onClick={() => setEditing('new')} className="btn-primary">
          <Plus className="h-4 w-4" aria-hidden="true" /> New restaurant
        </button>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <StatCard label="Restaurants" value={restaurants?.length} icon={Store} />
        <StatCard
          label="New orders (pending)"
          value={dashboard.pendingCount}
          icon={BellRing}
          to="/owner/orders?status=pending"
          highlight={dashboard.pendingCount > 0}
        />
        <StatCard
          label="Confirmed, to prepare"
          value={dashboard.confirmedCount}
          icon={ChefHat}
          to="/owner/orders?status=confirmed"
        />
      </div>

      <h2 className="mb-4 text-xl font-semibold">My restaurants</h2>
      {loading ? (
        <RestaurantCardSkeleton count={3} />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : restaurants.length === 0 ? (
        <EmptyState
          icon={Store}
          title="No restaurants yet"
          message="Create your first restaurant with a cover photo and logo, then add categories and dishes."
          action="Create restaurant"
          onAction={() => setEditing('new')}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {restaurants.map((r) => (
            <OwnerRestaurantCard
              key={r.id}
              restaurant={r}
              toggling={dashboard.togglingId === r.id}
              onToggleOpen={() => dashboard.toggleOpen(r)}
              onEdit={() => setEditing(r)}
              onDelete={() => setDeleting(r)}
            />
          ))}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'New restaurant' : `Edit ${editing?.name}`}
        size="max-w-2xl"
      >
        {editing && (
          <RestaurantForm
            initial={editing === 'new' ? undefined : editing}
            onSubmit={dashboard.save}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>
      <ConfirmDialog
        open={!!deleting}
        title="Delete restaurant?"
        message={`This permanently deletes ${deleting?.name} with its categories and dishes. A restaurant that already has orders can't be deleted; close it instead.`}
        confirmLabel="Delete restaurant"
        danger
        busy={dashboard.busy}
        onConfirm={dashboard.remove}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
