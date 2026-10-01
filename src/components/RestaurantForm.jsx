import { useState } from 'react'
import { getErrorMessage, getFieldErrors } from '../utils/errors'
import ImageUpload from './ImageUpload'

const EMPTY = { name: '', description: '', city: '', address: '', phone: '', is_open: true }

/**
 * Create / edit a restaurant (owner), including cover photo and logo.
 * onSubmit(payload) should return a promise. Image fields are
 * File (upload) | null (remove) | undefined (leave unchanged).
 */
export default function RestaurantForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(() => {
    const src = { ...EMPTY, ...initial }
    return { name: src.name, description: src.description, city: src.city, address: src.address, phone: src.phone, is_open: src.is_open }
  })
  const [image, setImage] = useState(undefined)
  const [logo, setLogo] = useState(undefined)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      await onSubmit({ ...form, name: form.name.trim(), city: form.city.trim(), address: form.address.trim(), image, logo })
    } catch (err) {
      const fields = getFieldErrors(err)
      setErrors(Object.keys(fields).length ? fields : { form: getErrorMessage(err) })
    } finally {
      setSaving(false)
    }
  }

  const err = (k) => errors[k] && <p className="mt-1 text-xs text-red-600">{errors[k]}</p>

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(errors.form || errors.detail) && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600" role="alert">{errors.form || errors.detail}</p>}

      <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
        <div>
          <ImageUpload label="Cover photo" kind="cover" value={image} current={initial?.image} onChange={setImage} onError={(m) => setErrors({ image: m })} />
          {err('image')}
        </div>
        <div>
          <ImageUpload label="Logo" kind="logo" aspect="aspect-square" hint="Square, 5 MB max" value={logo} current={initial?.logo} onChange={setLogo} onError={(m) => setErrors({ logo: m })} />
          {err('logo')}
        </div>
      </div>

      <div>
        <label className="label" htmlFor="r-name">Restaurant name *</label>
        <input id="r-name" className="input" required maxLength={150} value={form.name} onChange={set('name')} />
        {err('name')}
      </div>
      <div>
        <label className="label" htmlFor="r-desc">Description</label>
        <textarea id="r-desc" rows={3} className="input" value={form.description} onChange={set('description')} placeholder="What makes your food special?" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="r-city">City *</label>
          <input id="r-city" className="input" required maxLength={100} value={form.city} onChange={set('city')} placeholder="Karachi" />
          {err('city')}
        </div>
        <div>
          <label className="label" htmlFor="r-phone">Phone</label>
          <input id="r-phone" className="input" maxLength={20} value={form.phone} onChange={set('phone')} />
          {err('phone')}
        </div>
      </div>
      <div>
        <label className="label" htmlFor="r-address">Address *</label>
        <input id="r-address" className="input" required maxLength={255} value={form.address} onChange={set('address')} placeholder="Tariq Road, PECHS" />
        {err('address')}
      </div>
      <label className="flex items-center gap-2.5 text-sm text-gray-700">
        <input type="checkbox" checked={form.is_open} onChange={set('is_open')} className="h-4 w-4 accent-brand-500" />
        Open for orders
      </label>
      <div className="flex justify-end gap-2 pt-2">
        {onCancel && <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>}
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save restaurant'}</button>
      </div>
    </form>
  )
}
