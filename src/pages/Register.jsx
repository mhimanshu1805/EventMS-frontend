import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/auth'
import ErrorBanner from '../components/ErrorBanner'

const EMPTY_FIELDS = { name: '', email: '', password: '', role: '' }

function splitBackendErrors(error) {
  const message = error.response?.data?.message || 'Could not create the account'
  const fields = { ...EMPTY_FIELDS }
  const banners = []

  message.split(';').map((part) => part.trim()).filter(Boolean).forEach((part) => {
    const splitAt = part.indexOf(': ')
    const key = splitAt > 0 ? part.slice(0, splitAt) : ''
    const text = splitAt > 0 ? part.slice(splitAt + 2) : part
    if (key in fields) {
      fields[key] = text
    } else if (/email/i.test(part)) {
      fields.email = part
    } else {
      banners.push(part)
    }
  })

  return { banner: banners.join(' '), fields }
}

export default function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('PARTICIPANT')
  const [fieldErrors, setFieldErrors] = useState(EMPTY_FIELDS)
  const [banner, setBanner] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setBanner('')
    setFieldErrors(EMPTY_FIELDS)
    setSubmitting(true)
    try {
      await register(name, email, password, role)
      navigate('/login', { state: { message: 'Account created. You can log in now.' } })
    } catch (err) {
      const parsed = splitBackendErrors(err)
      setBanner(parsed.banner)
      setFieldErrors(parsed.fields)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto mt-10 w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Register</h1>
      <p className="mt-1 text-sm text-slate-500">Create an organizer or participant account.</p>

      <ErrorBanner message={banner} />

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Field label="Name" error={fieldErrors.name}>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass(fieldErrors.name)}
          />
        </Field>
        <Field label="Email" error={fieldErrors.email}>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass(fieldErrors.email)}
          />
        </Field>
        <Field label="Password" error={fieldErrors.password}>
          <input
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass(fieldErrors.password)}
          />
        </Field>
        <Field label="Role" error={fieldErrors.role}>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={inputClass(fieldErrors.role)}
          >
            <option value="PARTICIPANT">Participant</option>
            <option value="ORGANIZER">Organizer</option>
          </select>
        </Field>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-brand hover:bg-brand-dark px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="mt-4 text-sm text-slate-600">
        Already registered?{' '}
        <Link to="/login" className="font-medium text-brand underline">
          Login
        </Link>
      </p>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <div className="mt-1">{children}</div>
      {error && <span className="mt-1 block text-sm font-normal text-red-600">{error}</span>}
    </label>
  )
}

function inputClass(error) {
  return `w-full rounded-md border px-3 py-2 text-slate-900 outline-none focus:border-slate-500 ${
    error ? 'border-red-400' : 'border-slate-300'
  }`
}
