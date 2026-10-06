import { ADDRESS_LABELS, ADDRESS_LABEL_ICONS } from '../constants'
import { useAddressForm } from '../hooks/useAddressForm'

/** Create / edit an address. onSubmit receives the payload and should return a promise. */
export default function AddressForm({ initial, onSubmit, onCancel, submitLabel = 'Save address' }) {
  const { form, setField, setLabel, errors, saving, handleSubmit } = useAddressForm({ initial, onSubmit })

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.form && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{errors.form}</p>}
      <div>
        <span className="label">Label</span>
        <div className="flex gap-2">
          {ADDRESS_LABELS.map((l) => {
            const Icon = ADDRESS_LABEL_ICONS[l]
            return (
              <button
                key={l}
                type="button"
                onClick={() => setLabel(l)}
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
          <label className="label" htmlFor="addr-city">
            City
          </label>
          <input
            id="addr-city"
            className="input"
            value={form.city}
            onChange={setField('city')}
            required
            placeholder="Karachi"
          />
          {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
        </div>
        <div>
          <label className="label" htmlFor="addr-area">
            Area
          </label>
          <input
            id="addr-area"
            className="input"
            value={form.area}
            onChange={setField('area')}
            required
            placeholder="DHA Phase 6"
          />
          {errors.area && <p className="mt-1 text-xs text-red-600">{errors.area}</p>}
        </div>
      </div>
      <div>
        <label className="label" htmlFor="addr-street">
          Street / house
        </label>
        <input
          id="addr-street"
          className="input"
          value={form.street}
          onChange={setField('street')}
          required
          placeholder="Street 12, House 4"
        />
        {errors.street && <p className="mt-1 text-xs text-red-600">{errors.street}</p>}
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={form.is_default}
          onChange={setField('is_default')}
          className="h-4 w-4 accent-brand-500"
        />
        Make this my default address
      </label>
      <div className="flex justify-end gap-2 pt-1">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-ghost">
            Cancel
          </button>
        )}
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
