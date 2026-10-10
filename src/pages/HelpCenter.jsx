import { useMemo, useState } from 'react'

const SECTIONS = [
  {
    title: 'Getting started',
    items: [
      {
        question: 'How do I create an account?',
        answer:
          'Open Register, enter your name, email, and password, and choose Organizer or Participant. Main Admin accounts are not created from this form. After a successful registration, sign in on the Login page.',
      },
      {
        question: 'How do I log in?',
        answer:
          'Open Login and use the email and password you registered. A successful login stores a token and sends you to your role’s dashboard. An inactive account cannot sign in.',
      },
      {
        question: 'What are the roles?',
        answer:
          'Organizers create and manage their own events. Participants browse published events, register, and ask questions. The Main Admin oversees users and events for the whole platform. Each person only sees the pages their role allows.',
      },
    ],
  },
  {
    title: 'Organizer guide',
    items: [
      {
        question: 'How do I create and edit an event?',
        answer:
          'On the organizer dashboard, choose Create Event and fill in the title, dates, venue, and capacity. A poster is optional. New events start as drafts. Open Manage to edit the details later. The public address does not change when you edit the title.',
      },
      {
        question: 'What do the event statuses mean?',
        answer:
          'Draft events are only visible to you. Published events appear on the public events page and can accept registrations. Closed events are no longer open for new registrations. Use Publish or Unpublish on your dashboard to switch between draft and published.',
      },
      {
        question: 'Where is the event dashboard?',
        answer:
          'From your organizer dashboard, choose Manage on an event. That page is only for events you own. It shows the public link, the QR download, registrations, and questions.',
      },
      {
        question: 'How do I share an event?',
        answer:
          'On the event page, Share Event shows the public link. Copy Link places that address on your clipboard. The downloaded QR code opens the same address. People can register only after the event is published.',
      },
      {
        question: 'How do I download the QR code?',
        answer:
          'On your event page, choose Download QR. The image encodes the public event link. Opening that link, or scanning the code, loads the same public event page.',
      },
      {
        question: 'How do I see participants and answer questions?',
        answer:
          'On the event page, Registrations lists each person’s name, email, phone, and status. You can mark a registration confirmed or cancel it. Queries lists questions. Reply to an open question from that list.',
      },
    ],
  },
  {
    title: 'Participant guide',
    items: [
      {
        question: 'How do I find an event?',
        answer:
          'The home page lists published events. Use the search box to filter by title. You do not need an account to browse.',
      },
      {
        question: 'How do I open an event from a link or QR code?',
        answer:
          'A shared link or QR code opens /events/ followed by the event’s slug. If the event is not published, the page says it was not found.',
      },
      {
        question: 'How do I register?',
        answer:
          'Sign in as a participant, open the event, and submit your phone number. Registration is rejected when pending and confirmed seats already fill the capacity. Cancelling a registration frees a seat.',
      },
      {
        question: 'Where do I see my registration status?',
        answer:
          'The participant dashboard lists your registrations and their status: pending, confirmed, or cancelled. You can cancel your own registration there.',
      },
      {
        question: 'How do I ask a question?',
        answer:
          'On the participant dashboard, choose one of your active registrations and send a message. The organizer sees it on that event’s Queries tab and can reply.',
      },
    ],
  },
  {
    title: 'Main Admin guide',
    items: [
      {
        question: 'What does Overview show?',
        answer:
          'Overview counts events by status, organizers, active organizers, and participants. Those numbers come from the user list and the event list. It also shows the newest events.',
      },
      {
        question: 'How do I manage organizers and participants?',
        answer:
          'Organizers and Participants each have their own page. Search by name or email, then activate or deactivate an account. You cannot deactivate your own admin account. A deactivated person cannot log in.',
      },
      {
        question: 'How do I manage events?',
        answer:
          'The Events page lists every event on the platform. Search by title or filter by draft, published, or closed. Delete removes the event together with its registrations and questions. Admins do not edit an organizer’s event from this page.',
      },
    ],
  },
  {
    title: 'Troubleshooting',
    items: [
      {
        question: 'I cannot log in or register.',
        answer:
          'Check the email and password. Registration only offers Organizer and Participant. If the account was deactivated, login is rejected until an admin activates it again. A duplicate email cannot be registered twice.',
      },
      {
        question: 'The event page or QR code does not open the event.',
        answer:
          'The link and the QR code both open the public page for that slug. The page is available only while the event is published. A draft or missing event shows “Event not found”.',
      },
      {
        question: 'Registration was rejected.',
        answer:
          'You need a participant account. The event must be published, you must not already have an active registration, and the event must still have capacity. Pending and confirmed registrations count toward capacity. A cancelled one does not.',
      },
      {
        question: 'I cannot see another role’s dashboard.',
        answer:
          'Each account has one role. Organizer tools are on the organizer dashboard, participant tools on the participant dashboard, and platform tools under Administration. Use the navigation for the account you signed in with.',
      },
    ],
  },
]

export default function HelpCenter() {
  const [query, setQuery] = useState('')
  const [openKey, setOpenKey] = useState('')
  const needle = query.trim().toLowerCase()

  const sections = useMemo(() => {
    return SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter((item) => {
        if (!needle) {
          return true
        }
        return `${item.question} ${item.answer}`.toLowerCase().includes(needle)
      }),
    })).filter((section) => section.items.length > 0)
  }, [needle])

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold text-slate-900">Help Center</h1>
      <p className="mt-2 text-sm text-slate-600">
        Guides for creating an account, running an event, registering, and administering the platform.
      </p>
      <label className="mt-6 block text-sm font-medium text-slate-700">
        <span className="sr-only">Search help topics</span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search help topics"
          aria-label="Search help topics"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </label>

      {sections.length === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-500">
          No help topics match that search.
        </p>
      ) : (
        <div className="mt-8 space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-semibold text-slate-900">{section.title}</h2>
              <div className="mt-3 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
                {section.items.map((item) => {
                  const key = `${section.title}-${item.question}`
                  const open = openKey === key
                  return (
                    <div key={key}>
                      <button
                        type="button"
                        aria-expanded={open}
                        onClick={() => setOpenKey(open ? '' : key)}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-brand"
                      >
                        {item.question}
                        <span className="text-brand" aria-hidden="true">{open ? '−' : '+'}</span>
                      </button>
                      {open && <p className="px-5 pb-4 text-sm leading-6 text-slate-600">{item.answer}</p>}
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
