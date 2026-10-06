import { MapPinOff } from 'lucide-react'
import { EmptyState } from '@shared/components/ui'

export default function NotFoundPage() {
  return (
    <div className="page max-w-2xl">
      <EmptyState
        icon={MapPinOff}
        title="Page not found"
        message="The page you're looking for doesn't exist or has moved."
        action="Back to restaurants"
        actionTo="/"
      />
    </div>
  )
}
