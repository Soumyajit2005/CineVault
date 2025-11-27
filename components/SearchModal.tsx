'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { client } from '@/sanity/lib/client'

interface SearchResult {
  _id: string
  _type: string
  title: string
  slug: { current: string }
  excerpt?: string
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  useEffect(() => {
    const searchContent = async () => {
      if (query.length < 2) {
        setResults([])
        return
      }

      setLoading(true)

      try {
        // Use parameterized query to prevent GROQ injection
        const searchQuery = `
          *[_type in ["newsArticle", "featureArticle", "review", "videoContent", "simpleReview", "simpleNews", "recommendation"] &&
            (title match $searchTerm || excerpt match $searchTerm)
          ][0...10] {
            _id,
            _type,
            title,
            slug,
            excerpt
          }
        `

        // Sanitize and format search term with wildcards
        const searchTerm = `*${query.replace(/[*\[\]]/g, '')}*`

        const data = await client.fetch<SearchResult[]>(searchQuery, { searchTerm })
        setResults(data)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(searchContent, 300)
    return () => clearTimeout(debounce)
  }, [query])

  if (!isOpen) return null

  const getResultUrl = (result: SearchResult) => {
    switch (result._type) {
      case 'newsArticle':
        return `/news/${result.slug.current}`
      case 'featureArticle':
        return `/features/${result.slug.current}`
      case 'review':
        return `/reviews/${result.slug.current}`
      case 'videoContent':
        return `/videos/${result.slug.current}`
      default:
        return '#'
    }
  }

  const getResultType = (type: string) => {
    switch (type) {
      case 'newsArticle':
        return 'News'
      case 'featureArticle':
        return 'Feature'
      case 'review':
        return 'Review'
      case 'videoContent':
        return 'Video'
      default:
        return type
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed inset-x-0 top-0 z-50 flex justify-center pt-20 px-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="search-modal-title"
      >
        <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 flex-shrink-0" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles, reviews, videos..."
              className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 outline-none text-lg"
              aria-label="Search content"
              id="search-modal-title"
            />
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
              aria-label="Close search"
            >
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Search Results */}
          <div className="max-h-96 overflow-y-auto">
            {loading && (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                Searching...
              </div>
            )}

            {!loading && query.length >= 2 && results.length === 0 && (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No results found for "{query}"
              </div>
            )}

            {!loading && query.length < 2 && (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                Type at least 2 characters to search
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {results.map((result) => (
                  <Link
                    key={result._id}
                    href={getResultUrl(result)}
                    onClick={onClose}
                    className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-500 line-clamp-2">
                          {result.title}
                        </h3>
                        {result.excerpt && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {result.excerpt}
                          </p>
                        )}
                      </div>
                      <span className="flex-shrink-0 px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded">
                        {getResultType(result._type)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {results.length > 0 && (
            <div className="p-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Showing {results.length} result{results.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
