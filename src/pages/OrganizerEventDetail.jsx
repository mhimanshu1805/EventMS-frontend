import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  deleteEventPoster,
  getEvent,
  getEventQr,
  getEventQueries,
  getEventRegistrations,
  posterImageUrl,
  updateEvent,
  uploadEventPoster,
} from '../api/events'
import { respondToQuery } from '../api/queries'
import { updateRegistrationStatus } from '../api/registrations'
import ErrorBanner from '../components/ErrorBanner'
import EventForm from '../components/EventForm'
import Loading from '../components/Loading'

export default function OrganizerEventDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [registrations, setRegistrations] = useState([])
  const [queries, setQueries] = useState([])
  const [tab, setTab] = useState('registrations')
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState('')
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [replies, setReplies] = useState({})
  const [qrBusy, setQrBusy] = useState(false)
  const [posterBusy, setPosterBusy] = useState(false)
  const [copyMessage, setCopyMessage] = useState('')

  useEffect(() => {
    load()
  }, [id])

  async function load() {
    setLoading(true)
    setError('')
    setNotFound(false)
    try {
      const [nextEvent, regs, qs] = await Promise.all([
        getEvent(id),
        getEventRegistrations(id),
        getEventQueries(id),
      ])
      setEvent(nextEvent)
      setRegistrations(regs)
      setQueries(qs)
    } catch (err) {
      if (err.response?.status === 404 || err.response?.status === 403) {
        setNotFound(true)
      } else {
        setError('Could not load this event')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handlePosterFile(changeEvent) {
    const file = changeEvent.target.files?.[0]
    changeEvent.target.value = ''
    if (!file) {
      return
    }
    setPosterBusy(true)
    setError('')
    try {
      setEvent(await uploadEventPoster(id, file))
    } catch (err) {
      setError(err.response?.data?.message || 'Could not upload poster')
    } finally {
      setPosterBusy(false)
    }
  }

  async function handleRemovePoster() {
    setPosterBusy(true)
    setError('')
    try {
      setEvent(await deleteEventPoster(id))
    } catch (err) {
      setError(err.response?.data?.message || 'Could not remove poster')
    } finally {
      setPosterBusy(false)
    }
  }

  async function copyPublicLink() {
    setCopyMessage('')
    try {
      await navigator.clipboard.writeText(event.publicUrl)
      setCopyMessage('Link copied')
    } catch {
      setCopyMessage('Could not copy the link. Select it and copy it manually.')
    }
  }

  async function handleSave(payload) {
    setSaving(true)
    setFormError('')
    try {
      const updated = await updateEvent(id, payload)
      setEvent(updated)
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not save the event')
    } finally {
      setSaving(false)
    }
  }

  async function setRegStatus(registrationId, status) {
    try {
      await updateRegistrationStatus(registrationId, status)
      const regs = await getEventRegistrations(id)
      setRegistrations(regs)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update registration')
    }
  }

  async function handleReply(queryId) {
    const text = (replies[queryId] || '').trim()
    if (!text) {
      return
    }
    try {
      await respondToQuery(queryId, text)
      const qs = await getEventQueries(id)
      setQueries(qs)
      setReplies((prev) => ({ ...prev, [queryId]: '' }))
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send reply')
    }
  }

  async function downloadQr() {
    setQrBusy(true)
    try {
      const blob = await getEventQr(id)
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${event?.slug || 'event'}-qr.png`
      link.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not download QR code')
    } finally {
      setQrBusy(false)
    }
  }

  if (loading) {
    return <Loading label="Loading event..." />
  }

  if (notFound) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Event not found</h1>
        <p className="mt-2 text-sm text-slate-600">This event does not exist or is not yours.</p>
        <Link to="/organizer/dashboard" className="mt-4 inline-block text-sm underline">
          Back to dashboard
        </Link>
      </div>
    )
  }

  if (!event) {
    return <ErrorBanner message={error || 'Could not load this event'} />
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/organizer/dashboard" className="text-sm text-slate-500 hover:text-slate-800">
        Back to dashboard
      </Link>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{event.title}</h1>
          <p className="mt-1 text-sm text-slate-500">
            Status: {event.status} · Slug: {event.slug}
          </p>
        </div>
        <button
          type="button"
          onClick={downloadQr}
          disabled={qrBusy}
          className="rounded-md bg-brand hover:bg-brand-dark px-4 py-2 text-sm font-medium text-white disabled:bg-slate-400"
        >
          {qrBusy ? 'Downloading...' : 'Download QR'}
        </button>
      </div>

      <ErrorBanner message={error} />

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Share event</h2>
        <p className="mt-1 text-sm text-slate-500">
          This is the same address encoded in the QR code. It opens the public page when the event is published.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            readOnly
            value={event.publicUrl || ''}
            aria-label="Public event link"
            className="w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-800"
            onFocus={(focusEvent) => focusEvent.target.select()}
          />
          <button
            type="button"
            onClick={copyPublicLink}
            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
          >
            Copy Link
          </button>
        </div>
        {copyMessage && (
          <p className="mt-3 text-sm text-slate-700" role="status">{copyMessage}</p>
        )}
      </section>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Edit event</h2>
        <PosterEditor
          posterUrl={event.posterUrl}
          busy={posterBusy}
          onFile={handlePosterFile}
          onRemove={handleRemovePoster}
        />
        <EventForm
          key={event.id + event.title}
          initialEvent={event}
          submitting={saving}
          error={formError}
          submitLabel="Save changes"
          onSubmit={handleSave}
        />
      </section>

      <div className="mt-6 flex gap-2 border-b border-slate-200">
        <TabButton active={tab === 'registrations'} onClick={() => setTab('registrations')}>
          Registrations
        </TabButton>
        <TabButton active={tab === 'queries'} onClick={() => setTab('queries')}>
          Queries
        </TabButton>
      </div>

      {tab === 'registrations' && (
        <section className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          {registrations.length === 0 ? (
            <p className="p-4 text-sm text-slate-500">No registrations yet.</p>
          ) : (
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3">{reg.participantName}</td>
                    <td className="px-4 py-3">{reg.participantEmail}</td>
                    <td className="px-4 py-3">{reg.phone}</td>
                    <td className="px-4 py-3">{reg.status}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {reg.status !== 'CONFIRMED' && (
                          <button
                            type="button"
                            onClick={() => setRegStatus(reg.id, 'CONFIRMED')}
                            className="text-slate-700 underline"
                          >
                            Confirm
                          </button>
                        )}
                        {reg.status !== 'CANCELLED' && (
                          <button
                            type="button"
                            onClick={() => setRegStatus(reg.id, 'CANCELLED')}
                            className="text-red-700 underline"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}

      {tab === 'queries' && (
        <section className="mt-4 space-y-4">
          {queries.length === 0 && (
            <p className="text-sm text-slate-500">No queries yet.</p>
          )}
          {queries.map((query) => (
            <article key={query.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-slate-900">{query.participantName}</p>
              <p className="mt-1 text-sm text-slate-700">{query.message}</p>
              <p className="mt-1 text-xs text-slate-500">{query.status}</p>
              {query.response && (
                <p className="mt-2 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  Reply: {query.response}
                </p>
              )}
              {query.status === 'OPEN' && (
                <div className="mt-3 flex gap-2">
                  <input
                    value={replies[query.id] || ''}
                    onChange={(e) => setReplies((prev) => ({ ...prev, [query.id]: e.target.value }))}
                    placeholder="Write a reply"
                    className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleReply(query.id)}
                    className="rounded-md bg-brand hover:bg-brand-dark px-3 py-2 text-sm text-white"
                  >
                    Reply
                  </button>
                </div>
              )}
            </article>
          ))}
        </section>
      )}
    </div>
  )
}

function PosterEditor({ posterUrl, busy, onFile, onRemove }) {
  const src = posterImageUrl(posterUrl)
  return (
    <div className="mb-6">
      {src ? (
        <img src={src} alt="Event poster" className="h-40 w-full max-w-md rounded-lg object-cover" />
      ) : (
        <p className="text-sm text-slate-600">No poster yet - you can add one anytime</p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="text-sm font-medium text-slate-700">
          {src ? 'Replace poster' : 'Add poster'}
          <input
            type="file"
            accept="image/jpeg,image/png"
            disabled={busy}
            onChange={onFile}
            className="mt-1 block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white disabled:opacity-60"
          />
        </label>
        {src && (
          <button
            type="button"
            onClick={onRemove}
            disabled={busy}
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm text-slate-800 hover:bg-slate-50 disabled:opacity-60"
          >
            Remove poster
          </button>
        )}
      </div>
    </div>
  )
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-b-2 px-3 py-2 text-sm ${
        active ? 'border-slate-900 font-medium text-slate-900' : 'border-transparent text-slate-500'
      }`}
    >
      {children}
    </button>
  )
}
