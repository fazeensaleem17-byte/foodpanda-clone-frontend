import { useProfileForm } from '../hooks/useProfileForm'

/** "Personal details" card on the profile page. */
export default function ProfileForm() {
  const { user, form, setField, errors, saving, handleSubmit } = useProfileForm()

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-6">
      <h2 className="text-lg font-semibold">Personal details</h2>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="p-first">
            First name
          </label>
          <input id="p-first" className="input" value={form.first_name} onChange={setField('first_name')} />
        </div>
        <div>
          <label className="label" htmlFor="p-last">
            Last name
          </label>
          <input id="p-last" className="input" value={form.last_name} onChange={setField('last_name')} />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="p-username">
          Username
        </label>
        <input id="p-username" className="input bg-gray-50 text-gray-500" value={user.username} disabled />
      </div>
      <div>
        <label className="label" htmlFor="p-email">
          Email
        </label>
        <input id="p-email" type="email" className="input" value={form.email} onChange={setField('email')} />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
      </div>
      <div>
        <label className="label" htmlFor="p-phone">
          Phone
        </label>
        <input
          id="p-phone"
          className="input"
          maxLength={20}
          value={form.phone}
          onChange={setField('phone')}
        />
        {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
      </div>
      <div>
        <label className="label" htmlFor="p-bio">
          Bio
        </label>
        <textarea
          id="p-bio"
          rows={3}
          className="input"
          value={form.bio}
          onChange={setField('bio')}
          placeholder="A little about you"
        />
      </div>
      <div className="flex justify-end">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </div>
    </form>
  )
}
