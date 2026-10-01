import api from './client'

export const reviewsApi = {
  // Filters: restaurant, rating, user, ordering, page
  list: (params = {}) => api.get('/reviews/', { params }).then((r) => r.data),
  // { restaurant, rating (1-5), comment } - only after a delivered order, once per restaurant
  create: (payload) => api.post('/reviews/', payload).then((r) => r.data),
  update: (id, payload) => api.patch(`/reviews/${id}/`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/reviews/${id}/`),
}
