export const SORT_OPTIONS = [
  { value: '-average_rating', label: 'Top rated' },
  { value: '-created_at', label: 'Newest' },
  { value: 'name', label: 'Name (A-Z)' },
]

export const DEFAULT_SORT = '-average_rating'

/** Delay before a typed search hits the API, in milliseconds. */
export const SEARCH_DEBOUNCE_MS = 350

// Cuisine shortcuts. Each keyword is a dish-name search the backend supports
// (restaurant search matches dish names). A tile only appears when some dish
// matches, and it uses that dish's real photo.
export const CUISINES = [
  { label: 'Biryani', q: 'biryani' },
  { label: 'Pizza', q: 'pizza' },
  { label: 'Tikka', q: 'tikka' },
  { label: 'Karahi', q: 'karahi' },
  { label: 'Kebabs', q: 'kabab' },
  { label: 'Pulao', q: 'pulao' },
  { label: 'Naan', q: 'naan' },
  { label: 'Fries', q: 'fries' },
  { label: 'Burgers', q: 'burger' },
  { label: 'Lassi', q: 'lassi' },
]
