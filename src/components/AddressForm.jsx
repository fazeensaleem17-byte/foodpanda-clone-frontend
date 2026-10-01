import { useState } from 'react'
import { Briefcase, Home, MapPin } from 'lucide-react'
import { getErrorMessage, getFieldErrors } from '../utils/errors'

const LABEL_ICONS = { home: Home, work: Briefcase, other: MapPin }

const EMPTY = { label: 'home', city: '', area: '', street: '', is_default: false }

/** Create / edit an address. onSubmit receives the payload and should return a promise. */
export default function AddressForm({ initial, onSubmit, onCancel, submitLabel = 'Save address' }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      const { label, city, area, street, is_default } = form
      await onSubmit({ label, city: city.trim(), area: area.trim(), street: street.trim(), is_default })
    } catch (err) {
      const fields = getFieldErrors(err)
      setErrors(Object.keys(fields).length ? fields : { form: getErrorMessage(err) })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.form && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{errors.form}</p>}
      <div>
        <span className="label">Label</span>
        <div className="flex gap-2">
          {['home', 'work', 'other'].map((l) => {
            const Icon = LABEL_ICONS[l]
            return (
              <button
                key={l}
                type="button"
                onClick={() => setForm((f) => ({ ...f, label: l }))}
                aria-pressed={form.label === l}
                className={`chip capitalize ${form.label === l ? 'chip-active' : 'chip-idle'}`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" /> {l}
              </button>
            )
          })}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="addr-city">City</label>
          <input id="addr-city" className="input" value={form.city} onChange={set('city')} required placeholder="Karachi" />
          {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
        </div>
        <div>
          <label className="label" htmlFor="addr-area">Area</label>
          <input id="addr-area" className="input" value={form.area} onChange={set('area')} required placeholder="DHA Phase 6" />
          {errors.area && <p className="mt-1 text-xs text-red-600">{errors.area}</p>}
        </div>
      </div>
      <div>
        <label className="label" htmlFor="addr-street">Street / house</label>
        <input id="addr-street" className="input" value={form.street} onChange={set('street')} required placeholder="Street 12, House 4" />
        {errors.street && <p className="mt-1 text-xs text-red-600">{errors.street}</p>}
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input type="checkbox" checked={form.is_default} onChange={set('is_default')} className="h-4 w-4 accent-brand-500" />
        Make this my default address
      </label>
      <div className="flex justify-end gap-2 pt-1">
        {onCancel && <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>}
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : submitLabel}</button>
      </div>
    </form>
  )
}
