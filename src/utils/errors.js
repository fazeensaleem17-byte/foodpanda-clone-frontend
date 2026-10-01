/**
 * Convert an Axios/DRF error into one friendly, human-readable message.
 *
 * DRF errors come in several shapes:
 *   { detail: "..." }
 *   { field: ["msg", ...], other_field: ["msg"] }
 *   { non_field_errors: ["msg"] }
 *   { items: "msg" }  or nested lists/objects
 */
export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (!error) return fallback
  if (!error.response) {
    if (error.code === 'ERR_NETWORK') {
      return 'Cannot reach the server. Is the Django backend running on http://127.0.0.1:8000?'
    }
    return error.message || fallback
  }

  const { status, data } = error.response
  if (status >= 500) return 'The server had a problem handling this request.'
  if (typeof data === 'string') {
    return status === 404 ? 'Not found.' : fallback
  }
  if (data?.detail) return String(data.detail)

  const messages = flatten(data)
  if (messages.length) return messages.join(' ')

  if (status === 401) return 'Please log in to continue.'
  if (status === 403) return 'You are not allowed to do that.'
  if (status === 404) return 'Not found.'
  return fallback
}

/** Field-level errors: { username: "A user with that username already exists." } */
export function getFieldErrors(error) {
  const data = error?.response?.data
  if (!data || typeof data !== 'object' || Array.isArray(data)) return {}
  const out = {}
  for (const [key, value] of Object.entries(data)) {
    out[key] = flatten(value).join(' ')
  }
  return out
}

const pretty = (key) => key.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())

function flatten(value, key) {
  if (value == null) return []
  if (typeof value === 'string') return [key && key !== 'non_field_errors' && key !== 'detail' ? `${pretty(key)}: ${value}` : value]
  if (Array.isArray(value)) return value.flatMap((v) => flatten(v, key))
  if (typeof value === 'object') return Object.entries(value).flatMap(([k, v]) => flatten(v, k))
  return [String(value)]
}
