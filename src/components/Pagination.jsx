import { ChevronLeft, ChevronRight } from 'lucide-react'

const PAGE_SIZE = 10 // matches REST_FRAMEWORK.PAGE_SIZE on the backend

/** Prev / next controls for DRF page-number pagination ({ count, next, previous }). */
export default function Pagination({ data, page, onPageChange }) {
  if (!data || (!data.next && !data.previous)) return null
  const totalPages = Math.max(1, Math.ceil((data.count || 0) / PAGE_SIZE))
  return (
    <nav className="mt-8 flex items-center justify-center gap-3" aria-label="Pagination">
      <button type="button" className="btn-outline btn-sm" disabled={!data.previous} onClick={() => onPageChange(page - 1)}>
        <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Previous
      </button>
      <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
      <button type="button" className="btn-outline btn-sm" disabled={!data.next} onClick={() => onPageChange(page + 1)}>
        Next <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  )
}
