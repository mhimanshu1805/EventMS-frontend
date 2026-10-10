import { useEffect, useState } from 'react'

function toInputValue(iso) {
  if (!iso) {
    return ''
  }
  return String(iso).slice(0, 16)
}

function toApiDate(value) {
  if (!value) {
    return value
  }
  return value.length === 16 ? `${value}:00` : value
}

function fromEvent(event) {
  if (!event) {
    return {
      title: '',
      description: '',
      venue: '',
      startDateTime: '',
      endDateTime: '',
      capacity: 50,
    }
  }
  return {
    title: event.title || '',
    description: event.description || '',
    venue: event.venue || '',
    startDateTime: toInputValue(event.startDateTime),
    endDateTime: toInputValue(event.endDateTime),
    capacity: event.capacity ?? 50,
  }
}

export default function EventForm({
  initialEvent,
  submitting,
  error,
  onSubmit,
  onCancel,
  submitLabel,
  includePoster = false,
}) {
  const [form, setForm] = useState(() => fromEvent(initialEvent))
  const [posterFile, setPosterFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')

  useEffect(() => {
    if (!posterFile) {
      setPreviewUrl('')
      return undefined
    }
    const url = URL.createObjectURL(posterFile)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [posterFile])

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit(
      {
        title: form.title.trim(),
        description: form.description,
        venue: form.venue,
        startDateTime: toApiDate(form.startDateTime),
        endDateTime: toApiDate(form.endDateTime),
        capacity: Number(form.capacity),
      },
      includePoster ? posterFile : null,
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
      <label className="block text-sm font-medium text-slate-700">
        Title
        <input
          required
          value={form.title}
          onChange={(e) => setField('title', e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Description
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => setField('description', e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
        />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Venue
        <input
          value={form.venue}
          onChange={(e) => setField('venue', e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-slate-700">
          Starts
          <input
            type="datetime-local"
            required
            value={form.startDateTime}
            onChange={(e) => setField('startDateTime', e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Ends
          <input
            type="datetime-local"
            required
            value={form.endDateTime}
            onChange={(e) => setField('endDateTime', e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />
        </label>
      </div>
      <label className="block text-sm font-medium text-slate-700">
        Capacity
        <input
          type="number"
          min="1"
          required
          value={form.capacity}
          onChange={(e) => setField('capacity', e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
        />
      </label>
      {includePoster && (
        <label className="block text-sm font-medium text-slate-700">
          Event poster (optional)
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={(e) => setPosterFile(e.target.files?.[0] || null)}
            className="mt-1 block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Poster preview"
              className="mt-3 h-32 w-full rounded-md object-cover"
            />
          )}
        </label>
      )}
      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm text-slate-700"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-brand hover:bg-brand-dark px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {submitting ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
