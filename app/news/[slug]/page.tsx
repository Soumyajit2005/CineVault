import { client } from '@/sanity/lib/client'
import { articleDetailQuery } from '@/lib/queries'
import { NewsArticle } from '@/lib/types'
import { urlFor } from '@/lib/sanity'
import Image from 'next/image'
import Link from 'next/link'
import { ClockIcon, UserIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { PortableText } from '@portabletext/react'
import { notFound } from 'next/navigation'
import CommentSection from '@/components/CommentSection'
import FavoriteButton from '@/components/FavoriteButton'
import SocialShare from '@/components/SocialShare'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const article = await client.fetch<NewsArticle>(
    articleDetailQuery(slug)
  )

  if (!article) {
    return {
      title: 'Article Not Found',
    }
  }

  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.socialImage
        ? [urlFor(article.socialImage).width(1200).height(630).url()]
        : article.featuredImage
        ? [urlFor(article.featuredImage).width(1200).height(630).url()]
        : [],
    },
  }
}

export default async function NewsArticlePage({ params }: PageProps) {
  const { slug } = await params
  const article = await client.fetch<NewsArticle>(
    articleDetailQuery(slug)
  )

  if (!article) {
    notFound()
  }

  const publishedDate = new Date(article.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const portableTextComponents = {
    types: {
      image: ({ value }: any) => {
        if (!value?.asset) {
          return null
        }
        return (
          <figure className="my-8 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={urlFor(value).width(800).height(600).url()}
              alt={value.alt || 'Article image'}
              width={800}
              height={600}
              className="w-full h-auto object-cover"
            />
            {value.caption && (
              <figcaption className="text-sm text-center mt-3 px-4 text-gray-600 dark:text-gray-400 italic">
                {value.caption}
              </figcaption>
            )}
          </figure>
        )
      },
    },
    block: {
      h2: ({ children }: any) => (
        <h2 className="text-3xl font-bold mt-10 mb-4 text-gray-900 dark:text-white font-[family-name:var(--font-playfair)]">
          {children}
        </h2>
      ),
      h3: ({ children }: any) => (
        <h3 className="text-2xl font-bold mt-8 mb-3 text-gray-900 dark:text-white font-[family-name:var(--font-playfair)]">
          {children}
        </h3>
      ),
      h4: ({ children }: any) => (
        <h4 className="text-xl font-semibold mt-6 mb-2 text-gray-900 dark:text-white">
          {children}
        </h4>
      ),
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-red-600 dark:border-red-400 pl-6 my-6 italic text-gray-700 dark:text-gray-300 text-lg">
          {children}
        </blockquote>
      ),
      normal: ({ children }: any) => (
        <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
          {children}
        </p>
      ),
    },
    marks: {
      link: ({ children, value }: any) => (
        <a
          href={value.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline decoration-2 underline-offset-2 font-medium"
        >
          {children}
        </a>
      ),
      strong: ({ children }: any) => (
        <strong className="font-bold text-gray-900 dark:text-white">
          {children}
        </strong>
      ),
    },
    list: {
      bullet: ({ children }: any) => (
        <ul className="list-disc list-inside space-y-2 my-4 text-gray-700 dark:text-gray-300">
          {children}
        </ul>
      ),
      number: ({ children }: any) => (
        <ol className="list-decimal list-inside space-y-2 my-4 text-gray-700 dark:text-gray-300">
          {children}
        </ol>
      ),
    },
  }

  return (
    <article className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 dark:from-gray-950 dark:via-gray-900 dark:to-red-950/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Image */}
        {article.featuredImage && (
          <div className="relative aspect-video w-full mb-8 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={urlFor(article.featuredImage).width(1200).height(675).url()}
              alt={article.featuredImage.alt || article.title}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>

            {/* Badges on Image */}
            <div className="absolute top-6 left-6 flex flex-wrap items-center gap-3">
              {/* Category Badge */}
              {article.category && (
                <Link
                  href={`/category/${article.category.slug.current}`}
                  className="inline-block"
                >
                  <span
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg backdrop-blur-sm"
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

              {/* Breaking Badge */}
              {article.breaking && (
                <span className="bg-red-600 text-white px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg animate-pulse backdrop-blur-sm">
                  🔴 Breaking
                </span>
              )}
            </div>

            {article.featuredImage.caption && (
              <p className="absolute bottom-4 right-4 text-xs text-white/90 bg-black/50 px-3 py-1 rounded backdrop-blur-sm">
                {article.featuredImage.caption}
              </p>
            )}
          </div>
        )}

        {/* Article Content Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
          {/* Article Header */}
          <div className="px-8 md:px-12 pt-8 md:pt-12 pb-6 border-b border-gray-200 dark:border-gray-800">
            {/* Title */}
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight font-[family-name:var(--font-playfair)]">
              {article.headline || article.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed border-l-4 border-red-500 pl-6 py-2 mb-6">
              {article.excerpt}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              {article.author && (
                <Link
                  href={`/author/${article.author.slug.current}`}
                  className="flex items-center gap-3 hover:text-red-600 dark:hover:text-red-500 transition-colors group"
                >
                  {article.author.image && (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-red-500 transition-all">
                      <Image
                        src={urlFor(article.author.image).width(48).height(48).url()}
                        alt={article.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {article.author.name}
                    </div>
                    {article.author.role && (
                      <div className="text-xs">{article.author.role}</div>
                    )}
                  </div>
                </Link>
              )}
              <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                <CalendarIcon className="h-4 w-4" />
                <time dateTime={article.publishedAt}>{publishedDate}</time>
              </div>
              {article.readTime && (
                <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <ClockIcon className="h-4 w-4" />
                  <span>{article.readTime} min read</span>
                </div>
              )}
            </div>
          </div>

          {/* Article Content */}
          <div className="px-8 md:px-12 py-8 md:py-12">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <PortableText
                value={article.content}
                components={portableTextComponents}
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Related Topics</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tag/${tag}`}
                  className="px-4 py-2 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors border border-gray-200 dark:border-gray-700 shadow-sm"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Author Bio */}
        {article.author && article.author.bio && (
          <div className="mt-8 p-8 bg-gradient-to-br from-gray-50 to-red-50 dark:from-gray-800 dark:to-red-900/10 rounded-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-6">
              {article.author.image && (
                <div className="relative w-20 h-20 rounded-full overflow-hidden ring-4 ring-white dark:ring-gray-800 shadow-lg flex-shrink-0">
                  <Image
                    src={urlFor(article.author.image).width(80).height(80).url()}
                    alt={article.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  About {article.author.name}
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </h3>
                <div className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                  <PortableText value={article.author.bio} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions Bar - Social Share & Favorite */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <SocialShare
            url={`/news/${article.slug.current}`}
            title={article.headline || article.title}
            description={article.excerpt}
          />
          <FavoriteButton
            contentId={article._id}
            contentType={article._type}
          />
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <CommentSection
            contentId={article._id}
            contentType={article._type}
          />
        </div>
      </div>
    </article>
  )
}
