import { useEffect, useId, useMemo, useRef } from 'react'
import { ImagePlus, RefreshCw, Trash2 } from 'lucide-react'
import SmartImage from './SmartImage'

const MAX_MB = 5 // backend limit per image
const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif'

/**
 * Pick an image file and preview it before saving.
 *
 * value:   File (newly picked) | null (removed) | undefined (unchanged)
 * current: the image URL already saved on the server (if any)
 * onChange(value) is called with the same three-state value, which the
 * API layer turns into multipart upload / JSON null / nothing.
 */
export default function ImageUpload({
  label,
  value,
  current,
  onChange,
  onError,
  kind = 'dish',
  aspect = 'aspect-[16/9]',
  hint,
}) {
  const inputId = useId()
  const inputRef = useRef(null)

  // Object URL for a freshly picked file; revoked when it changes.
  const previewUrl = useMemo(() => (value instanceof File ? URL.createObjectURL(value) : null), [value])
  useEffect(() => () => previewUrl && URL.revokeObjectURL(previewUrl), [previewUrl])

  const shown = value === null ? null : previewUrl || current

  const pick = (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-picking the same file
    if (!file) return
    if (!file.type.startsWith('image/'))
      return onError?.('Please choose an image file (JPEG, PNG, WebP or GIF).')
    if (file.size > MAX_MB * 1024 * 1024) return onError?.(`Image must be ${MAX_MB} MB or smaller.`)
    onChange(file)
  }

  return (
    <div>
      <span className="label">{label}</span>
      <div
        className={`group relative overflow-hidden rounded-xl border-2 border-dashed transition ${shown ? 'border-transparent' : 'border-gray-200 hover:border-brand-300'} ${aspect}`}
      >
        {shown ? (
          <>
            <SmartImage src={shown} alt={`${label} preview`} kind={kind} className="h-full w-full" />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-gray-900/50 opacity-0 transition duration-200 group-focus-within:opacity-100 group-hover:opacity-100">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="btn btn-sm bg-white text-gray-800 hover:bg-gray-100"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> Replace
              </button>
              <button
                type="button"
                onClick={() => onChange(current ? null : undefined)}
                className="btn btn-sm bg-white text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Remove
              </button>
            </div>
          </>
        ) : (
          <label
            htmlFor={inputId}
            className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1.5 bg-gray-50 p-3 text-center text-gray-500 transition hover:bg-brand-50/50 hover:text-brand-600"
          >
            <ImagePlus className="h-7 w-7" strokeWidth={1.5} aria-hidden="true" />
            <span className="text-sm font-medium">Upload image</span>
            <span className="text-xs text-gray-400">{hint || `JPEG, PNG or WebP, up to ${MAX_MB} MB`}</span>
          </label>
        )}
      </div>
      {value instanceof File && <p className="mt-1 truncate text-xs text-gray-500">New: {value.name}</p>}
      {value === null && current && (
        <p className="mt-1 text-xs text-gray-500">
          Will be removed on save.{' '}
          <button
            type="button"
            className="cursor-pointer font-medium text-brand-600 hover:underline"
            onClick={() => onChange(undefined)}
          >
            Undo
          </button>
        </p>
      )}
      <input ref={inputRef} id={inputId} type="file" accept={ACCEPT} className="sr-only" onChange={pick} />
    </div>
  )
}
