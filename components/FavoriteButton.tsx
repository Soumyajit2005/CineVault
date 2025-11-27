'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'

interface FavoriteButtonProps {
  contentId: string
  contentType: string
}

export default function FavoriteButton({ contentId, contentType }: FavoriteButtonProps) {
  const { data: session } = useSession()
  const [isFavorited, setIsFavorited] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session?.user) {
      checkFavoriteStatus()
    }
  }, [session, contentId])

  const checkFavoriteStatus = async () => {
    try {
      const response = await fetch(`/api/favorites?contentId=${contentId}`)
      if (response.ok) {
        const data = await response.json()
        setIsFavorited(data.isFavorited)
      }
    } catch (error) {
      console.error('Failed to check favorite status:', error)
    }
  }

  const toggleFavorite = async () => {
    if (!session?.user) {
      alert('Please sign in to add favorites')
      return
    }

    setLoading(true)
    try {
      if (isFavorited) {
        // Remove favorite
        const response = await fetch(`/api/favorites?contentId=${contentId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setIsFavorited(false)
        } else {
          alert('Failed to remove favorite')
        }
      } else {
        // Add favorite
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contentId, contentType }),
        })

        if (response.ok) {
          setIsFavorited(true)
        } else if (response.status === 409) {
          setIsFavorited(true)
        } else {
          alert('Failed to add favorite')
        }
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
      alert('Failed to update favorite')
    } finally {
      setLoading(false)
    }
  }

  if (!session?.user) {
    return null
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorited ? (
        <HeartIconSolid className="h-5 w-5 text-red-500" />
      ) : (
        <HeartIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      )}
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {isFavorited ? 'Saved' : 'Save'}
      </span>
    </button>
  )
}
