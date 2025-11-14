'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'

interface TVSeriesCardProps {
  series: {
    _id: string
    title: string
    slug: { current: string }
    poster?: any
    firstAirDate?: string
    status?: string
    numberOfSeasons?: number
    avgRating?: number
  }
  index?: number
}

export default function TVSeriesCard({ series, index = 0 }: TVSeriesCardProps) {
  const statusColors = {
    airing: 'from-green-500 to-emerald-500',
    ended: 'from-red-500 to-rose-500',
    cancelled: 'from-gray-500 to-zinc-500',
    upcoming: 'from-blue-500 to-cyan-500',
  }

  const statusGradient = series.status ? statusColors[series.status as keyof typeof statusColors] || statusColors.airing : statusColors.airing

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group"
    >
      <Link href={`/tv/${series.slug.current}`} className="block">
        <div className="relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
          {/* Poster */}
          <div className="relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-zinc-800 dark:to-zinc-900">
            {series.poster ? (
              <>
                <Image
                  src={urlFor(series.poster).width(400).height(600).url()}
                  alt={series.title}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-20 h-20 text-zinc-300 dark:text-zinc-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </div>
            )}

            {/* Status Badge */}
            {series.status && (
              <motion.div
                initial={{ x: 100 }}
                whileInView={{ x: 0 }}
                transition={{ delay: 0.2 + index * 0.05, type: 'spring', stiffness: 150 }}
                className="absolute top-3 right-3 z-10"
              >
                <div className={`bg-gradient-to-r ${statusGradient} text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm`}>
                  {series.status.charAt(0).toUpperCase() + series.status.slice(1)}
                </div>
              </motion.div>
            )}

            {/* Rating Badge */}
            {series.avgRating && (
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05, type: 'spring', stiffness: 200 }}
                className="absolute top-3 left-3 z-10"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500 blur-lg opacity-50"></div>
                  <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 text-white px-3 py-2 rounded-xl font-bold text-sm shadow-2xl flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{series.avgRating.toFixed(1)}</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Play Icon on Hover */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
            >
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border-2 border-white/40">
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </motion.div>

            {/* Seasons Badge */}
            {series.numberOfSeasons && (
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                {series.numberOfSeasons} {series.numberOfSeasons === 1 ? 'Season' : 'Seasons'}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="p-4">
            <h3 className="font-bold text-base mb-2 text-zinc-900 dark:text-zinc-100 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {series.title}
            </h3>

            <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
              {series.firstAirDate && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(series.firstAirDate).getFullYear()}
                </span>
              )}
            </div>

            {/* Progress Bar Animation */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.05 }}
              className="h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full mt-3"
            ></motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
