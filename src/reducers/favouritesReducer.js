export const STORAGE_KEY = 'photo-gallery-favourites'

export const TOGGLE_FAVOURITE = 'TOGGLE_FAVOURITE'

// Reads the saved favourites (array of photo ids) from localStorage.
export function loadFavourites() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

// state = array of favourited photo ids
export function favouritesReducer(state, action) {
  switch (action.type) {
    case TOGGLE_FAVOURITE:
      return state.includes(action.id)
        ? state.filter((id) => id !== action.id)
        : [...state, action.id]
    default:
      return state
  }
}
