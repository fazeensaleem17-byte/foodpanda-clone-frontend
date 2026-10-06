import { ImageUpload } from '@shared/components/ui'
import { useMenuItemForm } from '../hooks/useMenuItemForm'

/** Add / edit a dish: photo, name, description, price, category, availability. */
export default function MenuItemForm({ initial, categories, onSubmit, onCancel }) {
  const { form, setField, image, setImage, errors, setErrors, saving, handleSubmit } = useMenuItemForm({
    initial,
    categories,
    onSubmit,
  })
  const err = (k) => errors[k] && <p className="mt-1 text-xs text-red-600">{errors[k]}</p>

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(errors.form || errors.restaurant || errors.detail) && (
        <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600" role="alert">
          {errors.form || errors.restaurant || errors.detail}
        </p>
      )}
      <div>
        <ImageUpload
          label="Dish photo"
          value={image}
          current={initial.image}
          onChange={setImage}
          onError={(m) => setErrors({ image: m })}
          aspect="aspect-[4/3]"
        />
        {err('image')}
      </div>
      <div>
        <label className="label" htmlFor="mi-name">
          Dish name *
        </label>
        <input
          id="mi-name"
          className="input"
          required
          maxLength={150}
          value={form.name}
          onChange={setField('name')}
        />
        {err('name')}
      </div>
      <div>
        <label className="label" htmlFor="mi-desc">
          Description
        </label>
        <textarea
          id="mi-desc"
          rows={2}
          className="input"
          value={form.description}
          onChange={setField('description')}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="mi-price">
            Price (Rs.) *
          </label>
          <input
            id="mi-price"
            type="number"
            min="0"
            step="0.01"
            className="input"
            required
            value={form.price}
            onChange={setField('price')}
          />
          {err('price')}
        </div>
        <div>
          <label className="label" htmlFor="mi-cat">
            Category *
          </label>
          <select
            id="mi-cat"
            className="input cursor-pointer"
            value={form.category}
            onChange={setField('category')}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {err('category')}
        </div>
      </div>
      <label className="flex items-center gap-2.5 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={form.is_available}
          onChange={setField('is_available')}
          className="h-4 w-4 accent-brand-500"
        />
        Available to order
      </label>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="btn-ghost">
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save dish'}
        </button>
      </div>
    </form>
  )
}
