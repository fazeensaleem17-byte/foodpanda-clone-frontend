import api from '@shared/lib/apiClient'

export const authApi = {
  // POST /auth/register/ -> { user, tokens: { access, refresh } }
  register: (payload) => api.post('/auth/register/', payload).then((r) => r.data),
  // POST /auth/login/ -> { access, refresh }
  login: (username, password) => api.post('/auth/login/', { username, password }).then((r) => r.data),
  // GET /auth/me/ -> user with nested profile
  me: () => api.get('/auth/me/').then((r) => r.data),
  // PATCH /auth/me/ (username and role are read-only on the server)
  updateMe: (payload) => api.patch('/auth/me/', payload).then((r) => r.data),
  changePassword: (old_password, new_password) =>
    api.post('/auth/change-password/', { old_password, new_password }).then((r) => r.data),
}
