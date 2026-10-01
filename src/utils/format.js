/** Format a number or DRF decimal string ("520.00") as Pakistani Rupees. */
export function formatPrice(value) {
  const n = Number(value ?? 0)
  return `Rs. ${n.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

export function formatDate(iso) {
  if (!iso) return '-'
  return new Date(iso).toLocaleString('en-PK', {
    day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit',
  })
}

export function formatShortDate(iso) {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Turn "demo_owner (owner)" (DRF StringRelatedField for users) into "demo_owner". */
export function usernameOf(userString) {
  return (userString || '').replace(/\s*\([^)]*\)\s*$/, '')
}

export function formatAddress(a) {
  if (!a) return '-'
  return [a.street, a.area, a.city].filter(Boolean).join(', ')
}

export const capitalize = (s = '') => s.charAt(0).toUpperCase() + s.slice(1)
