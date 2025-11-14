import { client } from '@/sanity/lib/client'
import { MOVIE_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import SocialShare from '@/components/SocialShare'
import RelatedMovies from '@/components/RelatedMovies'
import { generateMovieSchema } from '@/lib/schema-markup'

async function getMovie(slug: string) {
  const movie = await client.fetch(MOVIE_QUERY, { slug }, { next: { revalidate: 60 } })
  return movie
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const movie = await getMovie(params.slug)

  if (!movie) {
    return {
      title: 'Movie Not Found',
    }
  }

  const description = movie.synopsis?.substring(0, 155) || `Watch ${movie.title}${movie.director ? ` directed by ${movie.director}` : ''}. ${movie.avgRating ? `Rated ${movie.avgRating.toFixed(1)}/10` : ''}`

  return {
    title: `${movie.title} ${movie.releaseDate ? `(${new Date(movie.releaseDate).getFullYear()})` : ''} - Movie Info & Reviews | CineReview`,
    description,
    keywords: [
      movie.title,
      movie.director,
      'movie',
      'film',
      ...(movie.categories?.map((c: any) => c.title) || []),
      ...(movie.cast?.slice(0, 3) || []),
    ].filter(Boolean),
    openGraph: {
      title: movie.title,
      description,
      type: 'video.movie',
      releaseDate: movie.releaseDate,
      images: movie.poster ? [urlFor(movie.poster)?.width(1200).height(630).url() || ''] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: movie.title,
      description,
      images: movie.poster ? [urlFor(movie.poster)?.width(1200).height(630).url() || ''] : [],
    },
  }
}

export default async function MoviePage({ params }: { params: { slug: string } }) {
  const movie = await getMovie(params.slug)

  if (!movie) {
    notFound()
  }

  // Generate schema markup
  const movieSchema = generateMovieSchema(movie)

  return (
    <>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(movieSchema) }}
      />

      <div className="min-h-screen">
      {/* Hero Section with Backdrop */}
      <div className="relative h-96 md:h-[500px] w-full overflow-hidden">
        {movie.backdrop ? (
          <Image
            src={urlFor(movie.backdrop)?.width(1920).height(800).url() || ''}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
        ) : movie.poster ? (
          <div className="absolute inset-0">
            <Image
              src={urlFor(movie.poster)?.width(1920).height(800).url() || ''}
              alt={movie.title}
              fill
              className="object-cover blur-xl scale-110"
            />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-pink-900"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/70 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-48 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Movie Info Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-12">
            <div className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Poster */}
                {movie.poster && (
                  <div className="relative w-64 flex-shrink-0 rounded-xl overflow-hidden shadow-2xl">
                    <Image
                      src={urlFor(movie.poster)?.width(400).height(600).url() || ''}
                      alt={movie.title}
                      width={400}
                      height={600}
                      className="w-full h-auto"
                    />
                  </div>
                )}

                {/* Movie Details */}
                <div className="flex-1">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-playfair)]">
                    {movie.title}
                  </h1>

                  {/* Metadata */}
                  <div className="flex flex-wrap gap-3 text-zinc-600 mb-6">
                    {movie.releaseDate && (
                      <span className="flex items-center gap-1">
                        <span className="font-semibold">
                          {new Date(movie.releaseDate).getFullYear()}
                        </span>
                      </span>
                    )}
                    {movie.runtime && (
                      <>
                        <span>•</span>
                        <span>{movie.runtime} min</span>
                      </>
                    )}
                    {movie.director && (
                      <>
                        <span>•</span>
                        <span>Dir. {movie.director}</span>
                      </>
                    )}
                  </div>

                  {/* Categories */}
                  {movie.categories && movie.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {movie.categories.map((category: any) => (
                        <span
                          key={category.slug.current}
                          className="px-4 py-2 rounded-full text-sm font-medium"
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

                  {/* Average Rating */}
                  {movie.avgRating && (
                    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-4 rounded-xl shadow-lg mb-6">
                      <span className="text-4xl">★</span>
                      <div>
                        <div className="text-3xl font-bold text-zinc-900">
                          {movie.avgRating.toFixed(1)}
                        </div>
                        <div className="text-sm text-zinc-700">
                          {movie.reviewCount} {movie.reviewCount === 1 ? 'review' : 'reviews'}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Synopsis */}
                  {movie.synopsis && (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-3">Synopsis</h2>
                      <p className="text-zinc-700 leading-relaxed">{movie.synopsis}</p>
                    </div>
                  )}

                  {/* Cast */}
                  {movie.cast && movie.cast.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-3">Cast</h2>
                      <div className="flex flex-wrap gap-2">
                        {movie.cast.map((actor: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-zinc-100 rounded-full text-sm text-zinc-700"
                          >
                            {actor}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trailer Button */}
                  {movie.trailerUrl && (
                    <a
                      href={movie.trailerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                    >
                      <span>▶</span>
                      <span>Watch Trailer</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          {movie.reviews && movie.reviews.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold font-[family-name:var(--font-playfair)]">
                  Reviews ({movie.reviews.length})
                </h2>
              </div>

              <div className="space-y-6">
                {movie.reviews.map((review: any) => (
                  <Link
                    href={`/reviews/${review.slug.current}`}
                    key={review._id}
                    className="block p-6 border-2 border-zinc-200 rounded-xl hover:border-purple-300 hover:bg-purple-50/50 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-600 transition-colors">
                          {review.title}
                        </h3>
                        {review.verdict && (
                          <p className="text-zinc-600 line-clamp-2 mb-3">{review.verdict}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-zinc-500">
                          {review.author && (
                            <div className="flex items-center gap-2">
                              {review.author.image && (
                                <div className="relative w-6 h-6 rounded-full overflow-hidden">
                                  <Image
                                    src={urlFor(review.author.image)?.width(30).height(30).url() || ''}
                                    alt={review.author.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <span>{review.author.name}</span>
                            </div>
                          )}
                          <span>•</span>
                          <span>
                            {new Date(review.publishedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold flex items-center gap-1">
                          <span>★</span>
                          <span>{review.rating}/10</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* No Reviews State */}
          {(!movie.reviews || movie.reviews.length === 0) && (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center mb-12">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-2xl font-bold mb-2">No Reviews Yet</h3>
              <p className="text-zinc-600 mb-6">
                Be the first to review this movie!
              </p>
              <Link
                href="/studio"
                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Write a Review
              </Link>
            </div>
          )}

          {/* Social Sharing */}
          <div className="mt-8">
            <SocialShare
              url={`/movies/${movie.slug.current}`}
              title={movie.title}
              description={movie.synopsis || `Watch ${movie.title}`}
              placement="bottom"
            />
          </div>

          {/* Related Movies */}
          {movie.categories && movie.categories.length > 0 && (
            <div className="mt-8">
              <RelatedMovies
                movieId={movie._id}
                categoryIds={movie.categories.map((c: any) => c._id || c._ref).filter(Boolean)}
                director={movie.director || ''}
              />
            </div>
          )}

          {/* Back Link */}
          <div className="text-center mb-12 mt-8">
            <Link
              href="/movies"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
            >
              ← Back to all movies
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
