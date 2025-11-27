import Link from 'next/link'
import Image from 'next/image'
import { NewsArticle, Review, FeatureArticle } from '@/lib/types'
import { urlFor } from '@/lib/sanity'
import { FireIcon, EyeIcon } from '@heroicons/react/24/solid'

interface TrendingSidebarProps {
  articles: Array<NewsArticle | Review | FeatureArticle>
}

export default function TrendingSidebar({ articles }: TrendingSidebarProps) {
  if (!articles || articles.length === 0) return null

  const getArticleUrl = (article: NewsArticle | Review | FeatureArticle) => {
    switch (article._type) {
      case 'newsArticle':
        return `/news/${article.slug.current}`
      case 'featureArticle':
        return `/features/${article.slug.current}`
      case 'review':
        return `/reviews/${article.slug.current}`
      default:
        return '#'
    }
  }

  const getArticleImage = (article: NewsArticle | Review | FeatureArticle) => {
    if (article._type === 'review') {
      const review = article as Review
      if (review.movie?.poster) return review.movie.poster
      if (review.tvSeries?.poster) return review.tvSeries.poster
    }
    if ('featuredImage' in article) {
      return article.featuredImage
    }
    return null
  }

  return (
    <aside className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-20">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <FireIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Trending Now
        </h2>
      </div>

      {/* Trending List */}
      <div className="space-y-4">
        {articles.map((article, index) => {
          const image = getArticleImage(article)
          const imageUrl = image ? urlFor(image).width(120).height(80).url() : null

          return (
            <Link
              key={article._id}
              href={getArticleUrl(article)}
              className="flex gap-3 group"
            >
              {/* Number Badge */}
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 flex items-center justify-center font-bold text-lg rounded ${
                  index === 0
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white'
                    : index === 1
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                    : index === 2
                    ? 'bg-gradient-to-br from-purple-400 to-pink-400 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {index + 1}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {article.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  {'category' in article && article.category && (
                    <span
                      className="px-2 py-0.5 rounded text-white text-[10px] font-semibold uppercase"
                      style={{
                        backgroundColor: article.category.color || '#ef4444',
                      }}
                    >
                      {article.category.title}
                    </span>
                  )}
                  {'viewCount' in article && article.viewCount > 0 && (
                    <div className="flex items-center gap-1">
                      <EyeIcon className="h-3 w-3" />
                      <span>{article.viewCount.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail */}
              {imageUrl && (
                <div className="flex-shrink-0 relative w-20 h-14 rounded overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={article.title}
                    fill
                    sizes="80px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
