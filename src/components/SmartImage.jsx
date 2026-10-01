import { useState } from 'react'
import { ImageOff, Store, UtensilsCrossed } from 'lucide-react'

const FALLBACK_ICONS = { dish: UtensilsCrossed, logo: Store, cover: ImageOff }

/**
 * Image from the API with three states:
 *  - loading: shimmering skeleton
 *  - loaded:  fades in
 *  - missing / broken URL: clean neutral placeholder (no emoji)
 *
 * `className` sizes the box; the image always covers it.
 */
export default function SmartImage({ src, alt = '', className = '', kind = 'dish', rounded = '', eager = false }) {
  // Remount on src change so a new URL starts in the "loading" state again.
  return <ImageInner key={src || 'none'} src={src} alt={alt} className={className} kind={kind} rounded={rounded} eager={eager} />
}

function ImageInner({ src, alt, className, kind, rounded, eager }) {
  const [status, setStatus] = useState(src ? 'loading' : 'error')
  const Icon = FALLBACK_ICONS[kind] ?? UtensilsCrossed

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${rounded} ${className}`}>
      {status !== 'error' && (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={`h-full w-full object-cover transition-opacity duration-500 ${status === 'loaded' ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
      {status === 'loading' && <div className="skeleton absolute inset-0 rounded-none" aria-hidden="true" />}
      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400" role={alt ? 'img' : undefined} aria-label={alt || undefined}>
          <Icon className="h-1/3 max-h-10 w-1/3 max-w-10" strokeWidth={1.5} aria-hidden="true" />
        </div>
      )}
    </div>
  )
}
