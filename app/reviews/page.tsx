'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { client } from '@/sanity/lib/client'
import { allSimpleReviewsQuery } from '@/lib/queries'
import AddButton from '@/components/AddButton'
import ContentCard from '@/components/ContentCard'

interface ContentItem {
  _id: string
  _type: string
  title: string
  slug: { current: string }
  excerpt?: string
  featuredImage?: any
  type?: string
  rating?: number
  pros?: string[]
  cons?: string[]
  verdict?: string
  tags?: string[]
  featured: boolean
  publishedAt: string
  author?: string
}

export default function ReviewsPage() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.isAdmin || false
  const [items, setItems] = useState<ContentItem[]>([])
  const [filteredItems, setFilteredItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedRating, setSelectedRating] = useState('all')

  useEffect(() => {
    fetchItems()
  }, [])

  useEffect(() => {
    filterItems()
  }, [items, searchQuery, selectedType, selectedRating])

  const fetchItems = async () => {
    try {
      const data = await client.fetch<ContentItem[]>(allSimpleReviewsQuery)
      setItems(data)
      setFilteredItems(data)
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterItems = () => {
    let filtered = [...items]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.verdict?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter((item) => item.type === selectedType)
    }

    // Rating filter
    if (selectedRating !== 'all') {
      const ratingThreshold = parseInt(selectedRating)
      filtered = filtered.filter((item) => item.rating && item.rating >= ratingThreshold)
    }

    setFilteredItems(filtered)
  }

  const types = Array.from(new Set(items.map((item) => item.type).filter(Boolean)))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading reviews...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                Reviews
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Honest reviews of the latest movies and shows
              </p>
            </div>
            {isAdmin && <AddButton type="simpleReview" />}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            {/* Search */}
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />

            {/* Type Filter */}
            {types.length > 0 && (
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            )}

            {/* Rating Filter */}
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">All Ratings</option>
              <option value="8">8+ Stars</option>
              <option value="7">7+ Stars</option>
              <option value="6">6+ Stars</option>
              <option value="5">5+ Stars</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredItems.length} of {items.length} reviews
        </div>

        {/* Content Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <ContentCard key={item._id} content={item} isAdmin={isAdmin} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery || selectedType !== 'all' || selectedRating !== 'all'
                ? 'No reviews match your filters.'
                : 'No reviews available yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
