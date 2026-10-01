import { useState } from 'react'
import toast from 'react-hot-toast'
import { Briefcase, Home, MapPin, Pencil, Plus, Trash2 } from 'lucide-react'
import { addressesApi } from '../api/addresses'
import { authApi } from '../api/auth'
import { resultsOf } from '../api/client'
import { useAsync } from '../hooks/useAsync'
import { useAuth } from '../context/AuthContext'
import AddressForm from '../components/AddressForm'
import { Avatar } from '../components/Navbar'
import { ListRowsSkeleton } from '../components/Skeletons'
import Modal, { ConfirmDialog } from '../components/Modal'
import { ErrorState } from '../components/StateMessages'
import { formatAddress, formatShortDate } from '../utils/format'
import { getErrorMessage, getFieldErrors } from '../utils/errors'

const LABEL_ICONS = { home: Home, work: Briefcase, other: MapPin }
const ROLE_LABEL = { customer: 'Customer', owner: 'Restaurant owner', rider: 'Rider' }

export default function Profile() {
  const { user } = useAuth()
  return (
    <div className="page max-w-4xl">
      <div className="mb-8 flex items-center gap-4">
        <Avatar user={user} size="h-16 w-16 text-xl" />
        <div>
          <h1 className="page-title">{[user.first_name, user.last_name].filter(Boolean).join(' ') || user.username}</h1>
          <p className="text-sm text-gray-500">
            @{user.username} · {ROLE_LABEL[user.role]}
            {user.profile?.created_at && ` · Member since ${formatShortDate(user.profile.created_at)}`}
          </p>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ProfileForm />
        <div className="space-y-6">
          {user.role === 'customer' && <AddressManager />}
          <PasswordForm />
        </div>
      </div>
    </div>
  )
}

function ProfileForm() {
  const { user, updateProfile } = useAuth()
  const [form, setForm] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    email: user.email || '',
    phone: user.phone || '',
    bio: user.profile?.bio || '',
  })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      // PATCH /auth/me/ - bio lives on the nested profile object
      const { bio, ...fields } = form
      await updateProfile({ ...fields, profile: { bio } })
      toast.success('Profile updated')
    } catch (err) {
      setErrors(getFieldErrors(err))
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-6">
      <h2 className="text-lg font-semibold">Personal details</h2>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="p-first">First name</label>
          <input id="p-first" className="input" value={form.first_name} onChange={set('first_name')} />
        </div>
        <div>
          <label className="label" htmlFor="p-last">Last name</label>
          <input id="p-last" className="input" value={form.last_name} onChange={set('last_name')} />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="p-username">Username</label>
        <input id="p-username" className="input bg-gray-50 text-gray-500" value={user.username} disabled />
      </div>
      <div>
        <label className="label" htmlFor="p-email">Email</label>
        <input id="p-email" type="email" className="input" value={form.email} onChange={set('email')} />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
      </div>
      <div>
        <label className="label" htmlFor="p-phone">Phone</label>
        <input id="p-phone" className="input" maxLength={20} value={form.phone} onChange={set('phone')} />
        {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
      </div>
      <div>
        <label className="label" htmlFor="p-bio">Bio</label>
        <textarea id="p-bio" rows={3} className="input" value={form.bio} onChange={set('bio')} placeholder="A little about you" />
      </div>
      <div className="flex justify-end">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button>
      </div>
    </form>
  )
}

function AddressManager() {
  const { data, loading, error, reload } = useAsync(() => addressesApi.list().then(resultsOf), [])
  const [editing, setEditing] = useState(null) // null | 'new' | address
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)

  const save = async (payload) => {
    if (editing === 'new') await addressesApi.create(payload)
    else await addressesApi.update(editing.id, payload)
    toast.success(editing === 'new' ? 'Address added' : 'Address updated')
    setEditing(null)
    reload({ silent: true })
  }

  const remove = async () => {
    setBusy(true)
    try {
      await addressesApi.remove(deleting.id)
      toast.success('Address deleted')
      reload({ silent: true })
    } catch (err) {
      // 409: address is used by an existing order
      toast.error(getErrorMessage(err))
    } finally {
      setBusy(false)
      setDeleting(null)
    }
  }

  const makeDefault = async (a) => {
    try {
      await addressesApi.update(a.id, { is_default: true })
      toast.success('Default address updated')
      reload({ silent: true })
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <section className="card p-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">My addresses</h2>
        <button type="button" onClick={() => setEditing('new')} className="btn-outline btn-sm"><Plus className="h-4 w-4" aria-hidden="true" /> Add</button>
      </div>
      {loading ? (
        <ListRowsSkeleton rows={2} />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data.length === 0 ? (
        <p className="rounded-xl border-2 border-dashed border-gray-200 p-5 text-center text-sm text-gray-500">No saved addresses yet.</p>
      ) : (
        <ul className="space-y-3">
          {data.map((a) => {
            const LabelIcon = LABEL_ICONS[a.label] ?? MapPin
            return (
            <li key={a.id} className="rounded-2xl border border-gray-200 p-4 transition hover:border-gray-300">
              <div className="flex items-start justify-between gap-2">
                <div className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500"><LabelIcon className="h-4 w-4" aria-hidden="true" /></span>
                  <div>
                    <p className="flex items-center gap-2 text-sm font-semibold capitalize text-gray-900">
                      {a.label}
                      {a.is_default && <span className="rounded-md bg-brand-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-brand-600">Default</span>}
                    </p>
                    <p className="text-sm text-gray-600">{formatAddress(a)}</p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button type="button" onClick={() => setEditing(a)} className="btn-ghost btn-sm" aria-label="Edit address"><Pencil className="h-4 w-4" aria-hidden="true" /></button>
                  <button type="button" onClick={() => setDeleting(a)} className="btn-ghost btn-sm text-red-500 hover:bg-red-50 hover:text-red-600" aria-label="Delete address"><Trash2 className="h-4 w-4" aria-hidden="true" /></button>
                </div>
              </div>
              {!a.is_default && (
                <button type="button" onClick={() => makeDefault(a)} className="ml-12 mt-1 cursor-pointer text-xs font-medium text-brand-600 hover:underline">Set as default</button>
              )}
            </li>
            )
          })}
        </ul>
      )}

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing === 'new' ? 'Add address' : 'Edit address'}>
        {editing && (
          <AddressForm initial={editing === 'new' ? { is_default: !data?.length } : editing} onSubmit={save} onCancel={() => setEditing(null)} />
        )}
      </Modal>
      <ConfirmDialog
        open={!!deleting}
        title="Delete address?"
        message={deleting ? `Delete "${formatAddress(deleting)}"? Addresses used by past orders can't be deleted.` : ''}
        confirmLabel="Delete"
        danger
        busy={busy}
        onConfirm={remove}
        onCancel={() => setDeleting(null)}
      />
    </section>
  )
}

function PasswordForm() {
  const [form, setForm] = useState({ old_password: '', new_password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.new_password !== form.confirm) return setErrors({ confirm: 'Passwords do not match.' })
    setSaving(true)
    setErrors({})
    try {
      await authApi.changePassword(form.old_password, form.new_password)
      toast.success('Password changed')
      setForm({ old_password: '', new_password: '', confirm: '' })
    } catch (err) {
      const fields = getFieldErrors(err)
      setErrors(Object.keys(fields).length ? fields : { form: getErrorMessage(err) })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-6">
      <h2 className="text-lg font-semibold">Change password</h2>
      {errors.form && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{errors.form}</p>}
      <div>
        <label className="label" htmlFor="pw-old">Current password</label>
        <input id="pw-old" type="password" autoComplete="current-password" required className="input" value={form.old_password} onChange={set('old_password')} />
        {errors.old_password && <p className="mt-1 text-xs text-red-600">{errors.old_password}</p>}
      </div>
      <div>
        <label className="label" htmlFor="pw-new">New password</label>
        <input id="pw-new" type="password" autoComplete="new-password" required className="input" value={form.new_password} onChange={set('new_password')} />
        {errors.new_password && <p className="mt-1 text-xs text-red-600">{errors.new_password}</p>}
      </div>
      <div>
        <label className="label" htmlFor="pw-confirm">Confirm new password</label>
        <input id="pw-confirm" type="password" autoComplete="new-password" required className="input" value={form.confirm} onChange={set('confirm')} />
        {errors.confirm && <p className="mt-1 text-xs text-red-600">{errors.confirm}</p>}
      </div>
      <div className="flex justify-end">
        <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Update password'}</button>
      </div>
    </form>
  )
}
