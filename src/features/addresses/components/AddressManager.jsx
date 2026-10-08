import { MapPin, Pencil, Plus, Trash2 } from 'lucide-react'
import { ConfirmDialog, ErrorState, ListRowsSkeleton, Modal } from '@shared/components/ui'
import { formatAddress } from '@shared/utils/format'
import { ADDRESS_LABEL_ICONS } from '../constants'
import { useAddressManager } from '../hooks/useAddressManager'
import AddressForm from './AddressForm'

/** "My addresses" card on the profile page: list, add, edit, delete, set default. */
export default function AddressManager() {
  const {
    data,
    loading,
    error,
    reload,
    editing,
    setEditing,
    deleting,
    setDeleting,
    busy,
    save,
    remove,
    makeDefault,
  } = useAddressManager()

  return (
    <section className="card p-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">My addresses</h2>
        <button type="button" onClick={() => setEditing('new')} className="btn-outline btn-sm">
          <Plus className="h-4 w-4" aria-hidden="true" /> Add
        </button>
      </div>
      {loading ? (
        <ListRowsSkeleton rows={2} />
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : data.length === 0 ? (
        <p className="rounded-xl border-2 border-dashed border-gray-200 p-5 text-center text-sm text-gray-500">
          No saved addresses yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {data.map((a) => (
            <AddressRow
              key={a.id}
              address={a}
              onEdit={() => setEditing(a)}
              onDelete={() => setDeleting(a)}
              onMakeDefault={() => makeDefault(a)}
            />
          ))}
        </ul>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'Add address' : 'Edit address'}
      >
        {editing && (
          <AddressForm
            initial={editing === 'new' ? { is_default: !data?.length } : editing}
            onSubmit={save}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>
      <ConfirmDialog
        open={!!deleting}
        title="Delete address?"
        message={
          deleting
            ? `Delete "${formatAddress(deleting)}"? Addresses used by past orders can't be deleted.`
            : ''
        }
        confirmLabel="Delete"
        danger
        busy={busy}
        onConfirm={remove}
        onCancel={() => setDeleting(null)}
      />
    </section>
  )
}

function AddressRow({ address: a, onEdit, onDelete, onMakeDefault }) {
  const LabelIcon = ADDRESS_LABEL_ICONS[a.label] ?? MapPin
  return (
    <li className="rounded-2xl border border-gray-200 p-4 transition hover:border-gray-300">
      <div className="flex items-start justify-between gap-2">
        <div className="flex gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
            <LabelIcon className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold capitalize text-gray-900">
              {a.label}
              {a.is_default && (
                <span className="rounded-md bg-brand-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-brand-600">
                  Default
                </span>
              )}
            </p>
            <p className="text-sm text-gray-600">{formatAddress(a)}</p>
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          <button type="button" onClick={onEdit} className="btn-ghost btn-sm" aria-label="Edit address">
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="btn-ghost btn-sm text-red-500 hover:bg-red-50 hover:text-red-600"
            aria-label="Delete address"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      {!a.is_default && (
        <button
          type="button"
          onClick={onMakeDefault}
          className="ml-12 mt-1 cursor-pointer text-xs font-medium text-brand-600 hover:underline max-lg:mt-0 max-lg:min-h-10"
        >
          Set as default
        </button>
      )}
    </li>
  )
}
