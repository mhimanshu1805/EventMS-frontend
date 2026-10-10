import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPublicEvent } from '../api/events'
import { createQuery, getMyQueries } from '../api/queries'
import { cancelRegistration, getMyRegistrations } from '../api/registrations'
import ErrorBanner from '../components/ErrorBanner'
import Loading from '../components/Loading'

function formatWhen(value) {
  if (!value) {
    return '—'
  }
  return new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export default function ParticipantDashboard() {
  const [registrations, setRegistrations] = useState([])
  const [queries, setQueries] = useState([])
  const [details, setDetails] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [eventId, setEventId] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const [regs, qs] = await Promise.all([getMyRegistrations(), getMyQueries()])
      setRegistrations(regs)
      setQueries(qs)
      const slugs = [...new Set(regs.map((reg) => reg.eventSlug).filter(Boolean))]
      const loaded = await Promise.all(
        slugs.map(async (slug) => {
          try {
            const event = await getPublicEvent(slug)
            return [slug, event]
          } catch {
            return [slug, null]
          }
        }),
      )
      setDetails(Object.fromEntries(loaded))
      const open = regs.find((reg) => reg.status !== 'CANCELLED')
      setEventId(open ? String(open.eventId) : '')
    } catch {
      setError('Could not load your dashboard')
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel(registration) {
    const ok = window.confirm(`Cancel your registration for "${registration.eventTitle}"?`)
    if (!ok) {
      return
    }
    try {
      await cancelRegistration(registration.id)
      await load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not cancel registration')
    }
  }

  async function handleQuery(event) {
    event.preventDefault()
    setFormError('')
    setSubmitting(true)
    try {
      await createQuery(Number(eventId), message.trim())
      setMessage('')
      const qs = await getMyQueries()
      setQueries(qs)
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not send the query')
    } finally {
      setSubmitting(false)
    }
  }

  const queryEvents = registrations.filter((reg) => reg.status !== 'CANCELLED')

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Participant dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Your registrations and questions.</p>
        </div>
        <Link
          to="/help"
          className="rounded-md border border-slate-300 px-4 py-2 text-center text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          Help
        </Link>
      </div>
      <ErrorBanner message={error} />
      {loading && <Loading />}

      {!loading && (
        <>
          <section className="mt-8">
            <h2 className="text-lg font-semibold text-slate-900">Registrations</h2>
            {registrations.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">
                You have not registered for an event.{' '}
                <Link to="/" className="underline">
                  Browse events
                </Link>
              </p>
            ) : (
              <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-4 py-3 font-medium">Event</th>
                      <th className="px-4 py-3 font-medium">Venue</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((reg) => {
                      const event = details[reg.eventSlug]
                      return (
                        <tr key={reg.id} className="border-b border-slate-100 last:border-0">
                          <td className="px-4 py-3">
                            <Link to={`/events/${reg.eventSlug}`} className="font-medium text-brand underline">
                              {reg.eventTitle}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{event?.venue || '—'}</td>
                          <td className="px-4 py-3 text-slate-600">{formatWhen(event?.startDateTime)}</td>
                          <td className="px-4 py-3 text-slate-600">{reg.status}</td>
                          <td className="px-4 py-3">
                            {reg.status !== 'CANCELLED' && (
                              <button
                                type="button"
                                onClick={() => handleCancel(reg)}
                                className="text-red-700 underline"
                              >
                                Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="mt-10">
            <h2 className="text-lg font-semibold text-slate-900">Queries</h2>
            {queryEvents.length > 0 && (
              <form onSubmit={handleQuery} className="mt-3 max-w-xl space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <ErrorBanner message={formError} />
                <label className="block text-sm font-medium text-slate-700">
                  Event
                  <select
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
                  >
                    {queryEvents.map((reg) => (
                      <option key={reg.id} value={reg.eventId}>
                        {reg.eventTitle}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Message
                  <textarea
                    required
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
                  />
                </label>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md bg-brand hover:bg-brand-dark px-4 py-2 text-sm font-medium text-white disabled:bg-slate-400"
                >
                  {submitting ? 'Sending...' : 'Ask a question'}
                </button>
              </form>
            )}

            {queries.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">You have not asked a question yet.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {queries.map((query) => (
                  <li key={query.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-sm font-medium text-slate-900">{query.eventTitle}</p>
                    <p className="mt-1 text-sm text-slate-700">{query.message}</p>
                    <p className="mt-1 text-xs text-slate-500">{query.status}</p>
                    {query.response && (
                      <p className="mt-2 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700">
                        Response: {query.response}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  )
}
