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
import { generateMovieSchema, generateReviewSchema } from '@/lib/schema-markup'

async function getReview(slug: string) {
  const review = await client.fetch(REVIEW_QUERY, { slug }, { next: { revalidate: 60 } })
  return review
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const review = await getReview(params.slug)

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
      return (
        <div className="my-8 rounded-xl overflow-hidden">
          <Image
            src={urlFor(value)?.width(800).height(450).url() || ''}
            alt={value.alt || 'Review image'}
            width={800}
            height={450}
            className="w-full h-auto"
          />
          {value.caption && (
            <p className="text-sm text-center text-zinc-600 mt-2 italic">{value.caption}</p>
          )}
        </div>
      )
    },
  },
  block: {
    h2: ({ children }: any) => (
      <h2 className="text-3xl font-bold mt-8 mb-4 font-[family-name:var(--font-playfair)]">
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-2xl font-bold mt-6 mb-3 font-[family-name:var(--font-playfair)]">
        {children}
      </h3>
    ),
    h4: ({ children }: any) => <h4 className="text-xl font-semibold mt-4 mb-2">{children}</h4>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-purple-600 pl-4 my-6 italic text-zinc-700">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }: any) => (
      <a
        href={value.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-purple-600 hover:text-purple-700 underline"
      >
        {children}
      </a>
    ),
  },
}

export default async function ReviewPage({ params }: { params: { slug: string } }) {
  const review = await getReview(params.slug)

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

      <div className="min-h-screen">
      {/* Hero Section with Backdrop */}
      {review.movie?.backdrop && (
        <div className="relative h-96 w-full overflow-hidden">
          <Image
            src={urlFor(review.movie.backdrop)?.width(1920).height(600).url() || ''}
            alt={review.movie.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent"></div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Main Content Card */}
          <article className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-8 md:p-12 border-b border-zinc-200">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Movie Poster */}
                {review.movie?.poster && (
                  <div className="relative w-48 flex-shrink-0 rounded-xl overflow-hidden shadow-lg">
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
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-playfair)]">
                    {review.title}
                  </h1>

                  {/* Freshness Indicator */}
                  {review.updatedAt && (
                    <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Updated {new Date(review.updatedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </div>
                  )}

                  {/* Movie Info */}
                  <div className="mb-6">
                    <h2 className="text-2xl text-zinc-700 mb-2">{review.movie?.title}</h2>
                    <div className="flex flex-wrap gap-3 text-sm text-zinc-600">
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
                          className="px-3 py-1 rounded-full text-sm font-medium"
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
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-3 rounded-xl shadow-lg">
                    <span className="text-3xl">★</span>
                    <div>
                      <div className="text-3xl font-bold text-zinc-900">{review.rating}</div>
                      <div className="text-sm text-zinc-700">out of 10</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Synopsis */}
            {review.movie?.synopsis && (
              <div className="p-8 md:p-12 bg-zinc-50 border-b border-zinc-200">
                <h3 className="text-xl font-semibold mb-3">Synopsis</h3>
                <p className="text-zinc-700 leading-relaxed">{review.movie.synopsis}</p>
              </div>
            )}

            {/* Review Content */}
            <div className="p-8 md:p-12">
              <div className="prose prose-lg max-w-none prose-headings:font-[family-name:var(--font-playfair)] prose-a:text-purple-600 hover:prose-a:text-purple-700">
                <PortableText value={review.content} components={portableTextComponents} />
              </div>
            </div>

            {/* Pros and Cons */}
            {((review.pros && review.pros.length > 0) || (review.cons && review.cons.length > 0)) && (
              <div className="p-8 md:p-12 bg-zinc-50 border-y border-zinc-200">
                <div className="grid md:grid-cols-2 gap-8">
                  {review.pros && review.pros.length > 0 && (
                    <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                      <h3 className="text-xl font-semibold mb-4 text-green-900 flex items-center gap-2">
                        <span className="text-2xl">✓</span>
                        What Works
                      </h3>
                      <ul className="space-y-3">
                        {review.pros.map((pro: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-green-900">
                            <span className="text-green-600 mt-1 flex-shrink-0">●</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {review.cons && review.cons.length > 0 && (
                    <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
                      <h3 className="text-xl font-semibold mb-4 text-red-900 flex items-center gap-2">
                        <span className="text-2xl">✗</span>
                        What Doesn't
                      </h3>
                      <ul className="space-y-3">
                        {review.cons.map((con: string, i: number) => (
                          <li key={i} className="flex items-start gap-2 text-red-900">
                            <span className="text-red-600 mt-1 flex-shrink-0">●</span>
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
            <div className="p-8 md:p-12 bg-gradient-to-r from-purple-50 to-pink-50">
              <h3 className="text-2xl font-bold mb-4 font-[family-name:var(--font-playfair)]">
                Final Verdict
              </h3>
              <p className="text-lg text-zinc-700 leading-relaxed">{review.verdict}</p>
            </div>

            {/* Author Info */}
            {review.author && (
              <div className="p-8 md:p-12 border-t border-zinc-200">
                <div className="flex items-center gap-4">
                  {review.author.image && (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={urlFor(review.author.image)?.width(80).height(80).url() || ''}
                        alt={review.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-lg">{review.author.name}</p>
                    <p className="text-sm text-zinc-600">
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

          {/* Social Sharing */}
          <div className="mt-8">
            <SocialShare
              url={`/reviews/${review.slug.current}`}
              title={review.title}
              description={review.verdict}
              placement="bottom"
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
            <NewsletterSignup placement="inline" />
          </div>

          {/* Back to Reviews Link */}
          <div className="mt-8 mb-12 text-center space-x-4">
            <Link
              href="/reviews"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
            >
              ← Back to all reviews
            </Link>
            {review.movie && (
              <Link
                href={`/movies/${review.movie.slug.current}`}
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
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
