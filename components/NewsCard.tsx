import Link from 'next/link'
import Image from 'next/image'
import { NewsArticle } from '@/lib/types'
import { urlFor } from '@/lib/sanity'
import { ClockIcon, EyeIcon } from '@heroicons/react/24/outline'

interface NewsCardProps {
  article: NewsArticle
  priority?: boolean
}

export default function NewsCard({ article, priority = false }: NewsCardProps) {
  const imageUrl = urlFor(article.featuredImage).width(600).height(400).url()

  return (
    <article className="group flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <Link href={`/news/${article.slug.current}`} className="relative aspect-[3/2] overflow-hidden">
        <Image
          src={imageUrl}
          alt={article.featuredImage.alt || article.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority={priority}
        />
        {/* Category Badge */}
        {article.category && (
          <div className="absolute top-3 left-3">
            <span
              className="px-2 py-1 text-xs font-bold uppercase tracking-wider rounded-sm"
              style={{
                backgroundColor: article.category.color || '#ef4444',
                color: '#ffffff',
              }}
            >
              {article.category.icon && `${article.category.icon} `}
              {article.category.title}
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Title */}
        <Link href={`/news/${article.slug.current}`}>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {article.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-1">
          {article.excerpt}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            {article.author && (
              <Link
                href={`/author/${article.author.slug.current}`}
                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors font-medium"
              >
                {article.author.name}
              </Link>
            )}
            {article.readTime && (
              <div className="flex items-center gap-1">
                <ClockIcon className="h-3 w-3" />
                <span>{article.readTime}m</span>
              </div>
            )}
          </div>
          {article.viewCount > 0 && (
            <div className="flex items-center gap-1">
              <EyeIcon className="h-3 w-3" />
              <span>{article.viewCount.toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
