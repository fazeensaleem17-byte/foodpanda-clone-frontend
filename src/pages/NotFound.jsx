import { MapPinOff } from 'lucide-react'
import { EmptyState } from '../components/StateMessages'

export default function NotFound() {
  return (
    <div className="page max-w-2xl">
      <EmptyState icon={MapPinOff} title="Page not found" message="The page you're looking for doesn't exist or has moved." action="Back to restaurants" actionTo="/" />
    </div>
  )
}
