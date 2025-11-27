'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { client } from '@/sanity/lib/client'
import { allSimpleNewsQuery } from '@/lib/queries'
import AddButton from '@/components/AddButton'
import ContentCard from '@/components/ContentCard'

interface ContentItem {
  _id: string
  _type: string
  title: string
  slug: { current: string }
  excerpt?: string
  featuredImage?: any
  category?: string
  tags?: string[]
  featured: boolean
  publishedAt: string
  author?: string
}

export default function NewsPage() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.isAdmin || false
  const [items, setItems] = useState<ContentItem[]>([])
  const [filteredItems, setFilteredItems] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchItems()
  }, [])

  useEffect(() => {
    filterItems()
  }, [items, searchQuery, selectedCategory])

  const fetchItems = async () => {
    try {
      const data = await client.fetch<ContentItem[]>(allSimpleNewsQuery)
      setItems(data)
      setFilteredItems(data)
    } catch (error) {
      console.error('Error fetching news:', error)
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
          item.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item) => item.category === selectedCategory)
    }

    setFilteredItems(filtered)
  }

  const categories = Array.from(new Set(items.map((item) => item.category).filter(Boolean)))

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading news...</div>
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
                News
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Stay updated with the latest entertainment news
              </p>
            </div>
            {isAdmin && <AddButton type="simpleNews" />}
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            {/* Search */}
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />

            {/* Category Filter */}
            {categories.length > 0 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredItems.length} of {items.length} news articles
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
              {searchQuery || selectedCategory !== 'all'
                ? 'No news articles match your filters.'
                : 'No news articles available yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
