import { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuth } from '@features/auth'
import { categoriesApi, menuItemsApi, useRestaurantMenu } from '@features/restaurants'
import { getErrorMessage } from '@shared/utils/errors'
import { usernameOf } from '@shared/utils/format'

// Dishes that appear in past orders are protected: the backend answers 409
// with an explanation, which getErrorMessage shows as-is.
const deleteError = (err) => getErrorMessage(err, 'Could not delete. Mark dishes as unavailable instead.')

/** Menu management for one restaurant: categories and dishes (with photos). */
export function useOwnerMenu(restaurantId) {
  const { user } = useAuth()
  // As the owner we also get unavailable items and every category (even
  // empty ones), which is exactly what we need here.
  const { data, loading, error, reload } = useRestaurantMenu(restaurantId)

  const [categoryModal, setCategoryModal] = useState(null) // null | 'new' | category
  const [itemModal, setItemModal] = useState(null) // null | { categoryId } | item
  const [confirm, setConfirm] = useState(null) // { type: 'category'|'item', obj }
  const [busy, setBusy] = useState(false)
  const [togglingId, setTogglingId] = useState(null)

  const restaurant = data?.restaurant ?? null
  const categories = data?.categories ?? []
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

  const saveCategory = async (name) => {
    if (categoryModal === 'new') await categoriesApi.create({ restaurant: restaurant.id, name })
    else await categoriesApi.update(categoryModal.id, { name })
    toast.success(categoryModal === 'new' ? 'Category added' : 'Category renamed')
    setCategoryModal(null)
    refresh()
  }

  const saveItem = async (payload) => {
    // payload.image: File -> multipart upload, null -> remove, undefined -> keep
    if (itemModal.id) await menuItemsApi.update(itemModal.id, payload)
    else await menuItemsApi.create({ ...payload, restaurant: restaurant.id })
    toast.success(itemModal.id ? 'Dish updated' : 'Dish added')
    setItemModal(null)
    refresh()
  }

  const confirmDelete = async () => {
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

  return {
    loading,
    error,
    reload,
    restaurant,
    categories,
    isOwner: restaurant ? usernameOf(restaurant.owner) === user.username : false,
    itemCount: categories.reduce((n, c) => n + c.items.length, 0),
    // dialogs
    categoryModal,
    setCategoryModal,
    itemModal,
    setItemModal,
    confirm,
    setConfirm,
    // actions
    busy,
    togglingId,
    toggleAvailability,
    saveCategory,
    saveItem,
    confirmDelete,
  }
}
