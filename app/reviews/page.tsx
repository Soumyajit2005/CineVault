import { client } from '@/sanity/lib/client'
import { REVIEWS_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import Link from 'next/link'
import Image from 'next/image'

async function getReviews() {
  const reviews = await client.fetch(REVIEWS_QUERY, {}, { next: { revalidate: 60 } })
  return reviews
}

export const metadata = {
  title: 'All Reviews - CineReview',
  description: 'Browse all our movie reviews and ratings',
}

export default async function ReviewsPage() {
  const reviews = await getReviews()

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-playfair)]">
          All Reviews
        </h1>
        <p className="text-lg text-zinc-600">
          Explore our complete collection of movie reviews and ratings
        </p>
      </div>

      {/* Reviews Grid */}
      {reviews && reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {reviews.map((review: any) => (
            <Link
              href={`/reviews/${review.slug.current}`}
              key={review._id}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Poster Image */}
              {review.movie?.poster && (
                <div className="relative aspect-[2/3] overflow-hidden">
                  <Image
                    src={urlFor(review.movie.poster)?.width(400).height(600).url() || ''}
                    alt={review.movie.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                  {/* Rating Badge */}
                  <div className="absolute top-3 right-3 bg-yellow-400 text-black px-3 py-1 rounded-full font-bold text-sm flex items-center gap-1 shadow-lg">
                    <span>★</span>
                    <span>{review.rating}/10</span>
                  </div>

                  {/* Featured Badge */}
                  {review.featured && (
                    <div className="absolute top-3 left-3 bg-purple-600 text-white px-3 py-1 rounded-full font-semibold text-xs">
                      Featured
                    </div>
                  )}

                  {/* Movie Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <p className="text-sm font-medium opacity-90">{review.movie?.title}</p>
                  </div>
                </div>
              )}

              {/* Review Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                  {review.title}
                </h3>

                {/* Verdict Preview */}
                {review.verdict && (
                  <p className="text-sm text-zinc-600 line-clamp-2 mb-3">
                    {review.verdict}
                  </p>
                )}

                {/* Metadata */}
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <span>
                    {new Date(review.publishedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  {review.author && (
                    <span className="flex items-center gap-1">
                      {review.author.image && (
                        <div className="relative w-5 h-5 rounded-full overflow-hidden">
                          <Image
                            src={urlFor(review.author.image)?.width(20).height(20).url() || ''}
                            alt={review.author.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <span>{review.author.name}</span>
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎬</div>
          <h2 className="text-2xl font-bold mb-2">No Reviews Yet</h2>
          <p className="text-zinc-600 mb-6">
            Be the first to add a review! Head to the Studio to get started.
          </p>
          <Link
            href="/studio"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Go to Studio
          </Link>
        </div>
      )}
    </div>
  )
}
