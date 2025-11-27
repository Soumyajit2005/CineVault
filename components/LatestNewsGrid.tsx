import Link from 'next/link'
import { NewsArticle } from '@/lib/types'
import NewsCard from './NewsCard'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

interface LatestNewsGridProps {
  articles: NewsArticle[]
}

export default function LatestNewsGrid({ articles }: LatestNewsGridProps) {
  if (!articles || articles.length === 0) return null

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Latest News
          </h2>
          <Link
            href="/news"
            className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:gap-3 transition-all font-semibold"
          >
            <span>View All</span>
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <NewsCard
              key={article._id}
              article={article}
              priority={index < 3}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
