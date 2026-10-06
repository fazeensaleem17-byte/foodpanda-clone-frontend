import { AddressManager } from '@features/addresses'
import { Avatar } from '@shared/components/ui'
import { ROLE_LABELS } from '@shared/utils/constants'
import { formatShortDate } from '@shared/utils/format'
import PasswordForm from '../components/PasswordForm'
import ProfileForm from '../components/ProfileForm'
import { useAuth } from '../hooks/useAuth'

export default function ProfilePage() {
  const { user } = useAuth()
  return (
    <div className="page max-w-4xl">
      <div className="mb-8 flex items-center gap-4">
        <Avatar user={user} size="h-16 w-16 text-xl" />
        <div>
          <h1 className="page-title">
            {[user.first_name, user.last_name].filter(Boolean).join(' ') || user.username}
          </h1>
          <p className="text-sm text-gray-500">
            @{user.username} · {ROLE_LABELS[user.role]}
            {user.profile?.created_at && ` · Member since ${formatShortDate(user.profile.created_at)}`}
          </p>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ProfileForm />
        <div className="space-y-6">
          {user.role === 'customer' && <AddressManager />}
          <PasswordForm />
        </div>
      </div>
    </div>
  )
}
