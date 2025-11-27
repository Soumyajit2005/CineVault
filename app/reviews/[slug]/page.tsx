import { client } from '@/sanity/lib/client'
import { REVIEW_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import SocialShare from '@/components/SocialShare'
import RelatedMovies from '@/components/RelatedMovies'
import NewsletterSignup from '@/components/NewsletterSignup'
import CommentSection from '@/components/CommentSection'
import FavoriteButton from '@/components/FavoriteButton'
import { generateMovieSchema, generateReviewSchema } from '@/lib/schema-markup'

async function getReview(slug: string) {
  const review = await client.fetch(REVIEW_QUERY, { slug }, { next: { revalidate: 60 } })
  return review
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const review = await getReview(slug)

  if (!review) {
    return {
      title: 'Review Not Found',
    }
  }

  const description = review.metaDescription || review.verdict?.substring(0, 155) || `Read our review of ${review.movie?.title}. Rating: ${review.rating}/10.`

  return {
    title: `${review.title} - ${review.movie?.title} Review | CineReview`,
    description,
    keywords: [
      review.movie?.title,
      'movie review',
      'film review',
      review.movie?.director,
      ...(review.movie?.categories?.map((c: any) => c.title) || []),
    ].filter(Boolean),
    openGraph: {
      title: review.title,
      description,
      type: 'article',
      publishedTime: review.publishedAt,
      modifiedTime: review.updatedAt || review.publishedAt,
      images: review.movie?.poster ? [urlFor(review.movie.poster)?.width(1200).height(630).url() || ''] : [],
      authors: review.author?.name ? [review.author.name] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: review.title,
      description,
      images: review.movie?.poster ? [urlFor(review.movie.poster)?.width(1200).height(630).url() || ''] : [],
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
            alt={value.alt || 'Review image'}
            width={800}
            height={450}
            className="w-full h-auto object-cover"
          />
          {value.caption && (
            <figcaption className="text-sm text-center text-zinc-600 dark:text-zinc-400 mt-3 px-4 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
  },
  block: {
    h2: ({ children }: any) => (
      <h2 className="text-3xl font-bold mt-10 mb-4 text-zinc-900 dark:text-white font-[family-name:var(--font-playfair)]">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-2xl font-bold mt-8 mb-3 text-zinc-900 dark:text-white font-[family-name:var(--font-playfair)]">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-xl font-semibold mt-6 mb-2 text-zinc-900 dark:text-white">
        {children}
      </h4>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-purple-600 dark:border-purple-400 pl-6 my-6 italic text-zinc-700 dark:text-zinc-300 text-lg">
        {children}
      </blockquote>
    ),
    normal: ({ children }: any) => (
      <p className="mb-4 text-zinc-700 dark:text-zinc-300 leading-relaxed text-lg">
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
        className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 underline decoration-2 underline-offset-2 font-medium"
      >
        {children}
      </a>
    ),
    strong: ({ children }: any) => (
      <strong className="font-bold text-zinc-900 dark:text-white">
        {children}
      </strong>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-inside space-y-2 my-4 text-zinc-700 dark:text-zinc-300">
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-inside space-y-2 my-4 text-zinc-700 dark:text-zinc-300">
        {children}
      </ol>
    ),
  },
}

export default async function ReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const review = await getReview(slug)

  if (!review) {
    notFound()
  }

  // Generate schema markup
  const reviewSchema = generateReviewSchema(review, review.movie)
  const movieSchema = generateMovieSchema(review.movie)

  return (
    <>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(movieSchema) }}
      />

      <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section with Backdrop */}
      {review.movie?.backdrop && (
        <div className="relative h-[500px] w-full overflow-hidden">
          <Image
            src={urlFor(review.movie.backdrop)?.width(1920).height(600).url() || ''}
            alt={review.movie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 dark:from-gray-950 via-gray-900/70 dark:via-gray-950/70 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 to-pink-900/30"></div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Main Content Card */}
          <article className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 animate-fadeIn">
            {/* Header */}
            <div className="p-8 md:p-12 border-b border-gray-200 dark:border-gray-800">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Movie Poster */}
                {review.movie?.poster && (
                  <div className="relative w-48 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl ring-4 ring-purple-500/20 hover:ring-purple-500/40 transition-all">
                    <Image
                      src={urlFor(review.movie.poster)?.width(300).height(450).url() || ''}
                      alt={review.movie.title}
                      width={300}
                      height={450}
                      className="w-full h-auto"
                    />
                  </div>
                )}

                {/* Review Header Info */}
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-playfair)] bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                    {review.title}
                  </h1>

                  {/* Freshness Indicator */}
                  {review.updatedAt && (
                    <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-full text-sm font-medium border border-green-200 dark:border-green-800">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Updated {new Date(review.updatedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                  )}

                  {/* Movie Info */}
                  <div className="mb-6">
                    <h2 className="text-2xl text-gray-700 dark:text-gray-300 mb-2">{review.movie?.title}</h2>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                      {review.movie?.director && (
                        <span>Directed by {review.movie.director}</span>
                      )}
                      {review.movie?.releaseDate && (
                        <>
                          <span>•</span>
                          <span>
                            {new Date(review.movie.releaseDate).getFullYear()}
                          </span>
                        </>
                      )}
                      {review.movie?.runtime && (
                        <>
                          <span>•</span>
                          <span>{review.movie.runtime} min</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Categories */}
                  {review.movie?.categories && review.movie.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {review.movie.categories.map((category: any) => (
                        <span
                          key={category.slug.current}
                          className="px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm"
                          style={{
                            backgroundColor: category.color || '#e5e7eb',
                            color: category.color ? '#ffffff' : '#374151',
                          }}
                        >
                          {category.title}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Rating Display */}
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                    <span className="text-3xl">★</span>
                    <div>
                      <div className="text-3xl font-bold text-gray-900">{review.rating}</div>
                      <div className="text-sm text-gray-800">out of 10</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Synopsis */}
            {review.movie?.synopsis && (
              <div className="p-8 md:p-12 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">Synopsis</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{review.movie.synopsis}</p>
              </div>
            )}

            {/* Review Content */}
            <div className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-[family-name:var(--font-playfair)] prose-a:text-purple-600 dark:prose-a:text-purple-400 hover:prose-a:text-purple-700 dark:hover:prose-a:text-purple-300">
                <PortableText value={review.content} components={portableTextComponents} />
              </div>
            </div>

            {/* Pros and Cons */}
            {((review.pros && review.pros.length > 0) || (review.cons && review.cons.length > 0)) && (
              <div className="p-8 md:p-12 bg-gray-50 dark:bg-gray-800/30 border-y border-gray-200 dark:border-gray-800">
                <div className="grid md:grid-cols-2 gap-8">
                  {review.pros && review.pros.length > 0 && (
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-800">
                      <h3 className="text-xl font-semibold mb-4 text-green-900 dark:text-green-400 flex items-center gap-2">
                        <span className="text-2xl">✓</span>
                        What Works
                      </h3>
                      <ul className="space-y-3">
                        {review.pros.map((pro: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-green-900 dark:text-green-300">
                            <span className="text-green-600 dark:text-green-500 mt-1 flex-shrink-0">●</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {review.cons && review.cons.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border-2 border-red-200 dark:border-red-800">
                      <h3 className="text-xl font-semibold mb-4 text-red-900 dark:text-red-400 flex items-center gap-2">
                        <span className="text-2xl">✗</span>
                        What Doesn't
                      </h3>
                      <ul className="space-y-3">
                        {review.cons.map((con: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-red-900 dark:text-red-300">
                            <span className="text-red-600 dark:text-red-500 mt-1 flex-shrink-0">●</span>
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Verdict */}
            <div className="p-8 md:p-12 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
              <h3 className="text-2xl font-bold mb-4 font-[family-name:var(--font-playfair)] text-gray-900 dark:text-white">
                Final Verdict
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{review.verdict}</p>
            </div>

            {/* Author Info */}
            {review.author && (
              <div className="p-8 md:p-12 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-4">
                  {review.author.image && (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-purple-500/30">
                      <Image
                        src={urlFor(review.author.image)?.width(80).height(80).url() || ''}
                        alt={review.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-lg text-gray-900 dark:text-white">{review.author.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Published on{' '}
                      {new Date(review.publishedAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </article>

          {/* Actions Bar - Social Share & Favorite */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <SocialShare
              url={`/reviews/${review.slug.current}`}
              title={review.title}
              description={review.verdict || review.excerpt}
            />
            <FavoriteButton
              contentId={review._id}
              contentType={review._type}
            />
          </div>

          {/* Comments Section */}
          <div className="mt-12">
            <CommentSection
              contentId={review._id}
              contentType={review._type}
            />
          </div>

          {/* Related Movies */}
          {review.movie?._id && review.movie?.categories && (
            <div className="mt-8">
              <RelatedMovies
                movieId={review.movie._id}
                categoryIds={review.movie.categories.map((c: any) => c._id || c._ref).filter(Boolean)}
                director={review.movie.director || ''}
              />
            </div>
          )}

          {/* Newsletter Signup */}
          <div className="mt-8">
            <NewsletterSignup />
          </div>

          {/* Back to Reviews Link */}
          <div className="mt-8 mb-12 text-center space-x-4">
            <Link
              href="/reviews"
              className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
            >
              ← Back to all reviews
            </Link>
            {review.movie && (
              <Link
                href={`/movies/${review.movie.slug.current}`}
                className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium transition-colors"
              >
                View {review.movie.title} Details →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
