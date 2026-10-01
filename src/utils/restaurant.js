// The API has no delivery-time field, so we show a stable, plausible ESTIMATE
// derived from the restaurant id (same restaurant -> same estimate every time).
export function deliveryEstimate(id = 0) {
  const start = 20 + ((Number(id) * 7) % 4) * 5 // 20, 25, 30 or 35
  return `${start}-${start + 15} min`
}

/** Two-letter initials, used for avatars when there is no profile image. */
export function initialsOf(text = '') {
  return text.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?'
}
