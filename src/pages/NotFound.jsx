import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <p className="text-sm font-medium text-slate-500">404</p>
      <h1 className="mt-2 text-2xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-2 text-sm text-slate-600">That address does not match any page.</p>
      <Link to="/" className="mt-6 inline-block text-sm font-medium text-brand underline">
        Back to events
      </Link>
    </div>
  )
}
