import client, { API_ORIGIN } from './client'

export function posterImageUrl(posterUrl) {
  if (!posterUrl) {
    return null
  }
  if (posterUrl.startsWith('http')) {
    return posterUrl
  }
  return `${API_ORIGIN}${posterUrl}`
}

export function getPublicEvents(search) {
  return client.get('/events/public', { params: search ? { search } : {} }).then((res) => res.data)
}

export function getPublicEvent(slug) {
  return client.get(`/events/public/${slug}`).then((res) => res.data)
}

export function createEvent(event) {
  return client.post('/events', event).then((res) => res.data)
}

export function getMyEvents() {
  return client.get('/events/my').then((res) => res.data)
}

export function getEvent(id) {
  return client.get(`/events/${id}`).then((res) => res.data)
}

export function updateEvent(id, event) {
  return client.put(`/events/${id}`, event).then((res) => res.data)
}

export function updateEventStatus(id, status) {
  return client.patch(`/events/${id}/status`, { status }).then((res) => res.data)
}

export function deleteEvent(id) {
  return client.delete(`/events/${id}`)
}

export function uploadEventPoster(id, file) {
  const body = new FormData()
  body.append('file', file)
  return client.post(`/events/${id}/poster`, body).then((res) => res.data)
}

export function deleteEventPoster(id) {
  return client.delete(`/events/${id}/poster`).then((res) => res.data)
}

export function getEventRegistrations(eventId) {
  return client.get(`/events/${eventId}/registrations`).then((res) => res.data)
}

export function getEventStats(eventId) {
  return client.get(`/events/${eventId}/stats`).then((res) => res.data)
}

export function getEventQueries(eventId) {
  return client.get(`/events/${eventId}/queries`).then((res) => res.data)
}

export function getEventQr(id) {
  return client.get(`/events/${id}/qr`, { responseType: 'blob' }).then((res) => res.data)
}

export function getAdminEvents() {
  return client.get('/admin/events').then((res) => res.data)
}

export function deleteAdminEvent(id) {
  return client.delete(`/admin/events/${id}`)
}
