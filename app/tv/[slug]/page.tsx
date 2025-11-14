import { client } from '@/sanity/lib/client'
import { TV_SERIES_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import SocialShare from '@/components/SocialShare'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const series = await client.fetch(TV_SERIES_QUERY, { slug: params.slug })

  if (!series) {
    return {
      title: 'TV Series Not Found - CineReview',
    }
  }

  return {
    title: `${series.title} - TV Series - CineReview`,
    description: series.synopsis || `Explore reviews and information about ${series.title}, a ${series.status} TV series.`,
    keywords: [series.title, 'TV series', 'review', ...(series.categories?.map((c: any) => c.title) || [])],
    openGraph: {
      title: `${series.title} - CineReview`,
      description: series.synopsis,
      images: series.poster ? [urlFor(series.poster).width(1200).height(630).url()] : [],
      type: 'video.tv_show',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${series.title} - CineReview`,
      description: series.synopsis,
      images: series.poster ? [urlFor(series.poster).width(1200).height(630).url()] : [],
    },
  }
}

export default async function TVSeriesDetailPage({ params }: { params: { slug: string } }) {
  const series = await client.fetch(TV_SERIES_QUERY, { slug: params.slug }, { next: { revalidate: 60 } })

  if (!series) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">TV Series Not Found</h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">The TV series you're looking for doesn't exist.</p>
          <Link
            href="/tv"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
          >
            Browse TV Series
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      {/* Hero Section with Backdrop */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        {series.backdrop ? (
          <>
            <Image
              src={urlFor(series.backdrop).width(1920).height(1080).url()}
              alt={series.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent"></div>
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-pink-900"></div>
        )}

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto">
            <div className="flex items-end gap-6 md:gap-8">
              {/* Poster */}
              {series.poster && (
                <div className="hidden md:block flex-shrink-0 w-48 lg:w-56">
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-2xl">
                    <Image
                      src={urlFor(series.poster).width(300).height(450).url()}
                      alt={series.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Title and Info */}
              <div className="flex-1 text-white pb-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-[family-name:var(--font-playfair)]">
                  {series.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm md:text-base mb-4">
                  {series.firstAirDate && (
                    <span className="font-medium">{new Date(series.firstAirDate).getFullYear()}</span>
                  )}

                  {series.status && (
                    <span className="px-3 py-1 rounded-full bg-purple-600 text-white text-sm font-semibold">
                      {series.status.charAt(0).toUpperCase() + series.status.slice(1)}
                    </span>
                  )}

                  {series.numberOfSeasons && (
                    <span>{series.numberOfSeasons} {series.numberOfSeasons === 1 ? 'Season' : 'Seasons'}</span>
                  )}

                  {series.episodeRuntime && (
                    <span>{series.episodeRuntime} min/episode</span>
                  )}

                  {series.network && (
                    <span className="px-2 py-1 bg-white/20 rounded">{series.network}</span>
                  )}
                </div>

                {series.categories && series.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {series.categories.map((category: any) => (
                      <Link
                        key={category._id}
                        href={`/genre/${category.slug.current}`}
                        className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-sm transition-colors"
                      >
                        {category.title}
                      </Link>
                    ))}
                  </div>
                )}

                {series.avgRating && (
                  <div className="flex items-center gap-3 text-xl">
                    <div className="flex items-center gap-2 bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold">
                      <span>★</span>
                      <span>{series.avgRating.toFixed(1)}/10</span>
                    </div>
                    <span className="text-base text-zinc-300">
                      {series.reviewCount} {series.reviewCount === 1 ? 'review' : 'reviews'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Synopsis */}
            {series.synopsis && (
              <section>
                <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-playfair)]">
                  Synopsis
                </h2>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-lg">
                  {series.synopsis}
                </p>
              </section>
            )}

            {/* Trailer */}
            {series.trailerUrl && (
              <section>
                <h2 className="text-2xl font-bold mb-4 text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-playfair)]">
                  Trailer
                </h2>
                <div className="aspect-video rounded-xl overflow-hidden bg-zinc-900">
                  <iframe
                    src={series.trailerUrl.replace('watch?v=', 'embed/')}
                    title={`${series.title} Trailer`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </section>
            )}

            {/* Reviews */}
            {series.reviews && series.reviews.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-playfair)]">
                  Reviews
                </h2>
                <div className="space-y-4">
                  {series.reviews.map((review: any) => (
                    <Link
                      href={`/reviews/${review.slug.current}`}
                      key={review._id}
                      className="block p-6 bg-white dark:bg-zinc-900 rounded-xl hover:shadow-lg transition-all hover:-translate-y-1"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex items-center gap-1 bg-yellow-400 text-black px-3 py-2 rounded-lg font-bold">
                          <span>★</span>
                          <span>{review.rating}/10</span>
                        </div>

                        <div className="flex-1">
                          <h3 className="text-lg font-bold mb-2 text-zinc-900 dark:text-zinc-100 hover:text-purple-600 dark:hover:text-purple-400">
                            {review.title}
                          </h3>
                          {review.verdict && (
                            <p className="text-zinc-600 dark:text-zinc-400 line-clamp-2 mb-2">
                              {review.verdict}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-500">
                            {review.author && <span>By {review.author.name}</span>}
                            <span>•</span>
                            <span>{formatDate(review.publishedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Social Share */}
            <SocialShare
              url={`/tv/${series.slug.current}`}
              title={series.title}
              description={series.synopsis}
              placement="bottom"
            />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Series Details Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-playfair)]">
                Series Details
              </h3>

              <dl className="space-y-3 text-sm">
                {series.creator && series.creator.length > 0 && (
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400 mb-1">Created by</dt>
                    <dd className="text-zinc-900 dark:text-zinc-100 font-medium">
                      {series.creator.join(', ')}
                    </dd>
                  </div>
                )}

                {series.cast && series.cast.length > 0 && (
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400 mb-1">Main Cast</dt>
                    <dd className="text-zinc-900 dark:text-zinc-100 font-medium">
                      {series.cast.slice(0, 5).join(', ')}
                    </dd>
                  </div>
                )}

                {series.numberOfSeasons && (
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400 mb-1">Seasons</dt>
                    <dd className="text-zinc-900 dark:text-zinc-100 font-medium">
                      {series.numberOfSeasons}
                    </dd>
                  </div>
                )}

                {series.numberOfEpisodes && (
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400 mb-1">Total Episodes</dt>
                    <dd className="text-zinc-900 dark:text-zinc-100 font-medium">
                      {series.numberOfEpisodes}
                    </dd>
                  </div>
                )}

                {series.episodeRuntime && (
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400 mb-1">Episode Runtime</dt>
                    <dd className="text-zinc-900 dark:text-zinc-100 font-medium">
                      {series.episodeRuntime} minutes
                    </dd>
                  </div>
                )}

                {series.firstAirDate && (
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400 mb-1">First Aired</dt>
                    <dd className="text-zinc-900 dark:text-zinc-100 font-medium">
                      {formatDate(series.firstAirDate)}
                    </dd>
                  </div>
                )}

                {series.lastAirDate && (
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400 mb-1">Last Aired</dt>
                    <dd className="text-zinc-900 dark:text-zinc-100 font-medium">
                      {formatDate(series.lastAirDate)}
                    </dd>
                  </div>
                )}

                {series.network && (
                  <div>
                    <dt className="text-zinc-500 dark:text-zinc-400 mb-1">Network/Platform</dt>
                    <dd className="text-zinc-900 dark:text-zinc-100 font-medium">
                      {series.network}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* CTA Card */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 dark:from-purple-800 dark:to-pink-800 rounded-xl p-6 text-white shadow-lg">
              <h3 className="text-xl font-bold mb-3">Write a Review</h3>
              <p className="text-sm text-purple-100 dark:text-purple-200 mb-4">
                Share your thoughts about {series.title}
              </p>
              <Link
                href="/studio"
                className="block w-full px-4 py-3 bg-white text-purple-900 rounded-lg font-semibold hover:bg-purple-50 transition-colors text-center"
              >
                Go to Studio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
