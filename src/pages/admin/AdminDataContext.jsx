import { createContext, useContext, useEffect, useState } from 'react'
import { getAdminUsers, setUserActive } from '../../api/auth'
import { deleteAdminEvent, getAdminEvents } from '../../api/events'

const AdminDataContext = createContext(null)

export function AdminDataProvider({ children }) {
  const [users, setUsers] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const [nextUsers, nextEvents] = await Promise.all([getAdminUsers(), getAdminEvents()])
      setUsers(nextUsers)
      setEvents(nextEvents)
    } catch {
      setError('Could not load admin data')
    } finally {
      setLoading(false)
    }
  }

  async function updateActive(id, active) {
    const updated = await setUserActive(id, active)
    setUsers((current) => current.map((row) => (row.id === updated.id ? updated : row)))
    return updated
  }

  async function removeEvent(id) {
    await deleteAdminEvent(id)
    setEvents((current) => current.filter((event) => event.id !== id))
  }

  return (
    <AdminDataContext.Provider value={{ users, events, loading, error, reload: load, updateActive, removeEvent }}>
      {children}
    </AdminDataContext.Provider>
  )
}

export function useAdminData() {
  return useContext(AdminDataContext)
}
