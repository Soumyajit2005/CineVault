import { client } from '@/sanity/lib/client'
import { MOVIE_RECOMMENDATIONS_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import Link from 'next/link'
import Image from 'next/image'

async function getRecommendations() {
  const recommendations = await client.fetch(MOVIE_RECOMMENDATIONS_QUERY, {}, { next: { revalidate: 3600 } })
  return recommendations
}

export const metadata = {
  title: 'Movie Recommendation Lists - CineReview',
  description: 'Discover curated lists of movies like your favorites. Find similar films across genres, directors, and themes.',
}

export default async function ListsPage() {
  const recommendations = await getRecommendations()

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-playfair)]">
          Movie Recommendation Lists
        </h1>
        <p className="text-lg text-zinc-600 max-w-3xl mx-auto">
          Love a movie and want more like it? Explore our curated lists of similar films that capture the same magic, themes, and cinematic excellence.
        </p>
      </div>

      {/* Lists Grid */}
      {recommendations && recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec: any) => (
            <Link
              href={`/lists/movies-like-${rec.slug.current}`}
              key={rec._id}
              className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Source Movie Poster */}
              {rec.sourceMovie?.poster && (
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={urlFor(rec.sourceMovie.poster)?.width(600).height(338).url() || ''}
                    alt={rec.sourceMovie.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                  {/* Featured Badge */}
                  {rec.featured && (
                    <div className="absolute top-3 left-3 bg-yellow-400 text-black px-3 py-1 rounded-full font-semibold text-xs flex items-center gap-1">
                      <span>★</span>
                      <span>Featured</span>
                    </div>
                  )}

                  {/* Movie Count Badge */}
                  <div className="absolute top-3 right-3 bg-purple-600 text-white px-3 py-1 rounded-full font-semibold text-xs">
                    {rec.recommendationCount} Movies
                  </div>

                  {/* Source Movie Title */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white text-sm opacity-90 mb-1">
                      Based on: {rec.sourceMovie.title}
                    </p>
                  </div>
                </div>
              )}

              {/* List Info */}
              <div className="p-5">
                <h2 className="text-xl font-bold mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
                  {rec.title}
                </h2>

                {/* Introduction Preview */}
                <p className="text-sm text-zinc-600 line-clamp-3 mb-4">
                  {rec.introduction}
                </p>

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span>
                    {rec.updatedAt ? (
                      <>
                        Updated: {new Date(rec.updatedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </>
                    ) : (
                      <>
                        {new Date(rec.publishedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </>
                    )}
                  </span>
                  <span className="text-purple-600 font-medium">
                    Read List →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold mb-2">No Lists Yet</h2>
          <p className="text-zinc-600 mb-6">
            Start creating movie recommendation lists! Head to the Studio to add your first list.
          </p>
          <Link
            href="/studio"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Go to Studio
          </Link>
        </div>
      )}

      {/* SEO Content Section */}
      <div className="mt-16 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 font-[family-name:var(--font-playfair)]">
            Why Use Our Movie Recommendation Lists?
          </h2>
          <div className="prose prose-zinc max-w-none">
            <p className="text-zinc-700 leading-relaxed mb-4">
              Finding your next favorite movie can be challenging with thousands of options available across streaming platforms. Our curated "Movies Like" lists solve this problem by connecting you with films that share the qualities you loved in your favorite movies.
            </p>
            <p className="text-zinc-700 leading-relaxed mb-4">
              Each list features 15-20 carefully selected recommendations, complete with detailed explanations of why each film will resonate with fans of the source movie. We consider themes, directorial style, cinematography, narrative structure, and emotional impact to ensure every recommendation truly captures what made the original special.
            </p>
            <p className="text-zinc-700 leading-relaxed">
              Our lists are regularly updated to include new releases and hidden gems you might have missed. Whether you're looking for mind-bending thrillers like Inception, heartwarming dramas like The Shawshank Redemption, or epic adventures like The Lord of the Rings, we've got you covered.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
