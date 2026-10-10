import { Link } from 'react-router-dom'
import { useAdminData } from './AdminDataContext'
import { EmptyState, PageError, StatusBadge, formatWhen } from './adminUi'

export default function AdminOverview() {
  const { users, events, loading, error, reload } = useAdminData()
  const organizers = users.filter((row) => row.role === 'ORGANIZER')
  const participants = users.filter((row) => row.role === 'PARTICIPANT')
  const recent = [...events]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  const cards = [
    { label: 'Total events', value: events.length, hint: 'Every event on the platform' },
    { label: 'Published', value: events.filter((event) => event.status === 'PUBLISHED').length, hint: 'Visible to the public' },
    { label: 'Drafts', value: events.filter((event) => event.status === 'DRAFT').length, hint: 'Not published yet' },
    { label: 'Closed', value: events.filter((event) => event.status === 'CLOSED').length, hint: 'No longer open' },
    { label: 'Organizers', value: organizers.length, hint: `${organizers.filter((row) => row.active).length} active` },
    { label: 'Active organizers', value: organizers.filter((row) => row.active).length, hint: 'Can sign in' },
    { label: 'Participants', value: participants.length, hint: 'Registered participant accounts' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Overview</h1>
      <p className="mt-1 text-sm text-slate-500">Platform totals from the current user and event lists.</p>
      <div className="mt-4">
        <PageError message={error} onRetry={reload} />
      </div>
      {loading ? (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <div key={card.label} className="h-28 animate-pulse rounded-xl bg-white shadow-sm" />
          ))}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <article key={card.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{card.value}</p>
              <p className="mt-1 text-xs text-slate-500">{card.hint}</p>
            </article>
          ))}
        </div>
      )}

      <section className="mt-10">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">Recent events</h2>
          <Link to="/admin/events" className="text-sm font-medium text-brand hover:text-brand-dark">
            View all
          </Link>
        </div>
        {loading ? (
          <div className="mt-3 h-40 animate-pulse rounded-xl bg-white shadow-sm" />
        ) : recent.length === 0 ? (
          <div className="mt-3">
            <EmptyState>No events yet.</EmptyState>
          </div>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Organizer</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((event) => (
                  <tr key={event.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3 font-medium text-slate-900">{event.title}</td>
                    <td className="px-4 py-3 text-slate-600">{event.organizerName}</td>
                    <td className="px-4 py-3"><StatusBadge value={event.status} /></td>
                    <td className="px-4 py-3 text-slate-600">{formatWhen(event.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
