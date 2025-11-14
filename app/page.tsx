import { client } from '@/sanity/lib/client'
import {
  POPULAR_MOVIES_QUERY,
  POPULAR_TV_SERIES_QUERY,
  FEATURED_CATEGORIES_QUERY,
  FEATURED_REVIEWS_QUERY
} from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import Link from 'next/link'
import Image from 'next/image'
import AnimatedSection, { FadeIn, SlideIn, StaggerContainer, StaggerItem, ScaleIn } from '@/components/AnimatedSection'
import MovieCard from '@/components/MovieCard'
import TVSeriesCard from '@/components/TVSeriesCard'
import Hero from '@/components/Hero'
import GenreCard from '@/components/GenreCard'

export default async function HomePage() {
  const [popularMovies, popularTVSeries, featuredCategories, featuredReviews] = await Promise.all([
    client.fetch(POPULAR_MOVIES_QUERY, {}, { next: { revalidate: 60 } }),
    client.fetch(POPULAR_TV_SERIES_QUERY, {}, { next: { revalidate: 60 } }),
    client.fetch(FEATURED_CATEGORIES_QUERY, {}, { next: { revalidate: 60 } }),
    client.fetch(FEATURED_REVIEWS_QUERY, {}, { next: { revalidate: 60 } }),
  ])

  return (
    <div className="w-full">
      {/* Hero Section */}
      <Hero />

      {/* Popular Movies Section */}
      {popularMovies && popularMovies.length > 0 && (
        <section className="bg-white dark:bg-zinc-950 py-16 transition-colors">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-playfair)]">
                  Popular Movies
                </h2>
                <Link
                  href="/movies"
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium flex items-center gap-2 group"
                >
                  View all
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {popularMovies.map((movie: any, index: number) => (
                <MovieCard key={movie._id} movie={movie} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular TV Series Section */}
      {popularTVSeries && popularTVSeries.length > 0 && (
        <section className="bg-zinc-50 dark:bg-zinc-900 py-16 transition-colors">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-playfair)]">
                  Popular TV Series
                </h2>
                <Link
                  href="/tv"
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium flex items-center gap-2 group"
                >
                  View all
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {popularTVSeries.map((series: any, index: number) => (
                <TVSeriesCard key={series._id} series={series} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Browse by Genre Section */}
      {featuredCategories && featuredCategories.length > 0 && (
        <section className="bg-white dark:bg-zinc-950 py-16 transition-colors">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-playfair)]">
                  Browse by Genre
                </h2>
                <Link
                  href="/tags"
                  className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium flex items-center gap-2 group"
                >
                  All genres
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </AnimatedSection>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCategories.map((category: any, index: number) => (
                <GenreCard key={category._id} category={category} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Reviews Section */}
      {featuredReviews && featuredReviews.length > 0 && (
        <section className="bg-zinc-50 dark:bg-zinc-900 py-16 transition-colors">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-playfair)]">
                Featured Reviews
              </h2>
              <Link
                href="/reviews"
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium flex items-center gap-2 group"
              >
                All reviews
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredReviews.slice(0, 3).map((review: any) => (
                <Link
                  href={`/reviews/${review.slug.current}`}
                  key={review._id}
                  className="group bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  {review.movie?.poster && (
                    <div className="relative aspect-video overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                      <Image
                        src={urlFor(review.movie.backdrop || review.movie.poster).width(600).height(400).url()}
                        alt={review.movie.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4 bg-yellow-400 text-black px-3 py-1 rounded-full font-bold text-sm flex items-center gap-1">
                        <span>★</span>
                        <span>{review.rating}/10</span>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-zinc-900 dark:text-zinc-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                      {review.title}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                      {review.movie?.title}
                    </p>
                    {review.verdict && (
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 line-clamp-3">
                        {review.verdict}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-800 dark:to-pink-800 py-16 transition-colors">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-[family-name:var(--font-playfair)]">
            Discover Curated Recommendations
          </h2>
          <p className="text-lg md:text-xl mb-8 text-purple-100 dark:text-purple-200 max-w-2xl mx-auto">
            Explore our "Movies Like X" and "Shows Like Y" articles to find your next favorite.
          </p>
          <Link
            href="/lists"
            className="inline-block px-8 py-4 bg-white text-purple-900 rounded-full font-semibold hover:bg-purple-50 transition-all hover:scale-105 shadow-lg"
          >
            Browse Recommendation Lists
          </Link>
        </div>
      </section>
    </div>
  )
}
