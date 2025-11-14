'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface GenreCardProps {
  category: {
    _id: string
    title: string
    slug: { current: string }
    movieCount: number
    tvSeriesCount: number
  }
  index: number
}

const genreGradients: Record<string, string> = {
  Action: 'from-red-600 to-orange-600 dark:from-red-800 dark:to-orange-800',
  Drama: 'from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800',
  Comedy: 'from-yellow-500 to-orange-500 dark:from-yellow-700 dark:to-orange-700',
  Thriller: 'from-purple-600 to-pink-600 dark:from-purple-800 dark:to-pink-800',
  Horror: 'from-gray-900 to-red-900 dark:from-gray-950 dark:to-red-950',
  Romance: 'from-pink-500 to-rose-500 dark:from-pink-700 dark:to-rose-700',
  'Science Fiction': 'from-cyan-600 to-blue-600 dark:from-cyan-800 dark:to-blue-800',
  'Sci-Fi': 'from-cyan-600 to-blue-600 dark:from-cyan-800 dark:to-blue-800',
  Fantasy: 'from-purple-500 to-indigo-500 dark:from-purple-700 dark:to-indigo-700',
  Animation: 'from-green-500 to-teal-500 dark:from-green-700 dark:to-teal-700',
  Documentary: 'from-amber-600 to-yellow-600 dark:from-amber-800 dark:to-yellow-800',
  Adventure: 'from-emerald-600 to-green-600 dark:from-emerald-800 dark:to-green-800',
  Crime: 'from-slate-700 to-zinc-900 dark:from-slate-900 dark:to-zinc-950',
  Mystery: 'from-indigo-700 to-purple-900 dark:from-indigo-900 dark:to-purple-950',
}

export default function GenreCard({ category, index }: GenreCardProps) {
  const gradient = genreGradients[category.title] || 'from-purple-600 to-pink-600 dark:from-purple-800 dark:to-pink-800'
  const totalCount = category.movieCount + category.tvSeriesCount

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
      whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08, type: 'spring', stiffness: 100 }}
      whileHover={{ scale: 1.05, rotateY: 5, transition: { duration: 0.2 } }}
      style={{ perspective: 1000 }}
    >
      <Link href={`/genre/${category.slug.current}`} className="block group">
        <div className={`relative p-8 rounded-3xl overflow-hidden bg-gradient-to-br ${gradient} shadow-xl hover:shadow-2xl transition-all duration-300 min-h-[180px] flex flex-col justify-between`}>
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <motion.div
              className="absolute inset-0"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)',
                backgroundSize: '32px 32px'
              }}
              animate={{
                backgroundPosition: ['0px 0px', '32px 32px'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>

          {/* Floating Orbs */}
          <motion.div
            className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 10, 0],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            <motion.h3
              className="text-2xl md:text-3xl font-bold mb-3 text-white"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {category.title}
            </motion.h3>

            <div className="flex items-center gap-2 text-white/90">
              <motion.div
                className="flex items-center gap-1.5"
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
                <span className="font-semibold text-lg">{totalCount}</span>
                <span className="text-sm">{totalCount === 1 ? 'title' : 'titles'}</span>
              </motion.div>
            </div>
          </div>

          {/* Arrow Icon */}
          <motion.div
            className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
            whileHover={{ scale: 1.2, rotate: 45 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.div>

          {/* Shine Effect on Hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </Link>
    </motion.div>
  )
}
