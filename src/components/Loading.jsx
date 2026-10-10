export default function Loading({ label = 'Loading...' }) {
  return (
    <div className="flex items-center gap-3 py-8 text-sm text-slate-500" role="status">
      <span
        className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-brand"
        aria-hidden="true"
      />
      {label}
    </div>
  )
}
