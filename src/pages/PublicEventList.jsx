import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPublicEvents } from '../api/events'
import ErrorBanner from '../components/ErrorBanner'
import Loading from '../components/Loading'

const PREVIEW_COUNT = 6

const STEPS = [
  {
    step: 'Step 1',
    title: 'Create',
    text: 'An organizer adds the event details and saves it as a draft.',
    icon: 'plus',
  },
  {
    step: 'Step 2',
    title: 'Publish & share',
    text: 'Publishing opens the public page and the QR code for that event.',
    icon: 'share',
  },
  {
    step: 'Step 3',
    title: 'Register',
    text: 'A participant signs up while the event still has free capacity.',
    icon: 'user',
  },
  {
    step: 'Step 4',
    title: 'Connect',
    text: 'Participants ask questions, and the organizer replies from the dashboard.',
    icon: 'chat',
  },
]

const FEATURES = [
  {
    title: 'Role-based access',
    text: 'Organizer, participant, and main admin each see only what their role allows.',
    icon: 'lock',
  },
  {
    title: 'Capacity rules',
    text: 'A full event rejects new registrations. Cancelling a seat frees it again.',
    icon: 'users',
  },
  {
    title: 'Dashboards',
    text: 'Each role has a dashboard for events, registrations, or questions.',
    icon: 'layout',
  },
  {
    title: 'Admin oversight',
    text: 'The main admin can activate or deactivate users and remove events.',
    icon: 'shield',
  },
]

const FAQS = [
  {
    question: 'Who can create events?',
    answer:
      'Only an account registered as an organizer can create and publish events. Participants browse and register. The main admin oversees users and events.',
  },
  {
    question: 'Do participants need an account?',
    answer:
      'Published events can be browsed without logging in. Registering for an event, or asking the organizer a question, needs a participant account.',
  },
  {
    question: 'What happens when an event is full?',
    answer:
      'The server rejects the registration once pending and confirmed registrations reach the capacity. A cancelled registration does not count, so cancelling frees a seat.',
  },
  {
    question: 'Can I cancel my registration?',
    answer:
      'Yes. A participant can cancel their own registration from the participant dashboard. The seat is then available for someone else.',
  },
]

function formatRange(start, end) {
  const options = { dateStyle: 'medium', timeStyle: 'short' }
  const startText = new Date(start).toLocaleString(undefined, options)
  const endText = new Date(end).toLocaleString(undefined, options)
  return `${startText} – ${endText}`
}

export default function PublicEventList() {
  const [events, setEvents] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)

  useEffect(() => {
    load('')
    // React Router does not scroll to the hash on its own.
    if (window.location.hash === '#events') {
      document.getElementById('events')?.scrollIntoView()
    }
  }, [])

  function load(search) {
    setLoading(true)
    setError('')
    setEvents([])
    setShowAll(false)
    getPublicEvents(search)
      .then(setEvents)
      .catch(() => setError('Could not load events'))
      .finally(() => setLoading(false))
  }

  function handleSearch(event) {
    event.preventDefault()
    load(query.trim())
  }

  const visibleEvents = showAll ? events : events.slice(0, PREVIEW_COUNT)

  return (
    <div>
      <section className="bg-brand-soft">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">
            Event management system
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Plan events, share them, and manage registrations in one place
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">
            Organizers publish events. Participants browse, register, and ask questions.
            A main admin oversees the platform.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#events"
              className="rounded-md bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-dark"
            >
              Explore events
            </a>
            <Link
              to="/register"
              className="rounded-md border border-brand bg-white px-5 py-2.5 text-sm font-medium text-brand hover:bg-brand-soft"
            >
              Start organizing
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-semibold text-slate-900">How it works</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <StepIcon name={item.icon} />
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand">{item.step}</p>
              <h3 className="mt-1 text-lg font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold text-slate-900">Features</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((item) => (
              <article key={item.title}>
                <StepIcon name={item.icon} />
                <h3 className="mt-3 font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">For organizers</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>Create and edit your own events</li>
              <li>Publish a public page and download its QR code</li>
              <li>Review registrations and update their status</li>
              <li>Reply to participant questions</li>
            </ul>
            <Link
              to="/register"
              className="mt-6 inline-block rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
            >
              Become an organizer
            </Link>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">For participants</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>Browse published events without an account</li>
              <li>Register with a phone number after you log in</li>
              <li>Track and cancel your registration</li>
              <li>Ask the organizer a question</li>
            </ul>
            <a
              href="#events"
              className="mt-6 inline-block rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
            >
              Find an event
            </a>
          </article>
        </div>
      </section>

      <section id="events" className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Upcoming events</h2>
              <p className="mt-1 text-sm text-slate-500">Published events you can open without logging in.</p>
            </div>
            <form onSubmit={handleSearch} className="flex w-full gap-2 sm:w-auto">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title"
                aria-label="Search by title"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand sm:w-64"
              />
              <button
                type="submit"
                className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
              >
                Search
              </button>
            </form>
          </div>

          {loading && <Loading label="Loading events..." />}
          <ErrorBanner message={error} />

          {!loading && !error && events.length === 0 && (
            <p className="mt-8 text-sm text-slate-500">No published events.</p>
          )}

          <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visibleEvents.map((event) => (
              <li key={event.id}>
                <Link
                  to={`/events/${event.slug}`}
                  className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-brand"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                    {event.organizerName || 'Organizer'}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">{event.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                    {event.description || 'No description.'}
                  </p>
                  <p className="mt-4 text-sm text-slate-700">{formatRange(event.startDateTime, event.endDateTime)}</p>
                  <p className="mt-1 text-sm text-slate-600">{event.venue || 'Venue to be announced'}</p>
                  {event.capacity != null && (
                    <p className="mt-3 text-sm font-medium text-slate-800">Capacity: {event.capacity}</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {!loading && !showAll && events.length > PREVIEW_COUNT && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="mt-6 text-sm font-medium text-brand hover:text-brand-dark"
            >
              View all
            </button>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-semibold text-slate-900">FAQ</h2>
        <div className="mt-6 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {FAQS.map((item, index) => {
            const open = openFaq === index
            return (
              <div key={item.question}>
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenFaq(open ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-slate-900"
                >
                  {item.question}
                  <span className="text-brand" aria-hidden="true">
                    {open ? '−' : '+'}
                  </span>
                </button>
                {open && <p className="px-5 pb-4 text-sm text-slate-600">{item.answer}</p>}
              </div>
            )
          })}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="font-medium text-slate-800">EventMS</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/" className="hover:text-brand">Home</Link>
            <a href="#events" className="hover:text-brand">Events</a>
            <Link to="/login" className="hover:text-brand">Login</Link>
            <Link to="/register" className="hover:text-brand">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function StepIcon({ name }) {
  const paths = {
    plus: 'M12 6v12M6 12h12',
    share: 'M8 12h8M12 8l4 4-4 4',
    user: 'M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6.5 18.5a5.5 5.5 0 0 1 11 0',
    chat: 'M6 16.5 4.5 19V6.5A1.5 1.5 0 0 1 6 5h12a1.5 1.5 0 0 1 1.5 1.5V15a1.5 1.5 0 0 1-1.5 1.5H6Z',
    lock: 'M8 11V8a4 4 0 0 1 8 0v3M7 11h10v8H7v-8Z',
    users: 'M9 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM16 10.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM4.5 18.5a4.5 4.5 0 0 1 9 0M13.5 18.5a3.5 3.5 0 0 1 6 0',
    layout: 'M5 5h14v14H5V5ZM5 10h14M10 10v9',
    shield: 'M12 4 6 6.5v5.2c0 3.2 2.4 5.6 6 6.8 3.6-1.2 6-3.6 6-6.8V6.5L12 4Z',
  }

  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft text-brand">
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d={paths[name]} />
      </svg>
    </span>
  )
}
