'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { NewsArticle } from '@/lib/types'

interface BreakingNewsBannerProps {
  article: NewsArticle
}

export default function BreakingNewsBanner({ article }: BreakingNewsBannerProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Check if user has dismissed this breaking news
    const dismissedId = localStorage.getItem('dismissedBreakingNews')
    if (dismissedId === article._id) {
      setIsVisible(false)
    }
  }, [article._id])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('dismissedBreakingNews', article._id)
  }

  if (!isMounted || !isVisible) return null

  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-700 dark:to-pink-700 text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="bg-white text-purple-600 dark:text-purple-700 px-3 py-1 text-xs font-bold uppercase tracking-wider rounded flex-shrink-0 animate-pulse">
              Breaking
            </span>
            <Link
              href={`/news/${article.slug.current}`}
              className="text-sm sm:text-base font-semibold hover:underline truncate flex-1"
            >
              {article.title}
            </Link>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 hover:bg-purple-700 dark:hover:bg-purple-800 rounded transition-colors"
            aria-label="Dismiss breaking news"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
