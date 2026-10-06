import { RefreshCw } from 'lucide-react'
import { useAuth } from '@features/auth'
import { STATUS_LABELS } from '@features/orders'
import ActiveDeliveries from '../components/ActiveDeliveries'
import AvailableOrders from '../components/AvailableOrders'
import DeliveryHistory from '../components/DeliveryHistory'
import RiderTabs from '../components/RiderTabs'
import { useRiderDashboard } from '../hooks/useRiderDashboard'

export default function RiderDashboardPage() {
  const { user } = useAuth()
  const rider = useRiderDashboard()
  const { tab, page, busy } = rider

  return (
    <div className="page max-w-5xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Rider dashboard</h1>
          <p className="text-sm text-gray-500">
            Hi {user.first_name || user.username}! Auto-refreshes every 20 seconds.
          </p>
        </div>
        <button type="button" onClick={rider.refresh} className="btn-outline">
          <RefreshCw className="h-4 w-4" aria-hidden="true" /> Refresh
        </button>
      </div>

      <RiderTabs tab={tab} counts={rider.counts} onChange={rider.switchTab} />

      {tab === 'active' && rider.hasPreparingOrders && (
        <p className="mb-4 rounded-xl bg-violet-50 p-3 text-sm text-violet-800">
          Orders still <strong>{STATUS_LABELS.preparing.toLowerCase()}</strong> are being cooked — mark them
          &quot;on the way&quot; once you pick them up.
        </p>
      )}

      {tab === 'available' && (
        <AvailableOrders
          orders={rider.available}
          page={page}
          busy={busy}
          onPageChange={rider.setPage}
          onAccept={rider.accept}
        />
      )}
      {tab === 'active' && (
        <ActiveDeliveries
          orders={rider.active}
          busy={busy}
          onChangeStatus={rider.changeStatus}
          onSeeAvailable={() => rider.switchTab('available')}
        />
      )}
      {tab === 'history' && (
        <DeliveryHistory orders={rider.history} page={page} onPageChange={rider.setPage} />
      )}
    </div>
  )
}
