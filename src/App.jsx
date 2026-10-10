import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import AdminEvents from './pages/admin/AdminEvents'
import AdminLayout from './pages/admin/AdminLayout'
import AdminOrganizers from './pages/admin/AdminOrganizers'
import AdminOverview from './pages/admin/AdminOverview'
import AdminParticipants from './pages/admin/AdminParticipants'
import HelpCenter from './pages/HelpCenter'
import Login from './pages/Login'
import OrganizerDashboard from './pages/OrganizerDashboard'
import OrganizerEventDetail from './pages/OrganizerEventDetail'
import ParticipantDashboard from './pages/ParticipantDashboard'
import PublicEventDetail from './pages/PublicEventDetail'
import NotFound from './pages/NotFound'
import PublicEventList from './pages/PublicEventList'
import Register from './pages/Register'

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  )
}

function Shell() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const isAdmin = pathname.startsWith('/admin')

  return (
    <>
      {!isAdmin && <Navbar />}
      <main
        className={
          isAdmin
            ? 'min-h-screen'
            : isHome
              ? 'min-h-[calc(100vh-4rem)]'
              : 'mx-auto min-h-[calc(100vh-4rem)] max-w-6xl px-4 py-6 sm:px-6'
        }
      >
        <Routes>
          <Route path="/" element={<PublicEventList />} />
          <Route path="/events/:slug" element={<PublicEventDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/help"
            element={
              <ProtectedRoute>
                <HelpCenter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/dashboard"
            element={
              <ProtectedRoute roles={['ORGANIZER']}>
                <OrganizerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/events/:id"
            element={
              <ProtectedRoute roles={['ORGANIZER']}>
                <OrganizerEventDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/participant/dashboard"
            element={
              <ProtectedRoute roles={['PARTICIPANT']}>
                <ParticipantDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['MAIN_ADMIN']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminOverview />} />
            <Route path="organizers" element={<AdminOrganizers />} />
            <Route path="participants" element={<AdminParticipants />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="help" element={<HelpCenter />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  )
}
