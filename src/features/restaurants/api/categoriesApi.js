import api from '@shared/lib/apiClient'

export const categoriesApi = {
  list: (params = {}) => api.get('/categories/', { params }).then((r) => r.data),
  // { restaurant, name } - name must be unique within the restaurant
  create: (payload) => api.post('/categories/', payload).then((r) => r.data),
  update: (id, payload) => api.patch(`/categories/${id}/`, payload).then((r) => r.data),
  // 409 if any of its dishes has been ordered
  remove: (id) => api.delete(`/categories/${id}/`),
}
