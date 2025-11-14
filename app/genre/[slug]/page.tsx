import { client } from '@/sanity/lib/client'
import { MOVIES_BY_CATEGORY_QUERY, CATEGORIES_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

async function getCategory(slug: string) {
  const category = await client.fetch(
    `*[_type == "category" && slug.current == $slug][0]{
      _id,
      title,
      slug,
      description,
      color,
      "movieCount": count(*[_type == "movie" && references(^._id)]),
      "reviewCount": count(*[_type == "review" && movie._ref in *[_type == "movie" && references(^._id)]._id])
    }`,
    { slug },
    { next: { revalidate: 3600 } }
  )
  return category
}

async function getMovies(categoryId: string) {
  const movies = await client.fetch(
    MOVIES_BY_CATEGORY_QUERY,
    { categoryId },
    { next: { revalidate: 3600 } }
  )
  return movies
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const category = await getCategory(params.slug)

  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  const description = category.description || `Discover the best ${category.title.toLowerCase()} movies. Browse our curated collection of ${category.movieCount} films with ratings and reviews.`

  return {
    title: `Best ${category.title} Movies - CineReview`,
    description,
    openGraph: {
      title: `Best ${category.title} Movies`,
      description,
      type: 'website',
    },
  }
}

export default async function GenrePage({ params }: { params: { slug: string } }) {
  const category = await getCategory(params.slug)

  if (!category) {
    notFound()
  }

  const movies = await getMovies(category._id)

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <div
        className="py-16 md:py-24"
        style={{
          background: category.color
            ? `linear-gradient(135deg, ${category.color} 0%, ${category.color}dd 100%)`
            : 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 font-[family-name:var(--font-playfair)]">
            {category.title} Movies
          </h1>
          {category.description && (
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl">
              {category.description}
            </p>
          )}
          <div className="flex gap-6 mt-6 text-lg">
            <div>
              <span className="font-bold">{category.movieCount}</span> Movies
            </div>
            <div>
              <span className="font-bold">{category.reviewCount}</span> Reviews
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Movies Grid */}
        {movies && movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {movies.map((movie: any) => (
              <Link
                href={`/movies/${movie.slug.current}`}
                key={movie._id}
                className="group"
              >
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  {movie.poster ? (
                    <Image
                      src={urlFor(movie.poster)?.width(400).height(600).url() || ''}
                      alt={movie.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-zinc-300 to-zinc-400 flex items-center justify-center">
                      <span className="text-zinc-500 text-4xl">🎬</span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Rating Badge */}
                  {movie.avgRating && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded-md font-bold text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>★</span>
                      <span>{movie.avgRating.toFixed(1)}</span>
                    </div>
                  )}

                  {/* Movie Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-bold text-sm line-clamp-2 mb-1">{movie.title}</h3>
                    <div className="flex items-center justify-between text-xs">
                      {movie.releaseDate && (
                        <span className="opacity-90">
                          {new Date(movie.releaseDate).getFullYear()}
                        </span>
                      )}
                      {movie.reviewCount > 0 && (
                        <span className="opacity-75">
                          {movie.reviewCount} {movie.reviewCount === 1 ? 'review' : 'reviews'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mobile: Show title below */}
                <div className="mt-2 md:hidden">
                  <h3 className="font-semibold text-sm line-clamp-2">{movie.title}</h3>
                  {movie.releaseDate && (
                    <p className="text-xs text-zinc-600">
                      {new Date(movie.releaseDate).getFullYear()}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-2xl font-bold mb-2">No Movies Yet</h2>
            <p className="text-zinc-600 mb-6">
              Be the first to add a {category.title.toLowerCase()} movie!
            </p>
            <Link
              href="/studio"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
            >
              Go to Studio
            </Link>
          </div>
        )}

        {/* SEO Content */}
        {movies && movies.length > 0 && (
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 font-[family-name:var(--font-playfair)]">
                About {category.title} Movies
              </h2>
              <div className="prose prose-zinc max-w-none">
                <p className="text-zinc-700 leading-relaxed mb-4">
                  {category.description || `Explore our comprehensive collection of ${category.title.toLowerCase()} movies, featuring ${category.movieCount} carefully curated films. Each movie includes detailed information, user ratings, and professional reviews to help you find your next favorite film.`}
                </p>
                <p className="text-zinc-700 leading-relaxed mb-4">
                  Our {category.title.toLowerCase()} collection spans decades of cinema, from classic masterpieces to contemporary releases. Whether you're looking for hidden gems or blockbuster hits, you'll find expertly reviewed content with streaming availability information.
                </p>
                <p className="text-zinc-700 leading-relaxed">
                  Browse by rating, release date, or popularity to discover the perfect movie for your mood. Each film page includes comprehensive details including cast, crew, plot summaries, and where to watch online.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
