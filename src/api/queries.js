import client from './client'

export function createQuery(eventId, message) {
  return client.post(`/events/${eventId}/queries`, { message }).then((res) => res.data)
}

export function getMyQueries() {
  return client.get('/queries/my').then((res) => res.data)
}

export function respondToQuery(id, response) {
  return client.patch(`/queries/${id}/respond`, { response }).then((res) => res.data)
}
