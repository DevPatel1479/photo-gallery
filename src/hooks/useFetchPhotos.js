import { useState, useEffect } from 'react'

const API_URL = 'https://picsum.photos/v2/list?limit=30'

// Fetches 30 photos once on mount and returns { photos, loading, error }.
export default function useFetchPhotos() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchPhotos() {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(API_URL, { signal: controller.signal })
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }
        const data = await response.json()
        setPhotos(data)
      } catch (err) {
        // Ignore the abort that happens when the component unmounts
        if (err.name !== 'AbortError') {
          setError(err.message || 'Something went wrong')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchPhotos()

    // Cancel the request if the component unmounts mid-fetch
    return () => controller.abort()
  }, [])

  return { photos, loading, error }
}
