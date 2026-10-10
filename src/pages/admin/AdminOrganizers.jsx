import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useAdminData } from './AdminDataContext'
import { ConfirmDialog, EmptyState, PageError, SearchField, StatusBadge } from './adminUi'

export default function AdminOrganizers() {
  return <UserRolePage role="ORGANIZER" title="Organizers" description="Accounts that can create and publish events." />
}

export function UserRolePage({ role, title, description }) {
  const { user } = useAuth()
  const { users, loading, error, reload, updateActive } = useAdminData()
  const [query, setQuery] = useState('')
  const [pending, setPending] = useState(null)
  const [actionError, setActionError] = useState('')

  const rows = users.filter((row) => row.role === role)
  const shown = rows.filter((row) => {
    const text = `${row.name} ${row.email}`.toLowerCase()
    return text.includes(query.trim().toLowerCase())
  })

  async function confirmChange() {
    if (!pending) {
      return
    }
    setActionError('')
    try {
      await updateActive(pending.id, !pending.active)
      setPending(null)
    } catch (err) {
      setActionError(err.response?.data?.message || 'Could not update the user')
      setPending(null)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
      <p className="mt-3 text-sm font-medium text-slate-700">{loading ? '…' : `${rows.length} total`}</p>
      <div className="mt-4">
        <PageError message={error || actionError} onRetry={error ? reload : undefined} />
      </div>
      <div className="mt-4">
        <SearchField value={query} onChange={setQuery} label={`Search ${title.toLowerCase()}`} placeholder="Search by name or email" />
      </div>
      {loading ? (
        <div className="mt-4 h-48 animate-pulse rounded-xl bg-white shadow-sm" />
      ) : shown.length === 0 ? (
        <div className="mt-4">
          <EmptyState>{query ? 'No matches.' : `No ${title.toLowerCase()} yet.`}</EmptyState>
        </div>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((row) => {
                const isSelf = user?.id === row.id
                return (
                  <tr key={row.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3 font-medium text-slate-900">{row.name}</td>
                    <td className="px-4 py-3 text-slate-600">{row.email}</td>
                    <td className="px-4 py-3"><StatusBadge value={row.active} /></td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        disabled={isSelf}
                        title={isSelf ? 'You cannot deactivate your own account' : undefined}
                        onClick={() => setPending(row)}
                        className="text-sm font-medium text-brand underline disabled:cursor-not-allowed disabled:text-slate-400 disabled:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                      >
                        {row.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
      {pending && (
        <ConfirmDialog
          title={pending.active ? 'Deactivate account?' : 'Activate account?'}
          message={
            pending.active
              ? `${pending.name} will not be able to sign in until the account is activated again.`
              : `${pending.name} will be able to sign in again.`
          }
          confirmLabel={pending.active ? 'Deactivate' : 'Activate'}
          danger={pending.active}
          onConfirm={confirmChange}
          onCancel={() => setPending(null)}
        />
      )}
    </div>
  )
}
