import { useState } from 'react'
import { useAdminData } from './AdminDataContext'
import { ConfirmDialog, EmptyState, PageError, SearchField, StatusBadge, formatWhen } from './adminUi'

const FILTERS = ['ALL', 'DRAFT', 'PUBLISHED', 'CLOSED']

export default function AdminEvents() {
  const { events, loading, error, reload, removeEvent } = useAdminData()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('ALL')
  const [pending, setPending] = useState(null)
  const [actionError, setActionError] = useState('')

  const shown = events.filter((event) => {
    const matchesTitle = event.title.toLowerCase().includes(query.trim().toLowerCase())
    const matchesStatus = status === 'ALL' || event.status === status
    return matchesTitle && matchesStatus
  })

  async function confirmDelete() {
    if (!pending) {
      return
    }
    setActionError('')
    try {
      await removeEvent(pending.id)
      setPending(null)
    } catch (err) {
      setActionError(err.response?.data?.message || 'Could not delete the event')
      setPending(null)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Events</h1>
      <p className="mt-1 text-sm text-slate-500">Every event on the platform. Deleting an event also removes its registrations and questions.</p>
      <div className="mt-4">
        <PageError message={error || actionError} onRetry={error ? reload : undefined} />
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchField value={query} onChange={setQuery} label="Search events" placeholder="Search by title" />
        <label className="text-sm font-medium text-slate-700">
          <span className="sr-only">Filter by status</span>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            aria-label="Filter by status"
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
          >
            {FILTERS.map((item) => (
              <option key={item} value={item}>{item === 'ALL' ? 'All statuses' : item}</option>
            ))}
          </select>
        </label>
      </div>
      {loading ? (
        <div className="mt-4 h-48 animate-pulse rounded-xl bg-white shadow-sm" />
      ) : shown.length === 0 ? (
        <div className="mt-4">
          <EmptyState>{query || status !== 'ALL' ? 'No matching events.' : 'No events yet.'}</EmptyState>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Organizer</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Starts</th>
                <th className="px-4 py-3 font-medium">Capacity</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((event) => (
                <tr key={event.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-900">{event.title}</td>
                  <td className="px-4 py-3 text-slate-600">{event.organizerName}</td>
                  <td className="px-4 py-3"><StatusBadge value={event.status} /></td>
                  <td className="px-4 py-3 text-slate-600">{formatWhen(event.startDateTime)}</td>
                  <td className="px-4 py-3 text-slate-600">{event.capacity}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => setPending(event)}
                      className="text-sm font-medium text-red-700 underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {pending && (
        <ConfirmDialog
          title="Delete event?"
          message={`Delete "${pending.title}"? This removes its registrations and questions.`}
          confirmLabel="Delete"
          danger
          onConfirm={confirmDelete}
          onCancel={() => setPending(null)}
        />
      )}
    </div>
  )
}
