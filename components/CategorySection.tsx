import Link from 'next/link'
import Image from 'next/image'
import { NewsArticle, Category } from '@/lib/types'
import { urlFor } from '@/lib/sanity'
import { ArrowRightIcon, ClockIcon } from '@heroicons/react/24/outline'

interface CategorySectionProps {
  category: Category
  articles: NewsArticle[]
}

export default function CategorySection({ category, articles }: CategorySectionProps) {
  if (!articles || articles.length === 0) return null

  return (
    <section className="py-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href={`/category/${category.slug.current}`}
          className="flex items-center gap-2 group"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {category.icon && <span className="mr-2">{category.icon}</span>}
            {category.title}
          </h2>
        </Link>
        <Link
          href={`/category/${category.slug.current}`}
          className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:gap-3 transition-all font-semibold text-sm"
        >
          <span>View All</span>
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>

      {/* Horizontal Scrolling Grid */}
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {articles.map((article) => {
            const imageUrl = urlFor(article.featuredImage).width(400).height(250).url()

            return (
              <article
                key={article._id}
                className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start group"
              >
                <Link href={`/news/${article.slug.current}`} className="block">
                  {/* Image */}
                  <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-3">
                    <Image
                      src={imageUrl}
                      alt={article.featuredImage.alt || article.title}
                      fill
                      sizes="320px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Category Badge */}
                    <div className="absolute top-2 left-2">
                      <span
                        className="px-2 py-1 text-xs font-bold uppercase tracking-wider rounded-sm"
                        style={{
                          backgroundColor: category.color || '#ef4444',
                          color: '#ffffff',
                        }}
                      >
                        {category.icon && `${category.icon} `}
                        {category.title}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      {article.author && (
                        <span className="font-medium">{article.author.name}</span>
                      )}
                      {article.readTime && (
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-3 w-3" />
                          <span>{article.readTime}m</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </article>
            )
          })}
        </div>

        {/* Scroll Gradient Indicators */}
        <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-gray-50 dark:from-gray-900 to-transparent pointer-events-none" />
      </div>
    </section>
  )
}
