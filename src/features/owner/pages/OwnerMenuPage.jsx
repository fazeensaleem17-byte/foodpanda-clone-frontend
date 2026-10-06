import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, Eye, FolderPlus, Plus } from 'lucide-react'
import {
  ConfirmDialog,
  EmptyState,
  ErrorState,
  ListRowsSkeleton,
  Modal,
  Skeleton,
  SmartImage,
  StatusBadge,
} from '@shared/components/ui'
import CategoryForm from '../components/CategoryForm'
import MenuCategorySection from '../components/MenuCategorySection'
import MenuItemForm from '../components/MenuItemForm'
import { useOwnerMenu } from '../hooks/useOwnerMenu'

/** Owner: manage categories and menu items (with photos) of one restaurant. */
export default function OwnerMenuPage() {
  const { id } = useParams()
  const menu = useOwnerMenu(id)
  const {
    restaurant,
    categories,
    categoryModal,
    setCategoryModal,
    itemModal,
    setItemModal,
    confirm,
    setConfirm,
  } = menu

  if (menu.loading) return <OwnerMenuSkeleton />
  if (menu.error)
    return (
      <div className="page">
        <ErrorState message={menu.error} onRetry={menu.reload} />
      </div>
    )
  if (!menu.isOwner)
    return (
      <div className="page">
        <ErrorState message="You can only manage restaurants you own." />
      </div>
    )

  return (
    <div className="page max-w-5xl">
      <Link
        to="/owner"
        className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Dashboard
      </Link>
      <div className="mb-8 mt-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <SmartImage
            src={restaurant.logo}
            alt=""
            kind="logo"
            rounded="rounded-2xl"
            className="h-16 w-16 shadow-sm"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="page-title">{restaurant.name}</h1>
              <StatusBadge
                status={restaurant.is_open ? 'open' : 'closed'}
                label={restaurant.is_open ? 'Open' : 'Closed'}
              />
            </div>
            <p className="text-sm text-gray-500">
              {categories.length} categories · {menu.itemCount} dishes
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={`/restaurants/${restaurant.id}`} className="btn-ghost">
            <Eye className="h-4 w-4" aria-hidden="true" /> Preview
          </Link>
          <button type="button" onClick={() => setCategoryModal('new')} className="btn-outline">
            <FolderPlus className="h-4 w-4" aria-hidden="true" /> Category
          </button>
          <button
            type="button"
            disabled={!categories.length}
            onClick={() => setItemModal({ categoryId: categories[0]?.id })}
            className="btn-primary"
          >
            <Plus className="h-4 w-4" aria-hidden="true" /> Dish
          </button>
        </div>
      </div>

      {categories.length === 0 ? (
        <EmptyState
          icon={FolderPlus}
          title="Start with a category"
          message='Dishes are grouped into categories like "Rice", "BBQ" or "Drinks".'
          action="Add category"
          onAction={() => setCategoryModal('new')}
        />
      ) : (
        <div className="space-y-6">
          {categories.map((c) => (
            <MenuCategorySection
              key={c.id}
              category={c}
              togglingId={menu.togglingId}
              onAddItem={() => setItemModal({ categoryId: c.id })}
              onRename={() => setCategoryModal(c)}
              onDelete={() => setConfirm({ type: 'category', obj: c })}
              onToggleItem={menu.toggleAvailability}
              onEditItem={(item) => setItemModal({ ...item, category: c.id })}
              onDeleteItem={(item) => setConfirm({ type: 'item', obj: item })}
            />
          ))}
        </div>
      )}

      <Modal
        open={!!categoryModal}
        onClose={() => setCategoryModal(null)}
        title={categoryModal === 'new' ? 'New category' : 'Rename category'}
        size="max-w-md"
      >
        {categoryModal && (
          <CategoryForm
            initial={categoryModal === 'new' ? '' : categoryModal.name}
            onSubmit={menu.saveCategory}
            onCancel={() => setCategoryModal(null)}
          />
        )}
      </Modal>

      <Modal
        open={!!itemModal}
        onClose={() => setItemModal(null)}
        title={itemModal?.id ? `Edit ${itemModal.name}` : 'New dish'}
      >
        {itemModal && (
          <MenuItemForm
            initial={itemModal}
            categories={categories}
            onSubmit={menu.saveItem}
            onCancel={() => setItemModal(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        title={confirm?.type === 'category' ? 'Delete category?' : 'Delete dish?'}
        message={
          confirm?.type === 'category'
            ? `Deleting "${confirm.obj.name}" also deletes all ${confirm.obj.items.length} dishes in it. Dishes that were already ordered can't be deleted.`
            : `Delete "${confirm?.obj.name}" from the menu? Dishes that were already ordered can't be deleted; switch them to unavailable instead.`
        }
        confirmLabel="Delete"
        danger
        busy={menu.busy}
        onConfirm={menu.confirmDelete}
        onCancel={() => setConfirm(null)}
      />
    </div>
  )
}

function OwnerMenuSkeleton() {
  return (
    <div className="page max-w-5xl">
      <Skeleton className="mb-4 h-4 w-24" />
      <div className="mb-8 flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
      <div className="card p-5">
        <ListRowsSkeleton rows={4} />
      </div>
    </div>
  )
}
