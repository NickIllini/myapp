import React, { useState } from 'react'

interface SearchBoxProps {
  onLocationFound: (lat: number, lng: number, name: string) => void
}

const SearchBox: React.FC<SearchBoxProps> = ({ onLocationFound }) => {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchLocation = async () => {
    if (!query.trim()) return

    setLoading(true)
    setError(null)

    try {
      // Using Nominatim API (OpenStreetMap's geocoding service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=1`
      )
      const data = await response.json()

      if (data && data.length > 0) {
        const result = data[0]
        onLocationFound(
          parseFloat(result.lat),
          parseFloat(result.lon),
          result.display_name
        )
        setQuery('')
      } else {
        setError('Location not found. Try a different search term.')
      }
    } catch (err) {
      setError('Failed to search location. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    searchLocation()
  }

  return (
    <div className="absolute top-4 left-8 z-[1000] w-80">
      <form onSubmit={handleSubmit} className="search-box rounded-lg p-4 shadow-lg">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a location..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              '🔍'
            )}
          </button>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </form>
    </div>
  )
}

export default SearchBox