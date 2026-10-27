import { useReducer, useEffect, useState, useCallback, useMemo } from 'react'
import useFetchPhotos from '../hooks/useFetchPhotos.js'
import PhotoCard from './PhotoCard.jsx'
import {
  favouritesReducer,
  loadFavourites,
  STORAGE_KEY,
  TOGGLE_FAVOURITE,
} from '../reducers/favouritesReducer.js'

export default function Gallery() {
  const { photos, loading, error } = useFetchPhotos()
  const [query, setQuery] = useState('')

  // Favourites are managed with useReducer; the initial value comes from localStorage
  const [favourites, dispatch] = useReducer(favouritesReducer, [], loadFavourites)

  // Save favourites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites))
  }, [favourites])

  // useCallback: keeps the same function reference between renders
  const handleSearch = useCallback((e) => {
    setQuery(e.target.value)
  }, [])

  // Stable reference so memoised PhotoCards don't re-render needlessly
  const handleToggle = useCallback((id) => {
    dispatch({ type: TOGGLE_FAVOURITE, id })
  }, [])

  // useMemo: only re-filters when photos or the search text change
  const filteredPhotos = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return photos
    return photos.filter((photo) => photo.author.toLowerCase().includes(term))
  }, [photos, query])

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight sm:text-3xl">Photo Gallery</h1>

      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search by author name"
        aria-label="Search photos by author name"
        className="mb-8 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200 sm:max-w-md"
      />

      {loading && (
        <div className="flex justify-center py-20" role="status" aria-label="Loading photos">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />
        </div>
      )}

      {error && (
        <p className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200" role="alert">
          Could not load photos: {error}. Check your connection and refresh the page.
        </p>
      )}

      {!loading && !error && (
        <>
          {filteredPhotos.length === 0 ? (
            <p className="py-10 text-center text-slate-500">No photos match that author name.</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {filteredPhotos.map((photo) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  isFavourite={favourites.includes(photo.id)}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  )
}
