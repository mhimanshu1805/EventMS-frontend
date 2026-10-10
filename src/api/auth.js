import client from './client'

export function register(name, email, password, role) {
  return client.post('/auth/register', { name, email, password, role }).then((res) => res.data)
}

export function login(email, password) {
  return client.post('/auth/login', { email, password }).then((res) => res.data)
}

export function getAdminUsers() {
  return client.get('/admin/users').then((res) => res.data)
}

export function setUserActive(id, active) {
  return client.patch(`/admin/users/${id}/active`, { active }).then((res) => res.data)
}
