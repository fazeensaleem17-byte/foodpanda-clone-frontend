import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ChevronLeft, Eye, FolderPlus, Pencil, Plus, Trash2 } from 'lucide-react'
import { categoriesApi, menuItemsApi, restaurantsApi } from '../../api/restaurants'
import { useAsync } from '../../hooks/useAsync'
import { useAuth } from '../../context/AuthContext'
import ImageUpload from '../../components/ImageUpload'
import Modal, { ConfirmDialog } from '../../components/Modal'
import SmartImage from '../../components/SmartImage'
import StatusBadge from '../../components/StatusBadge'
import { ListRowsSkeleton, Skeleton } from '../../components/Skeletons'
import { EmptyState, ErrorState } from '../../components/StateMessages'
import { formatPrice, usernameOf } from '../../utils/format'
import { getErrorMessage, getFieldErrors } from '../../utils/errors'

// Dishes that appear in past orders are protected: the backend answers 409
// with an explanation, which getErrorMessage shows as-is.
const deleteError = (err) => getErrorMessage(err, 'Could not delete. Mark dishes as unavailable instead.')

/** Owner: manage categories and menu items (with photos) of one restaurant. */
export default function OwnerMenu() {
  const { id } = useParams()
  const { user } = useAuth()
  // GET /restaurants/{id}/menu/ - as the owner we also get unavailable items
  // and every category (even empty ones), which is exactly what we need here.
  const { data, loading, error, reload } = useAsync(() => restaurantsApi.menu(id), [id])

  const [categoryModal, setCategoryModal] = useState(null) // null | 'new' | category
  const [itemModal, setItemModal] = useState(null) // null | { categoryId } | item
  const [confirm, setConfirm] = useState(null) // { type: 'category'|'item', obj }
  const [busy, setBusy] = useState(false)
  const [togglingId, setTogglingId] = useState(null)

  if (loading) {
    return (
      <div className="page max-w-5xl">
        <Skeleton className="mb-4 h-4 w-24" />
        <div className="mb-8 flex items-center gap-4"><Skeleton className="h-16 w-16 rounded-2xl" /><div className="space-y-2"><Skeleton className="h-7 w-64" /><Skeleton className="h-4 w-40" /></div></div>
        <div className="card p-5"><ListRowsSkeleton rows={4} /></div>
      </div>
    )
  }
  if (error) return <div className="page"><ErrorState message={error} onRetry={reload} /></div>

  const { restaurant, categories } = data
  if (usernameOf(restaurant.owner) !== user.username) {
    return <div className="page"><ErrorState message="You can only manage restaurants you own." /></div>
  }

  const refresh = () => reload({ silent: true })

  const toggleAvailability = async (item) => {
    setTogglingId(item.id)
    try {
      await menuItemsApi.update(item.id, { is_available: !item.is_available })
      toast.success(`${item.name} is now ${item.is_available ? 'unavailable' : 'available'}`)
      await refresh()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setTogglingId(null)
    }
  }

  const doDelete = async () => {
    setBusy(true)
    const { type, obj } = confirm
    try {
      if (type === 'category') await categoriesApi.remove(obj.id)
      else await menuItemsApi.remove(obj.id)
      toast.success(`${obj.name} deleted`)
      refresh()
    } catch (err) {
      toast.error(deleteError(err))
    } finally {
      setBusy(false)
      setConfirm(null)
    }
  }

  const itemCount = categories.reduce((n, c) => n + c.items.length, 0)

  return (
    <div className="page max-w-5xl">
      <Link to="/owner" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline">
        <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Dashboard
      </Link>
      <div className="mb-8 mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SmartImage src={restaurant.logo} alt="" kind="logo" rounded="rounded-2xl" className="h-16 w-16 shadow-sm" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="page-title">{restaurant.name}</h1>
              <StatusBadge status={restaurant.is_open ? 'open' : 'closed'} label={restaurant.is_open ? 'Open' : 'Closed'} />
            </div>
            <p className="text-sm text-gray-500">{categories.length} categories · {itemCount} dishes</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={`/restaurants/${restaurant.id}`} className="btn-ghost"><Eye className="h-4 w-4" aria-hidden="true" /> Preview</Link>
          <button type="button" onClick={() => setCategoryModal('new')} className="btn-outline"><FolderPlus className="h-4 w-4" aria-hidden="true" /> Category</button>
          <button type="button" disabled={!categories.length} onClick={() => setItemModal({ categoryId: categories[0]?.id })} className="btn-primary"><Plus className="h-4 w-4" aria-hidden="true" /> Dish</button>
        </div>
      </div>

      {categories.length === 0 ? (
        <EmptyState icon={FolderPlus} title="Start with a category" message='Dishes are grouped into categories like "Rice", "BBQ" or "Drinks".' action="Add category" onAction={() => setCategoryModal('new')} />
      ) : (
        <div className="space-y-6">
          {categories.map((c) => (
            <section key={c.id} className="card overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 bg-gray-50/70 px-5 py-3">
                <h2 className="font-semibold">{c.name} <span className="font-normal text-gray-400">({c.items.length})</span></h2>
                <div className="flex gap-1">
                  <button type="button" onClick={() => setItemModal({ categoryId: c.id })} className="btn-ghost btn-sm text-brand-600"><Plus className="h-3.5 w-3.5" aria-hidden="true" /> Dish</button>
                  <button type="button" onClick={() => setCategoryModal(c)} className="btn-ghost btn-sm"><Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Rename</button>
                  <button type="button" onClick={() => setConfirm({ type: 'category', obj: c })} className="btn-ghost btn-sm text-red-500 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Delete</button>
                </div>
              </div>
              {c.items.length === 0 ? (
                <p className="p-5 text-sm text-gray-500">No dishes in this category yet.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {c.items.map((item) => (
                    <li key={item.id} className={`flex flex-wrap items-center gap-4 px-5 py-4 transition hover:bg-gray-50/60 ${item.is_available ? '' : 'bg-gray-50'}`}>
                      <SmartImage src={item.image} alt={item.name} rounded="rounded-xl" className={`h-14 w-14 shrink-0 ${item.is_available ? '' : 'grayscale'}`} />
                      <div className="min-w-0 flex-1">
                        <p className={`font-medium ${item.is_available ? 'text-gray-900' : 'text-gray-400 line-through'}`}>{item.name}</p>
                        {item.description && <p className="truncate text-sm text-gray-500">{item.description}</p>}
                      </div>
                      <span className="w-24 text-right font-semibold text-gray-900">{formatPrice(item.price)}</span>
                      {/* Availability toggle */}
                      <button
                        type="button"
                        role="switch"
                        aria-checked={item.is_available}
                        aria-label={`${item.name} available`}
                        disabled={togglingId === item.id}
                        onClick={() => toggleAvailability(item)}
                        className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition duration-300 disabled:opacity-50 ${item.is_available ? 'bg-emerald-500' : 'bg-gray-300'}`}
                        title={item.is_available ? 'Available: click to hide' : 'Unavailable: click to show'}
                      >
                        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${item.is_available ? 'left-5.5' : 'left-0.5'}`} />
                      </button>
                      <div className="flex gap-1">
                        <button type="button" onClick={() => setItemModal({ ...item, category: c.id })} className="btn-ghost btn-sm" aria-label={`Edit ${item.name}`}><Pencil className="h-4 w-4" aria-hidden="true" /></button>
                        <button type="button" onClick={() => setConfirm({ type: 'item', obj: item })} className="btn-ghost btn-sm text-red-500 hover:bg-red-50 hover:text-red-600" aria-label={`Delete ${item.name}`}><Trash2 className="h-4 w-4" aria-hidden="true" /></button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}

      <Modal open={!!categoryModal} onClose={() => setCategoryModal(null)} title={categoryModal === 'new' ? 'New category' : 'Rename category'} size="max-w-md">
        {categoryModal && (
          <CategoryForm
            initial={categoryModal === 'new' ? '' : categoryModal.name}
            onSubmit={async (name) => {
              if (categoryModal === 'new') await categoriesApi.create({ restaurant: restaurant.id, name })
              else await categoriesApi.update(categoryModal.id, { name })
              toast.success(categoryModal === 'new' ? 'Category added' : 'Category renamed')
              setCategoryModal(null)
              refresh()
            }}
            onCancel={() => setCategoryModal(null)}
          />
        )}
      </Modal>

      <Modal open={!!itemModal} onClose={() => setItemModal(null)} title={itemModal?.id ? `Edit ${itemModal.name}` : 'New dish'}>
        {itemModal && (
          <MenuItemForm
            initial={itemModal}
            categories={categories}
            onSubmit={async (payload) => {
              // payload.image: File -> multipart upload, null -> remove, undefined -> keep
              if (itemModal.id) await menuItemsApi.update(itemModal.id, payload)
              else await menuItemsApi.create({ ...payload, restaurant: restaurant.id })
              toast.success(itemModal.id ? 'Dish updated' : 'Dish added')
              setItemModal(null)
              refresh()
            }}
            onCancel={() => setItemModal(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        title={confirm?.type === 'category' ? 'Delete category?' : 'Delete dish?'}
        message={confirm?.type === 'category'
          ? `Deleting "${confirm.obj.name}" also deletes all ${confirm.obj.items.length} dishes in it. Dishes that were already ordered can't be deleted.`
          : `Delete "${confirm?.obj.name}" from the menu? Dishes that were already ordered can't be deleted; switch them to unavailable instead.`}
        confirmLabel="Delete"
        danger
        busy={busy}
        onConfirm={doDelete}
        onCancel={() => setConfirm(null)}
      />
    </div>
  )
}

function CategoryForm({ initial, onSubmit, onCancel }) {
  const [name, setName] = useState(initial)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await onSubmit(name.trim())
    } catch (err) {
      // unique (restaurant, name) -> non_field_errors
      setError(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600" role="alert">{error}</p>}
      <div>
        <label className="label" htmlFor="cat-name">Category name</label>
        <input id="cat-name" className="input" required maxLength={100} autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Rice, BBQ, Drinks" />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
      </div>
    </form>
  )
}

function MenuItemForm({ initial, categories, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: initial.name ?? '',
    description: initial.description ?? '',
    price: initial.price ?? '',
    category: initial.category ?? initial.categoryId ?? categories[0]?.id,
    is_available: initial.is_available ?? true,
  })
  const [image, setImage] = useState(undefined) // File | null | undefined
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      await onSubmit({
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price).toFixed(2),
        category: Number(form.category),
        is_available: form.is_available,
        image,
      })
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
      {(errors.form || errors.restaurant || errors.detail) && (
        <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600" role="alert">{errors.form || errors.restaurant || errors.detail}</p>
      )}
      <div>
        <ImageUpload label="Dish photo" value={image} current={initial.image} onChange={setImage} onError={(m) => setErrors({ image: m })} aspect="aspect-[4/3]" />
        {err('image')}
      </div>
      <div>
        <label className="label" htmlFor="mi-name">Dish name *</label>
        <input id="mi-name" className="input" required maxLength={150} value={form.name} onChange={set('name')} />
        {err('name')}
      </div>
      <div>
        <label className="label" htmlFor="mi-desc">Description</label>
        <textarea id="mi-desc" rows={2} className="input" value={form.description} onChange={set('description')} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="mi-price">Price (Rs.) *</label>
          <input id="mi-price" type="number" min="0" step="0.01" className="input" required value={form.price} onChange={set('price')} />
          {err('price')}
        </div>
        <div>
          <label className="label" htmlFor="mi-cat">Category *</label>
          <select id="mi-cat" className="input cursor-pointer" value={form.category} onChange={set('category')}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {err('category')}
        </div>
      </div>
      <label className="flex items-center gap-2.5 text-sm text-gray-700">
        <input type="checkbox" checked={form.is_available} onChange={set('is_available')} className="h-4 w-4 accent-brand-500" />
        Available to order
      </label>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save dish'}</button>
      </div>
    </form>
  )
}
