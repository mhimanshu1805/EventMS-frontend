import axios from 'axios'

// Poster files are served from the host, not under /api.
export const API_ORIGIN = 'http://localhost:8080'

// All API paths are relative to /api, matching the backend README.
const client = axios.create({
  baseURL: `${API_ORIGIN}/api`,
})

// Attach the saved JWT so protected routes do not need a header on every call.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('ems_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default client
