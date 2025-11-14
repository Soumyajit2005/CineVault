import { client } from '@/sanity/lib/client'
import { TV_SERIES_LIST_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TV Series - CineReview',
  description: 'Browse and discover comprehensive reviews of TV series and shows across all genres.',
  keywords: ['TV series', 'TV shows', 'series reviews', 'television', 'streaming shows'],
}

export default async function TVSeriesPage() {
  const tvSeries = await client.fetch(TV_SERIES_LIST_QUERY, {}, { next: { revalidate: 60 } })

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-800 dark:to-pink-800 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-playfair)]">
            TV Series
          </h1>
          <p className="text-lg text-purple-100 dark:text-purple-200 max-w-2xl">
            Explore our collection of TV series reviews and discover your next binge-worthy show.
          </p>
        </div>
      </section>

      {/* TV Series Grid */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {tvSeries && tvSeries.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {tvSeries.map((series: any) => (
              <Link
                href={`/tv/${series.slug.current}`}
                key={series._id}
                className="group"
              >
                <div className="relative bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                  {series.poster ? (
                    <div className="relative aspect-[2/3] overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                      <Image
                        src={urlFor(series.poster).width(400).height(600).url()}
                        alt={series.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                      {series.status && (
                        <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold bg-purple-600 text-white shadow-lg">
                          {series.status.charAt(0).toUpperCase() + series.status.slice(1)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-[2/3] bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                      <svg className="w-16 h-16 text-zinc-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                    </div>
                  )}

                  <div className="p-4">
                    <h3 className="font-bold text-base mb-1 text-zinc-900 dark:text-zinc-100 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {series.title}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                      {series.firstAirDate && (
                        <span>{new Date(series.firstAirDate).getFullYear()}</span>
                      )}
                      {series.numberOfSeasons && (
                        <>
                          <span>•</span>
                          <span>{series.numberOfSeasons} {series.numberOfSeasons === 1 ? 'Season' : 'Seasons'}</span>
                        </>
                      )}
                    </div>

                    {series.avgRating && (
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-yellow-500">★</span>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{series.avgRating.toFixed(1)}/10</span>
                        <span className="text-zinc-500 dark:text-zinc-400">({series.reviewCount} {series.reviewCount === 1 ? 'review' : 'reviews'})</span>
                      </div>
                    )}

                    {series.categories && series.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {series.categories.slice(0, 2).map((cat: any) => (
                          <span
                            key={cat._id}
                            className="px-2 py-0.5 text-xs rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
                          >
                            {cat.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-zinc-300 dark:text-zinc-700 mb-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg">No TV series available yet.</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-2">Check back later for new content.</p>
          </div>
        )}
      </section>
    </div>
  )
}
