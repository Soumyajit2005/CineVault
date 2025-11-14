'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/lib/image'

interface MovieCardProps {
  movie: {
    _id: string
    title: string
    slug: { current: string }
    poster?: any
    releaseDate?: string
    avgRating?: number
    reviewCount?: number
  }
  index?: number
}

export default function MovieCard({ movie, index = 0 }: MovieCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group"
    >
      <Link href={`/movies/${movie.slug.current}`} className="block">
        <div className="relative bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
          {/* Poster */}
          <div className="relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 dark:from-zinc-800 dark:to-zinc-900">
            {movie.poster ? (
              <>
                <Image
                  src={urlFor(movie.poster).width(400).height(600).url()}
                  alt={movie.title}
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
                  <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                </svg>
              </div>
            )}

            {/* Floating Rating Badge */}
            {movie.avgRating && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2 + index * 0.05, type: 'spring', stiffness: 200 }}
                className="absolute top-3 right-3 z-10"
              >
                <div className="relative">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-yellow-400 blur-lg opacity-50"></div>
                  <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 text-black px-3 py-2 rounded-xl font-bold text-sm shadow-2xl flex items-center gap-1.5 backdrop-blur-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>{movie.avgRating.toFixed(1)}</span>
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
          </div>

          {/* Info Section */}
          <div className="p-4">
            <h3 className="font-bold text-base mb-2 text-zinc-900 dark:text-zinc-100 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {movie.title}
            </h3>

            <div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
              {movie.releaseDate && (
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(movie.releaseDate).getFullYear()}
                </span>
              )}

              {movie.reviewCount && movie.reviewCount > 0 && (
                <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                  {movie.reviewCount}
                </span>
              )}
            </div>

            {/* Progress Bar Animation */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.05 }}
              className="h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mt-3"
            ></motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
