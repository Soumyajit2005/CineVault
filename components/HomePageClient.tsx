'use client'

import { motion } from 'framer-motion'
import { Sparkles, Film, Newspaper } from 'lucide-react'
import ContentCard from '@/components/ContentCard'
import NewsletterSignup from '@/components/NewsletterSignup'
import AddButton from '@/components/AddButton'
import Link from 'next/link'

interface ContentItem {
  _id: string
  _type: string
  title: string
  slug: { current: string }
  excerpt?: string
  featuredImage?: any
  category?: string
  tags?: string[]
  rating?: number
  featured: boolean
  publishedAt: string
  author?: string
  type?: string
  verdict?: string
}

interface HomePageClientProps {
  recommendations: ContentItem[]
  reviews: ContentItem[]
  news: ContentItem[]
  isAdmin: boolean
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export default function HomePageClient({ recommendations, reviews, news, isAdmin }: HomePageClientProps) {
  return (
    <div className="w-full">
      {/* Hero Section with Background Image */}
      <section className="relative overflow-hidden py-32 min-h-[600px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=80)',
            }}
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-gray-900/85 to-pink-900/90 dark:from-purple-950/95 dark:via-gray-950/90 dark:to-pink-950/95"></div>

          {/* Animated gradient overlay */}
          <motion.div
            animate={{
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-purple-600/30"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="inline-block mb-6"
            >
              <Sparkles className="w-16 h-16 text-yellow-300 mx-auto drop-shadow-[0_0_15px_rgba(253,224,71,0.5)]" />
            </motion.div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 drop-shadow-2xl">
              Your Entertainment Hub
            </h1>
            <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto mb-10 drop-shadow-lg">
              Discover the best recommendations, in-depth reviews, and latest news in entertainment
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                document.getElementById('content-sections')?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                })
              }}
              className="inline-flex items-center gap-2 px-10 py-5 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 font-semibold rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow-2xl hover:shadow-purple-500/50 border-2 border-white/20 cursor-pointer"
            >
              <Film className="w-6 h-6" />
              Explore Now
            </motion.button>
          </motion.div>
        </div>

        {/* Decorative bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-950 to-transparent"></div>
      </section>

      {/* Recommendations Section */}
      <motion.section
        id="content-sections"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-16 bg-white dark:bg-gray-950 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  Recommendations
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Handpicked selections just for you
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isAdmin && <AddButton type="recommendation" />}
              <motion.div whileHover={{ x: 5 }}>
                <Link
                  href="/recommendations"
                  className="flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors"
                >
                  View All
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {recommendations && recommendations.length > 0 ? (
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {recommendations.map((item, index) => (
                <motion.div key={item._id} variants={itemVariants}>
                  <ContentCard content={item} isAdmin={isAdmin} priority={index < 3} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700"
            >
              <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No recommendations available yet.
                {isAdmin && " Click 'Add Recommendation' to create one!"}
              </p>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Reviews Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-16 bg-gradient-to-br from-gray-50 to-purple-50/30 dark:from-gray-900 dark:to-purple-950/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg shadow-lg">
                <Film className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  Reviews
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Honest reviews of the latest movies and shows
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isAdmin && <AddButton type="simpleReview" />}
              <motion.div whileHover={{ x: 5 }}>
                <Link
                  href="/reviews"
                  className="flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors"
                >
                  View All
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {reviews && reviews.length > 0 ? (
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {reviews.map((item) => (
                <motion.div key={item._id} variants={itemVariants}>
                  <ContentCard content={item} isAdmin={isAdmin} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700"
            >
              <Film className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No reviews available yet.
                {isAdmin && " Click 'Add Review' to create one!"}
              </p>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* News Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="py-16 bg-white dark:bg-gray-950"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg shadow-lg">
                <Newspaper className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  News
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Stay updated with the latest entertainment news
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isAdmin && <AddButton type="simpleNews" />}
              <motion.div whileHover={{ x: 5 }}>
                <Link
                  href="/news"
                  className="flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold transition-colors"
                >
                  View All
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {news && news.length > 0 ? (
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {news.map((item) => (
                <motion.div key={item._id} variants={itemVariants}>
                  <ContentCard content={item} isAdmin={isAdmin} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              variants={itemVariants}
              className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700"
            >
              <Newspaper className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No news available yet.
                {isAdmin && " Click 'Add News' to create one!"}
              </p>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Newsletter Signup */}
      <NewsletterSignup />
    </div>
  )
}
