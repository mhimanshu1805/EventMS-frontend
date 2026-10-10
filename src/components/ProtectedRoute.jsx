import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const HOME_BY_ROLE = {
  ORGANIZER: '/organizer/dashboard',
  PARTICIPANT: '/participant/dashboard',
  MAIN_ADMIN: '/admin/dashboard',
}

/**
 * Sends guests to /login. If roles is set, a logged-in user with another role
 * is sent to their own dashboard.
 */
export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={HOME_BY_ROLE[user.role] || '/'} replace />
  }

  return children
}
