import { useAsync } from '@shared/hooks/useAsync'
import { resultsOf } from '@shared/lib/apiClient'
import { addressesApi } from '../api/addressesApi'

/** The current user's saved addresses (default first): { data, loading, error, reload }. */
export function useAddresses() {
  return useAsync(() => addressesApi.list().then(resultsOf), [])
}
