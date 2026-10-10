export function StatusBadge({ value }) {
  const styles = {
    PUBLISHED: 'bg-brand-soft text-brand-dark',
    DRAFT: 'bg-slate-100 text-slate-700',
    CLOSED: 'bg-amber-50 text-amber-800',
    Active: 'bg-brand-soft text-brand-dark',
    Inactive: 'bg-slate-100 text-slate-600',
  }
  const label = value === true ? 'Active' : value === false ? 'Inactive' : value
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[label] || styles.DRAFT}`}>
      {label}
    </span>
  )
}

export function PageError({ message, onRetry }) {
  if (!message) {
    return null
  }
  return (
    <div role="alert" className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <span>{message}</span>
      {onRetry && (
        <button type="button" onClick={onRetry} className="font-medium underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
          Retry
        </button>
      )}
    </div>
  )
}

export function EmptyState({ children }) {
  return <p className="rounded-xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">{children}</p>
}

export function SearchField({ value, onChange, label, placeholder }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      <span className="sr-only">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand sm:w-72"
      />
    </label>
  )
}

export function ConfirmDialog({ title, message, confirmLabel, danger, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/40 p-4">
      <div role="dialog" aria-modal="true" aria-labelledby="confirm-title" className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h2 id="confirm-title" className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mt-2 text-sm text-slate-600">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-md px-4 py-2 text-sm font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
              danger ? 'bg-red-700 hover:bg-red-800 focus-visible:outline-red-700' : 'bg-brand hover:bg-brand-dark focus-visible:outline-brand'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export function formatWhen(value) {
  if (!value) {
    return '—'
  }
  return new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}
