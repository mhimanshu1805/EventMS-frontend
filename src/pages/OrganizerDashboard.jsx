import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  createEvent,
  deleteEvent,
  getEventStats,
  getMyEvents,
  posterImageUrl,
  updateEvent,
  updateEventStatus,
  uploadEventPoster,
} from '../api/events'
import ErrorBanner from '../components/ErrorBanner'
import EventForm from '../components/EventForm'
import Loading from '../components/Loading'

export default function OrganizerDashboard() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const list = await getMyEvents()
      const withCounts = await Promise.all(
        list.map(async (event) => {
          try {
            const stats = await getEventStats(event.id)
            return { ...event, registrationCount: stats.totalRegistrations }
          } catch {
            return { ...event, registrationCount: 0 }
          }
        }),
      )
      setEvents(withCounts)
    } catch {
      setError('Could not load your events')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(payload, posterFile) {
    setSaving(true)
    setFormError('')
    try {
      if (modal?.mode === 'edit') {
        await updateEvent(modal.event.id, payload)
        setModal(null)
        await load()
        return
      }
      const created = await createEvent(payload)
      if (posterFile) {
        try {
          await uploadEventPoster(created.id, posterFile)
        } catch (err) {
          await load()
          setFormError(err.response?.data?.message || 'Event was created, but the poster could not be uploaded')
          return
        }
      }
      setModal(null)
      await load()
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not save the event')
    } finally {
      setSaving(false)
    }
  }

  async function togglePublish(event) {
    const next = event.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED'
    try {
      await updateEventStatus(event.id, next)
      await load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not change status')
    }
  }

  async function handleDelete(event) {
    const ok = window.confirm(`Delete "${event.title}"? This cannot be undone.`)
    if (!ok) {
      return
    }
    try {
      await deleteEvent(event.id)
      await load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete the event')
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Organizer dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Create and manage your events.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/help"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            Help
          </Link>
          <button
            type="button"
            onClick={() => {
              setFormError('')
              setModal({ mode: 'create' })
            }}
            className="rounded-md bg-brand hover:bg-brand-dark px-4 py-2 text-sm font-medium text-white"
          >
            Create Event
          </button>
        </div>
      </div>

      <ErrorBanner message={error} />
      {loading && <Loading label="Loading events..." />}
      {!loading && events.length === 0 && (
        <p className="mt-8 text-sm text-slate-500">You have not created any events yet.</p>
      )}

      {!loading && events.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Poster</th>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Capacity</th>
                <th className="px-4 py-3 font-medium">Registrations</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3">
                    <PosterThumb posterUrl={event.posterUrl} title={event.title} />
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      to={`/organizer/events/${event.id}`}
                      className="font-medium text-brand underline"
                    >
                      {event.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{event.status}</td>
                  <td className="px-4 py-3 text-slate-600">{event.capacity}</td>
                  <td className="px-4 py-3 text-slate-600">{event.registrationCount ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setFormError('')
                          setModal({ mode: 'edit', event })
                        }}
                        className="text-slate-700 underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => togglePublish(event)}
                        className="text-slate-700 underline"
                      >
                        {event.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(event)}
                        className="text-red-700 underline"
                      >
                        Delete
                      </button>
                      <Link to={`/organizer/events/${event.id}`} className="text-slate-700 underline">
                        Manage
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              {modal.mode === 'edit' ? 'Edit event' : 'Create event'}
            </h2>
            <EventForm
              key={modal.event?.id || 'create'}
              initialEvent={modal.event}
              submitting={saving}
              error={formError}
              includePoster={modal.mode === 'create'}
              submitLabel={modal.mode === 'edit' ? 'Save changes' : 'Create event'}
              onCancel={() => setModal(null)}
              onSubmit={handleSave}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function PosterThumb({ posterUrl, title }) {
  const src = posterImageUrl(posterUrl)
  if (!src) {
    return (
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-soft text-brand" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="4" y="5" width="16" height="14" rx="2" />
          <path d="m8 15 2.5-2.5L14 16l2-2 2 2" />
          <circle cx="9" cy="9" r="1" />
        </svg>
      </span>
    )
  }
  return <img src={src} alt="" className="h-10 w-10 rounded-md object-cover" title={title} />
}
