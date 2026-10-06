import { useCategoryForm } from '../hooks/useCategoryForm'

/** Add / rename a menu category. */
export default function CategoryForm({ initial, onSubmit, onCancel }) {
  const { name, setName, error, saving, handleSubmit } = useCategoryForm({ initial, onSubmit })

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <div>
        <label className="label" htmlFor="cat-name">
          Category name
        </label>
        <input
          id="cat-name"
          className="input"
          required
          maxLength={100}
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Rice, BBQ, Drinks"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="btn-ghost">
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}
