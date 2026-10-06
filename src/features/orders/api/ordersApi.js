import api from '@shared/lib/apiClient'

export const ordersApi = {
  // Customers see their own orders, owners their restaurants' orders, riders their deliveries.
  // Filters: status, restaurant, ordering, page
  list: (params = {}) => api.get('/orders/', { params }).then((r) => r.data),
  get: (id) => api.get(`/orders/${id}/`).then((r) => r.data),
  // { restaurant, address, payment_method: 'cash' | 'card', items: [{ menu_item, quantity }] }
  create: (payload) => api.post('/orders/', payload).then((r) => r.data),
  // Owner: confirmed / preparing / cancelled. Rider: on_the_way / delivered.
  setStatus: (id, status) => api.post(`/orders/${id}/status/`, { status }).then((r) => r.data),
  // Customer, only while pending
  cancel: (id) => api.post(`/orders/${id}/cancel/`).then((r) => r.data),
  // Customer, simulated card payment
  pay: (id) => api.post(`/orders/${id}/pay/`).then((r) => r.data),
  // Rider: unclaimed 'preparing' orders, and claiming one
  available: (params = {}) => api.get('/orders/available/', { params }).then((r) => r.data),
  accept: (id) => api.post(`/orders/${id}/accept/`).then((r) => r.data),
}
