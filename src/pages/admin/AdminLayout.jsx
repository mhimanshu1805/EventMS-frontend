import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { AdminDataProvider } from './AdminDataContext'

const LINKS = [
  { to: '/admin/dashboard', label: 'Overview' },
  { to: '/admin/organizers', label: 'Organizers' },
  { to: '/admin/participants', label: 'Participants' },
  { to: '/admin/events', label: 'Events' },
  { to: '/admin/help', label: 'Help' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <AdminDataProvider>
      <div className="min-h-screen bg-slate-50 lg:flex">
        {open && (
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-20 bg-slate-900/40 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}
        <aside
          className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform lg:static lg:translate-x-0 ${
            open ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Link to="/admin/dashboard" className="flex items-center gap-2 px-5 py-5 text-lg font-semibold text-slate-900" onClick={() => setOpen(false)}>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm text-white">E</span>
            EventMS
          </Link>
          <nav className="flex flex-1 flex-col gap-1 px-3">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
                    isActive ? 'bg-brand-soft text-brand-dark' : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <Link
            to="/"
            className="m-3 rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            Back to Home
          </Link>
        </aside>
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
            <button
              type="button"
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-800 lg:hidden"
              onClick={() => setOpen(true)}
            >
              Menu
            </button>
            <p className="hidden text-sm text-slate-500 lg:block">Administration</p>
            <div className="ml-auto flex items-center gap-3">
              <span className="text-sm font-medium text-slate-800">{user?.name}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-800 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                Logout
              </button>
            </div>
          </header>
          <div className="flex-1 px-4 py-6 sm:px-6">
            <Outlet />
          </div>
        </div>
      </div>
    </AdminDataProvider>
  )
}
