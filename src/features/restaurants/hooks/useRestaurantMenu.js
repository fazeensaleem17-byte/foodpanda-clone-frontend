import { useAsync } from '@shared/hooks/useAsync'
import { restaurantsApi } from '../api/restaurantsApi'

/**
 * One restaurant with its menu grouped by category.
 * GET /restaurants/{id}/menu/ -> { restaurant, categories: [{ id, name, items }] }
 * The restaurant's owner also receives unavailable items and empty categories.
 */
export function useRestaurantMenu(restaurantId) {
  return useAsync(() => restaurantsApi.menu(restaurantId), [restaurantId])
}
