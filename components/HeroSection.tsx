import Link from 'next/link'
import Image from 'next/image'
import { NewsArticle, FeatureArticle } from '@/lib/types'
import { urlFor } from '@/lib/sanity'
import { ClockIcon, UserIcon } from '@heroicons/react/24/outline'

interface HeroSectionProps {
  article: NewsArticle | FeatureArticle
}

export default function HeroSection({ article }: HeroSectionProps) {
  const articleUrl = article._type === 'newsArticle' ? `/news/${article.slug.current}` : `/features/${article.slug.current}`
  const imageUrl = urlFor(article.featuredImage).width(1200).height(675).url()

  return (
    <section className="relative h-[500px] sm:h-[600px] lg:h-[700px] overflow-hidden group">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          alt={article.featuredImage.alt || article.title}
          fill
          sizes="100vw"
          className="object-cover brightness-50 group-hover:scale-105 transition-transform duration-700"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-end">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 lg:pb-20 w-full">
          <div className="max-w-3xl">
            {/* Category Badge */}
            {article.category && (
              <Link
                href={`/category/${article.category.slug.current}`}
                className="inline-block mb-4"
              >
                <span
                  className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm hover:opacity-80 transition-opacity"
                  style={{
                    backgroundColor: article.category.color || '#ef4444',
                    color: '#ffffff',
                  }}
                >
                  {article.category.icon && `${article.category.icon} `}
                  {article.category.title}
                </span>
              </Link>
            )}

            {/* Title */}
            <Link href={articleUrl}>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 leading-tight hover:text-gray-200 transition-colors">
                {article.headline || article.title}
              </h1>
            </Link>

            {/* Excerpt */}
            <p className="text-base sm:text-lg text-gray-200 mb-6 line-clamp-2">
              {article.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-6">
              {article.author && (
                <Link
                  href={`/author/${article.author.slug.current}`}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>{article.author.name}</span>
                </Link>
              )}
              {article.readTime && (
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4" />
                  <span>{article.readTime} min read</span>
                </div>
              )}
              <time dateTime={article.publishedAt}>
                {new Date(article.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>
            </div>

            {/* CTA Button */}
            <Link
              href={articleUrl}
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              Read Full Article
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
