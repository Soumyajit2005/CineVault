'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { client } from '@/sanity/lib/client'
import ContentCard from '@/components/ContentCard'
import { HeartIcon } from '@heroicons/react/24/outline'

interface Favorite {
  id: string
  contentId: string
  contentType: string
  createdAt: string
}

export default function FavoritesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [content, setContent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      loadFavorites()
    }
  }, [status])

  const loadFavorites = async () => {
    setLoading(true)
    try {
      // Load favorites from database
      const response = await fetch('/api/favorites')
      if (!response.ok) throw new Error('Failed to load favorites')

      const data = await response.json()
      setFavorites(data.favorites)

      // Load content from Sanity
      if (data.favorites.length > 0) {
        const contentIds = data.favorites.map((f: Favorite) => f.contentId)

        const query = `
          *[_id in $ids] {
            _id,
            _type,
            title,
            slug,
            excerpt,
            featuredImage,
            rating,
            category,
            type,
            publishedAt
          }
        `

        const sanityContent = await client.fetch(query, { ids: contentIds })

        // Match content with favorites to preserve order
        const orderedContent = data.favorites.map((fav: Favorite) =>
          sanityContent.find((c: any) => c._id === fav.contentId)
        ).filter(Boolean) // Remove any null values

        setContent(orderedContent)
      }
    } catch (error) {
      console.error('Failed to load favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavorite = async (contentId: string) => {
    try {
      const response = await fetch(`/api/favorites?contentId=${contentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Remove from local state
        setFavorites(favorites.filter((f) => f.contentId !== contentId))
        setContent(content.filter((c) => c._id !== contentId))
      }
    } catch (error) {
      console.error('Failed to remove favorite:', error)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">Loading your favorites...</p>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <HeartIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              My Favorites
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {content.length} {content.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {/* Content */}
        {content.length === 0 ? (
          <div className="text-center py-16">
            <HeartIcon className="h-16 w-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No favorites yet
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start exploring and save content you love!
            </p>
            <a
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Explore Content
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map((item) => (
              <div key={item._id} className="relative">
                <ContentCard
                  content={item}
                  isAdmin={false}
                />
                <button
                  onClick={() => handleRemoveFavorite(item._id)}
                  className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
                  aria-label="Remove from favorites"
                  title="Remove from favorites"
                >
                  <HeartIcon className="h-5 w-5 text-red-600 fill-current" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
