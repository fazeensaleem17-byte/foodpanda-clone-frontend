import { Pencil, Plus, Trash2 } from 'lucide-react'
import { SmartImage } from '@shared/components/ui'
import { formatPrice } from '@shared/utils/format'

/** One category on the owner's menu page: its header actions and the list of dishes. */
export default function MenuCategorySection({
  category: c,
  togglingId,
  onAddItem,
  onRename,
  onDelete,
  onToggleItem,
  onEditItem,
  onDeleteItem,
}) {
  return (
    <section className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 bg-gray-50/70 px-5 py-3">
        <h2 className="font-semibold">
          {c.name} <span className="font-normal text-gray-400">({c.items.length})</span>
        </h2>
        <div className="flex gap-1">
          <button type="button" onClick={onAddItem} className="btn-ghost btn-sm text-brand-600">
            <Plus className="h-3.5 w-3.5" aria-hidden="true" /> Dish
          </button>
          <button type="button" onClick={onRename} className="btn-ghost btn-sm">
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Rename
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="btn-ghost btn-sm text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Delete
          </button>
        </div>
      </div>
      {c.items.length === 0 ? (
        <p className="p-5 text-sm text-gray-500">No dishes in this category yet.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {c.items.map((item) => (
            <MenuItemRow
              key={item.id}
              item={item}
              toggling={togglingId === item.id}
              onToggle={() => onToggleItem(item)}
              onEdit={() => onEditItem(item)}
              onDelete={() => onDeleteItem(item)}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

function MenuItemRow({ item, toggling, onToggle, onEdit, onDelete }) {
  return (
    <li
      className={`flex flex-wrap items-center gap-4 px-5 py-4 transition hover:bg-gray-50/60 ${item.is_available ? '' : 'bg-gray-50'}`}
    >
      <SmartImage
        src={item.image}
        alt={item.name}
        rounded="rounded-xl"
        className={`h-14 w-14 shrink-0 ${item.is_available ? '' : 'grayscale'}`}
      />
      <div className="min-w-0 flex-1">
        <p className={`font-medium ${item.is_available ? 'text-gray-900' : 'text-gray-400 line-through'}`}>
          {item.name}
        </p>
        {item.description && <p className="truncate text-sm text-gray-500">{item.description}</p>}
      </div>
      {/* On phones the price, toggle and buttons share one right-aligned row.
          From 640px up, "contents" removes this wrapper and the row is laid out exactly as before. */}
      <div className="flex items-center gap-4 max-sm:w-full max-sm:justify-end sm:contents">
        <span className="w-24 text-right font-semibold text-gray-900">{formatPrice(item.price)}</span>
        {/* Availability toggle */}
        <button
          type="button"
          role="switch"
          aria-checked={item.is_available}
          aria-label={`${item.name} available`}
          disabled={toggling}
          onClick={onToggle}
          className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition duration-300 disabled:opacity-50 max-lg:before:absolute max-lg:before:-inset-2 max-lg:before:content-[''] ${item.is_available ? 'bg-emerald-500' : 'bg-gray-300'}`}
          title={item.is_available ? 'Available: click to hide' : 'Unavailable: click to show'}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${item.is_available ? 'left-5.5' : 'left-0.5'}`}
          />
        </button>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onEdit}
            className="btn-ghost btn-sm"
            aria-label={`Edit ${item.name}`}
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="btn-ghost btn-sm text-red-500 hover:bg-red-50 hover:text-red-600"
            aria-label={`Delete ${item.name}`}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </li>
  )
}
