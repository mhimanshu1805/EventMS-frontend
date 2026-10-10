import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const DASHBOARD_BY_ROLE = {
  ORGANIZER: { to: '/organizer/dashboard', label: 'Organizer dashboard' },
  PARTICIPANT: { to: '/participant/dashboard', label: 'Participant dashboard' },
  MAIN_ADMIN: { to: '/admin/dashboard', label: 'Admin dashboard' },
}

export default function Navbar() {
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()
  const dashboard = DASHBOARD_BY_ROLE[role]

  function handleLogout() {
    logout()
    navigate('/')
  }

  function scrollToEvents(event) {
    if (window.location.pathname !== '/') {
      return
    }
    event.preventDefault()
    document.getElementById('events')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
      <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-slate-900">
        <CalendarIcon />
        EventMS
      </Link>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <Link to="/" className="text-slate-700 hover:text-brand">
          Home
        </Link>
        <Link to="/#events" onClick={scrollToEvents} className="text-slate-700 hover:text-brand">
          Events
        </Link>
        {dashboard && (
          <Link to={dashboard.to} className="text-slate-700 hover:text-brand">
            {dashboard.label}
          </Link>
        )}
        {user && (
          <Link to="/help" className="text-slate-700 hover:text-brand">
            Help
          </Link>
        )}
        {!user && (
          <>
            <Link
              to="/login"
              className="rounded-md border border-slate-300 px-3 py-1.5 font-medium text-slate-800 hover:bg-slate-50"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-md bg-brand px-3 py-1.5 font-medium text-white hover:bg-brand-dark"
            >
              Sign Up
            </Link>
          </>
        )}
        {user && (
          <>
            <span className="font-medium text-slate-800">{user.name}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-slate-800 hover:bg-slate-50"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-6 w-6 text-brand"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M8 3.5v3M16 3.5v3M3.5 10h17" />
    </svg>
  )
}
