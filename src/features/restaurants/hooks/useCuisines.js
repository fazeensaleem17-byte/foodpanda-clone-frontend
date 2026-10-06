import { useMemo } from 'react'
import { useAsync } from '@shared/hooks/useAsync'
import { menuItemsApi } from '../api/menuItemsApi'
import { CUISINES } from '../constants'

/**
 * "Popular cuisines" tiles for the Home page. A cuisine is listed only when
 * some dish name matches its keyword, and it borrows that dish's photo.
 */
export function useCuisines() {
  const dishes = useAsync(() => menuItemsApi.all(), [])

  const cuisines = useMemo(() => {
    if (!dishes.data) return []
    return CUISINES.map((c) => {
      const matches = dishes.data.filter((d) => d.name.toLowerCase().includes(c.q))
      if (!matches.length) return null
      return { ...c, image: (matches.find((d) => d.image) || matches[0]).image }
    }).filter(Boolean)
  }, [dishes.data])

  return { cuisines, loading: dishes.loading }
}
