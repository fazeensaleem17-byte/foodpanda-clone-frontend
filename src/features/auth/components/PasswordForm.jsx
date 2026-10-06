import { usePasswordForm } from '../hooks/usePasswordForm'

/** "Change password" card on the profile page. */
export default function PasswordForm() {
  const { form, setField, errors, saving, handleSubmit } = usePasswordForm()

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-6">
      <h2 className="text-lg font-semibold">Change password</h2>
      {errors.form && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600">{errors.form}</p>}
      <div>
        <label className="label" htmlFor="pw-old">
          Current password
        </label>
        <input
          id="pw-old"
          type="password"
          autoComplete="current-password"
          required
          className="input"
          value={form.old_password}
          onChange={setField('old_password')}
        />
        {errors.old_password && <p className="mt-1 text-xs text-red-600">{errors.old_password}</p>}
      </div>
      <div>
        <label className="label" htmlFor="pw-new">
          New password
        </label>
        <input
          id="pw-new"
          type="password"
          autoComplete="new-password"
          required
          className="input"
          value={form.new_password}
          onChange={setField('new_password')}
        />
        {errors.new_password && <p className="mt-1 text-xs text-red-600">{errors.new_password}</p>}
      </div>
      <div>
        <label className="label" htmlFor="pw-confirm">
          Confirm new password
        </label>
        <input
          id="pw-confirm"
          type="password"
          autoComplete="new-password"
          required
          className="input"
          value={form.confirm}
          onChange={setField('confirm')}
        />
        {errors.confirm && <p className="mt-1 text-xs text-red-600">{errors.confirm}</p>}
      </div>
      <div className="flex justify-end">
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Update password'}
        </button>
      </div>
    </form>
  )
}
