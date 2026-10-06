import { useAsync } from '@shared/hooks/useAsync'
import { restaurantsApi } from '../api/restaurantsApi'

/** Distinct restaurant cities, sorted, for the city filter (null while loading). */
export function useCities() {
  return useAsync(() => restaurantsApi.cities(), []).data
}
