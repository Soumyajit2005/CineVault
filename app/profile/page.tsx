'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { HeartIcon, ChatBubbleLeftIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

interface Comment {
  id: string
  content: string
  contentId: string
  contentType: string
  createdAt: string
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>([])
  const [favoritesCount, setFavoritesCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      loadUserData()
    }
  }, [status])

  const loadUserData = async () => {
    setLoading(true)
    try {
      // Load favorites count
      const favoritesResponse = await fetch('/api/favorites')
      if (favoritesResponse.ok) {
        const favoritesData = await favoritesResponse.json()
        setFavoritesCount(favoritesData.favorites.length)
      }

      // Note: We would need to add an endpoint to get user's comments
      // For now, we'll just show the favorites count
    } catch (error) {
      console.error('Failed to load user data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  width={120}
                  height={120}
                  className="rounded-full"
                />
              ) : (
                <div className="w-30 h-30 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-4xl">
                    {session.user.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {session.user.name || 'Anonymous User'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {session.user.email}
              </p>

              {session.user.isAdmin && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  Admin
                </span>
              )}

              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="mt-4 flex items-center gap-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Favorites Card */}
          <Link
            href="/favorites"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <HeartIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Favorites</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {favoritesCount}
                </p>
              </div>
            </div>
          </Link>

          {/* Comments Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <ChatBubbleLeftIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Comments</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {comments.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Quick Links
          </h2>
          <div className="space-y-3">
            <Link
              href="/favorites"
              className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <span className="text-gray-900 dark:text-white font-medium">
                View My Favorites
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                See all the content you've saved
              </p>
            </Link>

            {session.user.isAdmin && (
              <>
                <Link
                  href="/recommendations"
                  className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="text-gray-900 dark:text-white font-medium">
                    Manage Content
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Add, edit, or remove recommendations and reviews
                  </p>
                </Link>

                <Link
                  href="/studio"
                  className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="text-gray-900 dark:text-white font-medium">
                    Sanity Studio
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Full content management system
                  </p>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
