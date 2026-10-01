import api from './client'

export const addressesApi = {
  // The current user's addresses; default first
  list: (params = {}) => api.get('/addresses/', { params }).then((r) => r.data),
  // { label: 'home' | 'work' | 'other', city, area, street, is_default }
  create: (payload) => api.post('/addresses/', payload).then((r) => r.data),
  update: (id, payload) => api.patch(`/addresses/${id}/`, payload).then((r) => r.data),
  // Returns 409 if an existing order uses this address
  remove: (id) => api.delete(`/addresses/${id}/`),
}
