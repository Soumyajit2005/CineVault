import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import CommentSection from '@/components/CommentSection'
import FavoriteButton from '@/components/FavoriteButton'
import SocialShare from '@/components/SocialShare'
import { groq } from 'next-sanity'

const RECOMMENDATION_QUERY = groq`
  *[_type == "recommendation" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    excerpt,
    content,
    rating,
    featured,
    featuredImage,
    tags,
    publishedAt
  }
`

async function getRecommendation(slug: string) {
  const recommendation = await client.fetch(RECOMMENDATION_QUERY, { slug }, { next: { revalidate: 60 } })
  return recommendation
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const recommendation = await getRecommendation(slug)

  if (!recommendation) {
    return {
      title: 'Recommendation Not Found',
    }
  }

  return {
    title: `${recommendation.title} | CineReview`,
    description: recommendation.excerpt,
    openGraph: {
      title: recommendation.title,
      description: recommendation.excerpt,
      type: 'article',
      publishedTime: recommendation.publishedAt,
      images: recommendation.featuredImage ? [urlFor(recommendation.featuredImage)?.width(1200).height(630).url() || ''] : [],
    },
  }
}

const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset) {
        return null
      }
      return (
        <figure className="my-8 rounded-xl overflow-hidden shadow-lg">
          <Image
            src={urlFor(value).width(800).height(450).url()}
            alt={value.alt || 'Content image'}
            width={800}
            height={450}
            className="w-full h-auto object-cover"
          />
          {value.caption && (
            <figcaption className="text-sm text-center text-gray-600 dark:text-gray-400 mt-2 px-4 italic">
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
      <blockquote className="border-l-4 border-purple-600 dark:border-purple-400 pl-6 my-6 italic text-gray-700 dark:text-gray-300 text-lg">
        {children}
      </blockquote>
    ),
    normal: ({ children }: any) => (
      <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
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
        className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 underline decoration-2 underline-offset-2"
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

export default async function RecommendationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const recommendation = await getRecommendation(slug)

  if (!recommendation) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
          {/* Featured Image */}
          {recommendation.featuredImage && (
            <div className="relative w-full h-[500px] overflow-hidden">
              <Image
                src={urlFor(recommendation.featuredImage).width(1200).height(600).url()}
                alt={recommendation.featuredImage.alt || recommendation.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

              {/* Rating Badge on Image */}
              {recommendation.rating && (
                <div className="absolute bottom-6 left-6">
                  <div className="inline-flex items-center gap-2 bg-yellow-400 px-5 py-3 rounded-xl shadow-xl">
                    <span className="text-2xl">★</span>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{recommendation.rating}</div>
                      <div className="text-xs font-medium text-gray-700">out of 10</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="p-8 md:p-12">
            {/* Header */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-semibold">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Recommendation
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  {new Date(recommendation.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight font-[family-name:var(--font-playfair)]">
                {recommendation.title}
              </h1>

              {recommendation.excerpt && (
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed border-l-4 border-purple-500 pl-6 py-2">
                  {recommendation.excerpt}
                </p>
              )}

              {/* Tags */}
              {recommendation.tags && recommendation.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6">
                  {recommendation.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium shadow-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <PortableText value={recommendation.content} components={portableTextComponents} />
            </div>
          </div>
        </article>

        {/* Actions Bar */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <SocialShare
            url={`/recommendations/${recommendation.slug.current}`}
            title={recommendation.title}
            description={recommendation.excerpt}
          />
          <FavoriteButton
            contentId={recommendation._id}
            contentType={recommendation._type}
          />
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <CommentSection
            contentId={recommendation._id}
            contentType={recommendation._type}
          />
        </div>

        {/* Back Link */}
        <div className="mt-8 mb-12 text-center">
          <Link
            href="/recommendations"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
          >
            ← Back to all recommendations
          </Link>
        </div>
      </div>
    </div>
  )
}
