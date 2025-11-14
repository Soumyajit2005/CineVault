import { client } from '@/sanity/lib/client'
import { MOVIES_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import Link from 'next/link'
import Image from 'next/image'

async function getMovies() {
  const movies = await client.fetch(MOVIES_QUERY, {}, { next: { revalidate: 60 } })
  return movies
}

export const metadata = {
  title: 'All Movies - CineReview',
  description: 'Browse our complete movie database',
}

export default async function MoviesPage() {
  const movies = await getMovies()

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 font-[family-name:var(--font-playfair)]">
          Movie Database
        </h1>
        <p className="text-lg text-zinc-600">
          Explore our curated collection of films from around the world
        </p>
      </div>

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
                  <>
                    <Image
                      src={urlFor(movie.poster)?.width(400).height(600).url() || ''}
                      alt={movie.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Movie Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="font-bold text-sm line-clamp-2 mb-1">{movie.title}</h3>
                      {movie.releaseDate && (
                        <p className="text-xs opacity-90">
                          {new Date(movie.releaseDate).getFullYear()}
                        </p>
                      )}
                      {movie.avgRating && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-yellow-400 text-xs">★</span>
                          <span className="text-xs font-semibold">
                            {movie.avgRating.toFixed(1)}
                          </span>
                          <span className="text-xs opacity-75">
                            ({movie.reviewCount})
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Rating Badge (visible on hover) */}
                    {movie.avgRating && (
                      <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded-md font-bold text-xs flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>★</span>
                        <span>{movie.avgRating.toFixed(1)}</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-zinc-300 to-zinc-400 flex items-center justify-center">
                    <span className="text-zinc-500 text-4xl">🎬</span>
                  </div>
                )}
              </div>

              {/* Movie Title (Always Visible on Mobile) */}
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
            Start building your movie database! Head to the Studio to add movies.
          </p>
          <Link
            href="/studio"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Go to Studio
          </Link>
        </div>
      )}

      {/* Stats Section */}
      {movies && movies.length > 0 && (
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="text-4xl font-bold mb-2">{movies.length}</div>
            <div className="text-purple-100">Total Movies</div>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white">
            <div className="text-4xl font-bold mb-2">
              {movies.filter((m: any) => m.reviewCount > 0).length}
            </div>
            <div className="text-pink-100">Reviewed Movies</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
            <div className="text-4xl font-bold mb-2">
              {movies.reduce((acc: number, m: any) => acc + (m.reviewCount || 0), 0)}
            </div>
            <div className="text-yellow-100">Total Reviews</div>
          </div>
        </div>
      )}
    </div>
  )
}
