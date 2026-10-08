import { ImageUpload } from '@shared/components/ui'
import { useRestaurantForm } from '../hooks/useRestaurantForm'

/** Create / edit a restaurant (owner), including cover photo and logo. */
export default function RestaurantForm({ initial, onSubmit, onCancel }) {
  const { form, setField, image, setImage, logo, setLogo, errors, setErrors, saving, handleSubmit } =
    useRestaurantForm({ initial, onSubmit })

  const err = (k) => errors[k] && <p className="mt-1 text-xs text-red-600">{errors[k]}</p>

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(errors.form || errors.detail) && (
        <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600" role="alert">
          {errors.form || errors.detail}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
        <div>
          <ImageUpload
            label="Cover photo"
            kind="cover"
            value={image}
            current={initial?.image}
            onChange={setImage}
            onError={(m) => setErrors({ image: m })}
          />
          {err('image')}
        </div>
        <div className="max-sm:w-36">
          <ImageUpload
            label="Logo"
            kind="logo"
            aspect="aspect-square"
            hint="Square, 5 MB max"
            value={logo}
            current={initial?.logo}
            onChange={setLogo}
            onError={(m) => setErrors({ logo: m })}
          />
          {err('logo')}
        </div>
      </div>

      <div>
        <label className="label" htmlFor="r-name">
          Restaurant name *
        </label>
        <input
          id="r-name"
          className="input"
          required
          maxLength={150}
          value={form.name}
          onChange={setField('name')}
        />
        {err('name')}
      </div>
      <div>
        <label className="label" htmlFor="r-desc">
          Description
        </label>
        <textarea
          id="r-desc"
          rows={3}
          className="input"
          value={form.description}
          onChange={setField('description')}
          placeholder="What makes your food special?"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="r-city">
            City *
          </label>
          <input
            id="r-city"
            className="input"
            required
            maxLength={100}
            value={form.city}
            onChange={setField('city')}
            placeholder="Karachi"
          />
          {err('city')}
        </div>
        <div>
          <label className="label" htmlFor="r-phone">
            Phone
          </label>
          <input
            id="r-phone"
            className="input"
            maxLength={20}
            value={form.phone}
            onChange={setField('phone')}
          />
          {err('phone')}
        </div>
      </div>
      <div>
        <label className="label" htmlFor="r-address">
          Address *
        </label>
        <input
          id="r-address"
          className="input"
          required
          maxLength={255}
          value={form.address}
          onChange={setField('address')}
          placeholder="Tariq Road, PECHS"
        />
        {err('address')}
      </div>
      <label className="flex items-center gap-2.5 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={form.is_open}
          onChange={setField('is_open')}
          className="h-4 w-4 accent-brand-500"
        />
        Open for orders
      </label>
      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-ghost">
            Cancel
          </button>
        )}
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save restaurant'}
        </button>
      </div>
    </form>
  )
}
