import api, { saveWithFiles } from './client'

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

export const categoriesApi = {
  list: (params = {}) => api.get('/categories/', { params }).then((r) => r.data),
  // { restaurant, name } - name must be unique within the restaurant
  create: (payload) => api.post('/categories/', payload).then((r) => r.data),
  update: (id, payload) => api.patch(`/categories/${id}/`, payload).then((r) => r.data),
  // 409 if any of its dishes has been ordered
  remove: (id) => api.delete(`/categories/${id}/`),
}

export const menuItemsApi = {
  // Filters: restaurant, category, is_available, min_price, max_price, search, ordering, page
  list: (params = {}) => api.get('/menu-items/', { params }).then((r) => r.data),
  // Every available dish across restaurants (capped at 5 pages), used for the Home cuisines row.
  async all(maxPages = 5) {
    const items = []
    for (let page = 1; page <= maxPages; page++) {
      const { data } = await api.get('/menu-items/', { params: { page } })
      items.push(...data.results)
      if (!data.next) break
    }
    return items
  },
  get: (id) => api.get(`/menu-items/${id}/`).then((r) => r.data),
  // { restaurant, category, name, description, price, is_available, image?: File|null }
  create: (payload) => saveWithFiles('/menu-items/', null, payload),
  update: (id, payload) => saveWithFiles('/menu-items/', id, payload),
  // 409 if the dish appears in any order
  remove: (id) => api.delete(`/menu-items/${id}/`),
}
