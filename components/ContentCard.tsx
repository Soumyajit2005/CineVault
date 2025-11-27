'use client'

import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/lib/sanity'
import { useState } from 'react'
import { client } from '@/sanity/lib/client'
import { motion } from 'framer-motion'
import { Star, Calendar, Tag, TrendingUp } from 'lucide-react'

interface ContentCardProps {
  content: any
  type?: 'recommendation' | 'review' | 'news'
  isAdmin: boolean
  priority?: boolean
}

export default function ContentCard({ content, type, isAdmin, priority = false }: ContentCardProps) {
  // Auto-detect type from content _type if not provided
  const contentType = type || (content._type === 'recommendation' ? 'recommendation' :
                               content._type === 'simpleReview' ? 'review' : 'news')

  const [featured, setFeatured] = useState(content.featured)
  const [updating, setUpdating] = useState(false)

  const toggleFeatured = async () => {
    setUpdating(true)
    try {
      await fetch('/api/toggle-featured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: content._id,
          type: contentType === 'recommendation' ? 'recommendation' : contentType === 'review' ? 'simpleReview' : 'simpleNews',
          featured: !featured,
        }),
      })
      setFeatured(!featured)
    } catch (error) {
      console.error('Failed to toggle featured:', error)
    } finally {
      setUpdating(false)
    }
  }

  const getHref = () => {
    if (contentType === 'recommendation') return `/recommendations/${content.slug.current}`
    if (contentType === 'review') return `/reviews/${content.slug.current}`
    return `/news/${content.slug.current}`
  }

  return (
    <motion.article
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 dark:hover:shadow-purple-500/30 transition-all border border-gray-200 dark:border-gray-700"
    >
      {/* Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-pink-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:via-pink-500/5 group-hover:to-purple-500/5 transition-all duration-300 pointer-events-none z-10" />

      {/* Image */}
      <Link href={getHref()} className="relative aspect-video overflow-hidden block">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-[5] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {content.featuredImage && (
          <Image
            src={urlFor(content.featuredImage).width(600).height(400).url()}
            alt={content.featuredImage.alt || content.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            priority={priority}
          />
        )}
        {content.rating && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="absolute top-3 right-3 z-10 bg-gradient-to-br from-yellow-400 to-orange-400 text-black px-3 py-1.5 rounded-full font-bold text-sm shadow-lg flex items-center gap-1"
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            {content.rating}/10
          </motion.div>
        )}

        {/* Category Badge */}
        {(content.category || content.type) && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-purple-600 dark:text-purple-400 rounded-full text-xs font-semibold shadow-lg">
              <Tag className="w-3 h-3" />
              {content.category || content.type}
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 relative z-10">
        <Link href={getHref()}>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all duration-300">
            {content.title}
          </h3>
        </Link>

        {content.excerpt && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed">
            {content.excerpt}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(content.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          {featured && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="font-semibold">Featured</span>
            </motion.div>
          )}
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
          >
            <label className="flex items-center gap-2 cursor-pointer group/toggle">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={toggleFeatured}
                  disabled={updating}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-gradient-to-r peer-checked:from-purple-600 peer-checked:to-pink-600 transition-all" />
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4 shadow-sm" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover/toggle:text-purple-600 dark:group-hover/toggle:text-purple-400 transition-colors">
                {updating ? 'Updating...' : 'Featured on Homepage'}
              </span>
            </label>
          </motion.div>
        )}
      </div>

      {/* Bottom Accent Line */}
      <div className="h-1 w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600" />
    </motion.article>
  )
}
