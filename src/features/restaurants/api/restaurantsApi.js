import api, { saveWithFiles } from '@shared/lib/apiClient'

export const restaurantsApi = {
  // The API has no "cities" endpoint, so walk the (small) restaurant list once
  // and collect distinct cities for the Home page filter. Capped at 10 pages.
  async cities() {
    const cities = new Set()
    for (let page = 1; page <= 10; page++) {
      const { data } = await api.get('/restaurants/', { params: { page } })
      data.results.forEach((r) => r.city && cities.add(r.city.trim()))
      if (!data.next) break
    }
    return [...cities].sort((a, b) => a.localeCompare(b))
  },
  // Filters: city, is_open, owner, min_rating, search, ordering, page
  list: (params = {}) => api.get('/restaurants/', { params }).then((r) => r.data),
  get: (id) => api.get(`/restaurants/${id}/`).then((r) => r.data),
  // { restaurant, categories: [{ id, name, items: [...] }] }; the owner also sees unavailable items
  menu: (id) => api.get(`/restaurants/${id}/menu/`).then((r) => r.data),
  // Restaurants owned by the logged-in owner (paginated)
  mine: (params = {}) => api.get('/restaurants/mine/', { params }).then((r) => r.data),
  // { name, description, city, address, phone, is_open, image?: File|null, logo?: File|null }
  // Files are sent as multipart/form-data; null removes an image.
  create: (payload) => saveWithFiles('/restaurants/', null, payload),
  update: (id, payload) => saveWithFiles('/restaurants/', id, payload),
  // 409 if the restaurant has orders
  remove: (id) => api.delete(`/restaurants/${id}/`),
}
