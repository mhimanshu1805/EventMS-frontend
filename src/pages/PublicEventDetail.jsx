import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getPublicEvent, posterImageUrl } from '../api/events'
import { registerForEvent } from '../api/registrations'
import ErrorBanner from '../components/ErrorBanner'
import Loading from '../components/Loading'
import { useAuth } from '../context/AuthContext'

function formatWhen(value) {
  return new Date(value).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })
}

export default function PublicEventDetail() {
  const { slug } = useParams()
  const { role } = useAuth()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const [formError, setFormError] = useState('')

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    setLoadError('')
    setEvent(null)
    getPublicEvent(slug)
      .then(setEvent)
      .catch((err) => {
        if (err.response?.status === 404) {
          setNotFound(true)
        } else {
          setLoadError('Could not load this event')
        }
      })
      .finally(() => setLoading(false))
  }, [slug])

  async function handleRegister(e) {
    e.preventDefault()
    setFormError('')
    setSuccess('')
    setSubmitting(true)
    try {
      await registerForEvent(event.id, phone)
      setSuccess('You are registered. Status: pending.')
      setShowForm(false)
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not register')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <Loading label="Loading event..." />
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-xl">
        <h1 className="text-2xl font-semibold text-slate-900">Event not found</h1>
        <p className="mt-2 text-sm text-slate-600">
          This event does not exist or is not published.
        </p>
        <Link to="/" className="mt-4 inline-block text-sm font-medium text-brand underline">
          Back to events
        </Link>
      </div>
    )
  }

  if (loadError) {
    return <ErrorBanner message={loadError} />
  }

  return (
    <article className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <Link to="/" className="text-sm text-slate-500 hover:text-slate-800">
        Back to events
      </Link>
      {posterImageUrl(event.posterUrl) && (
        <img
          src={posterImageUrl(event.posterUrl)}
          alt=""
          className="mt-4 h-56 w-full rounded-lg object-cover sm:h-72"
        />
      )}
      <h1 className="mt-3 text-3xl font-semibold text-slate-900">{event.title}</h1>
      <p className="mt-2 text-sm text-slate-500">Organized by {event.organizerName}</p>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Venue</dt>
          <dd className="mt-1 text-slate-800">{event.venue || 'To be announced'}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Capacity</dt>
          <dd className="mt-1 text-slate-800">{event.capacity}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Starts</dt>
          <dd className="mt-1 text-slate-800">{formatWhen(event.startDateTime)}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Ends</dt>
          <dd className="mt-1 text-slate-800">{formatWhen(event.endDateTime)}</dd>
        </div>
      </dl>

      <p className="mt-6 whitespace-pre-wrap text-slate-700">{event.description || 'No description.'}</p>

      <div className="mt-8 border-t border-slate-100 pt-6">
        {role === 'PARTICIPANT' && (
          <div>
            {success && (
              <p className="mb-4 rounded-md bg-green-50 px-3 py-2 text-sm text-green-800">{success}</p>
            )}
            <ErrorBanner message={formError} />
            {!showForm && !success && (
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="rounded-md bg-brand hover:bg-brand-dark px-4 py-2 text-sm font-medium text-white"
              >
                Register
              </button>
            )}
            {showForm && (
              <form onSubmit={handleRegister} className="max-w-sm space-y-3">
                <label className="block text-sm font-medium text-slate-700">
                  Phone number
                  <input
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
                  />
                </label>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md bg-brand hover:bg-brand-dark px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {submitting ? 'Registering...' : 'Submit registration'}
                </button>
              </form>
            )}
          </div>
        )}
        {!role && (
          <Link to="/login" className="text-sm font-medium text-brand underline">
            Log in to register
          </Link>
        )}
      </div>
    </article>
  )
}
