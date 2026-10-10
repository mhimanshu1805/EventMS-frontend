import client from './client'

export function registerForEvent(eventId, phone) {
  return client.post(`/events/${eventId}/register`, { phone }).then((res) => res.data)
}

export function getMyRegistrations() {
  return client.get('/registrations/my').then((res) => res.data)
}

export function cancelRegistration(id) {
  return client.patch(`/registrations/${id}/cancel`).then((res) => res.data)
}

export function updateRegistrationStatus(id, status) {
  return client.patch(`/registrations/${id}/status`, { status }).then((res) => res.data)
}
