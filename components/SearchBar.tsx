'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { urlFor } from '@/sanity/lib/image'

interface SearchResult {
  _id: string
  _type: 'movie' | 'tvSeries'
  title: string
  slug: { current: string }
  poster?: any
  releaseDate?: string
  firstAirDate?: string
  hasRecommendation?: boolean
  recommendationSlug?: string
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Search function with debounce
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setIsOpen(false)
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        setResults(data.results || [])
        setIsOpen(true)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  const handleResultClick = (result: SearchResult) => {
    const path = result._type === 'movie' ? `/movies/${result.slug.current}` : `/tv/${result.slug.current}`
    router.push(path)
    setQuery('')
    setIsOpen(false)
  }

  const getYear = (result: SearchResult) => {
    const date = result._type === 'movie' ? result.releaseDate : result.firstAirDate
    return date ? new Date(date).getFullYear() : ''
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies or TV series..."
          className="w-full px-4 py-2.5 pl-11 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 transition-colors"
        />
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 dark:text-zinc-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-zinc-800 rounded-lg shadow-2xl border border-zinc-200 dark:border-zinc-700 max-h-96 overflow-y-auto">
          {results.map((result) => (
            <div key={result._id} className="border-b border-zinc-100 dark:border-zinc-700 last:border-b-0">
              <button
                onClick={() => handleResultClick(result)}
                className="w-full flex items-center gap-3 p-3 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
              >
                {result.poster ? (
                  <Image
                    src={urlFor(result.poster).width(60).height(90).url()}
                    alt={result.title}
                    width={40}
                    height={60}
                    className="rounded object-cover"
                  />
                ) : (
                  <div className="w-10 h-15 bg-zinc-200 dark:bg-zinc-600 rounded flex items-center justify-center">
                    <svg className="w-5 h-5 text-zinc-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                    </svg>
                  </div>
                )}
                <div className="flex-1 text-left">
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">{result.title}</p>
                  <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                    <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                      {result._type === 'movie' ? 'Movie' : 'TV Series'}
                    </span>
                    {getYear(result) && <span>{getYear(result)}</span>}
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {/* Recommendation Link */}
              {result.hasRecommendation && result.recommendationSlug && (
                <button
                  onClick={() => {
                    router.push(`/lists/${result.recommendationSlug}`)
                    setQuery('')
                    setIsOpen(false)
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors text-left border-t border-purple-200 dark:border-purple-800"
                >
                  <svg className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    See {result._type === 'movie' ? 'Movies' : 'Shows'} Like This
                  </span>
                  <svg className="w-4 h-4 text-purple-600 dark:text-purple-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {isOpen && query && !loading && results.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-zinc-800 rounded-lg shadow-2xl border border-zinc-200 dark:border-zinc-700 p-8 text-center">
          <svg
            className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-600 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p className="text-zinc-600 dark:text-zinc-400">No results found for "{query}"</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-1">Try searching with different keywords</p>
        </div>
      )}
    </div>
  )
}
