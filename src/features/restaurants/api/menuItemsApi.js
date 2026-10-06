import api, { saveWithFiles } from '@shared/lib/apiClient'

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
