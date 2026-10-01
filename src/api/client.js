import axios from 'axios'
import { tokenStore } from './tokens'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'

// By default requests go to the same-origin path (e.g. "/api") and the Vite
// server (`npm run dev` or `npm run preview`) proxies them to Django - see
// vite.config.js. This avoids CORS errors, because the backend does not send
// CORS headers. Set VITE_API_DIRECT=true to call VITE_API_URL directly
// (only works if the backend enables CORS for this site).
const baseURL = import.meta.env.VITE_API_DIRECT === 'true' ? API_URL : new URL(API_URL).pathname

// No fixed Content-Type: axios sends plain objects as JSON and FormData as
// multipart/form-data (with the boundary) automatically. Forcing
// "application/json" here would make axios convert FormData to JSON and
// break image uploads.
const api = axios.create({ baseURL })

// A separate instance without interceptors, used for the refresh call itself
// so that a failing refresh can never trigger another refresh (infinite loop).
const plain = axios.create({ baseURL })

/* ------------------------------------------------------------------ *
 * REQUEST interceptor: attach "Authorization: Bearer <access token>"
 * to every outgoing request when the user is logged in.
 * ------------------------------------------------------------------ */
api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

/* ------------------------------------------------------------------ *
 * RESPONSE interceptor: on 401, refresh the access token once and
 * replay the original request with the new token.
 *
 * - Several requests may fail with 401 at the same time (e.g. a page that
 *   loads orders + addresses). We keep ONE shared refresh promise so only
 *   one call hits /auth/token/refresh/ and the others wait for it.
 * - If refreshing fails (refresh token expired/invalid) we clear tokens and
 *   notify AuthContext through onAuthFailure so it logs the user out.
 * ------------------------------------------------------------------ */
let refreshPromise = null
let onAuthFailure = () => {}

export function setAuthFailureHandler(handler) {
  onAuthFailure = handler
}

async function refreshAccessToken() {
  const refresh = tokenStore.getRefresh()
  if (!refresh) throw new Error('No refresh token')
  const { data } = await plain.post('/auth/token/refresh/', { refresh })
  // SimpleJWT returns { access } (plus { refresh } if rotation is enabled).
  tokenStore.set(data)
  return data.access
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    const status = error.response?.status
    const url = original?.url || ''
    const isAuthEndpoint = url.includes('/auth/login/') || url.includes('/auth/register/')

    if (status === 401 && original && !original._retry && !isAuthEndpoint && original.headers?.Authorization) {
      original._retry = true // never retry the same request twice
      try {
        refreshPromise = refreshPromise || refreshAccessToken().finally(() => { refreshPromise = null })
        const newAccess = await refreshPromise
        original.headers.Authorization = `Bearer ${newAccess}`
        return api(original)
      } catch {
        // Refresh failed: the session is over. Log out, then replay the request
        // once WITHOUT a token - public endpoints (restaurants, menus, reviews)
        // still succeed, protected ones fail with 401 and the page handles it.
        tokenStore.clear()
        onAuthFailure()
        delete original.headers.Authorization
        return api(original)
      }
    }
    return Promise.reject(error)
  },
)

/** Unwrap a DRF paginated response ({count, next, previous, results}) or a plain array. */
export const resultsOf = (data) => (Array.isArray(data) ? data : data?.results ?? [])

/**
 * Create (id = null -> POST) or update (PATCH) a resource that may carry image files.
 *
 * - No File in `data`  -> plain JSON. `{ image: null }` removes an image.
 * - Any File in `data` -> multipart/form-data (the backend's upload format).
 *   Multipart can't express null, so image removals requested in the same
 *   save are sent afterwards as a small JSON PATCH.
 */
export async function saveWithFiles(baseUrl, id, data) {
  const url = id ? `${baseUrl}${id}/` : baseUrl
  const method = id ? 'patch' : 'post'
  const hasFile = Object.values(data).some((v) => v instanceof File)
  if (!hasFile) return (await api({ method, url, data })).data

  const form = new FormData()
  const removals = {}
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue
    if (value === null) removals[key] = null
    else form.append(key, typeof value === 'boolean' ? String(value) : value)
  }
  let saved = (await api({ method, url, data: form })).data
  if (Object.keys(removals).length) saved = (await api.patch(`${baseUrl}${saved.id}/`, removals)).data
  return saved
}

export default api
