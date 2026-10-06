import { useEffect, useState } from 'react'
import { useAsync } from '@shared/hooks/useAsync'
import { restaurantsApi } from '../api/restaurantsApi'
import { DEFAULT_SORT, SEARCH_DEBOUNCE_MS } from '../constants'

/**
 * Restaurant list for the Home page with its search, filters, sorting and paging.
 * GET /restaurants/?search=&city=&is_open=&ordering=&page=
 */
export function useRestaurants() {
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('')
  const [openNow, setOpenNow] = useState(false)
  const [ordering, setOrdering] = useState(DEFAULT_SORT)
  const [page, setPage] = useState(1)

  // Debounce the search box so we don't call the API on every keystroke.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim())
      setPage(1)
    }, SEARCH_DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [searchInput])

  const { data, loading, error, reload } = useAsync(() => {
    const params = { page, ordering }
    if (search) params.search = search
    if (city) params.city = city
    if (openNow) params.is_open = true
    return restaurantsApi.list(params)
  }, [search, city, openNow, ordering, page])

  const hasFilters = Boolean(search || city || openNow)

  return {
    data,
    loading,
    error,
    reload,
    // filter values
    searchInput,
    search,
    city,
    openNow,
    ordering,
    page,
    hasFilters,
    // filter actions
    setSearchInput,
    setPage,
    /** Search immediately (form submit) instead of waiting for the debounce. */
    submitSearch: () => {
      setSearch(searchInput.trim())
      setPage(1)
    },
    /** Search for a cuisine keyword, or clear it if it is already active. */
    toggleCuisine: (q) => setSearchInput(q === search ? '' : q),
    changeCity: (value) => {
      setCity(value)
      setPage(1)
    },
    changeOrdering: (value) => {
      setOrdering(value)
      setPage(1)
    },
    toggleOpenNow: () => {
      setOpenNow((v) => !v)
      setPage(1)
    },
    clearFilters: () => {
      setSearchInput('')
      setSearch('')
      setCity('')
      setOpenNow(false)
      setPage(1)
    },
  }
}
