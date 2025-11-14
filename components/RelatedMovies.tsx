import { client } from '@/sanity/lib/client'
import { RELATED_MOVIES_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import Link from 'next/link'
import Image from 'next/image'

interface RelatedMoviesProps {
  movieId: string
  categoryIds: string[]
  director: string
}

export default async function RelatedMovies({ movieId, categoryIds, director }: RelatedMoviesProps) {
  const relatedMovies = await client.fetch(
    RELATED_MOVIES_QUERY,
    { movieId, categoryIds, director },
    { next: { revalidate: 3600 } }
  )

  if (!relatedMovies || relatedMovies.length === 0) {
    return null
  }

  return (
    <section className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold mb-6 font-[family-name:var(--font-playfair)]">
        You Might Also Like
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {relatedMovies.map((movie: any) => (
          <Link
            href={`/movies/${movie.slug.current}`}
            key={movie._id}
            className="group"
          >
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              {movie.poster ? (
                <Image
                  src={urlFor(movie.poster)?.width(200).height(300).url() || ''}
                  alt={movie.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-zinc-300 to-zinc-400 flex items-center justify-center">
                  <span className="text-zinc-500 text-2xl">🎬</span>
                </div>
              )}

              {/* Rating Overlay */}
              {movie.avgRating && (
                <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded-md font-bold text-xs flex items-center gap-1">
                  <span>★</span>
                  <span>{movie.avgRating.toFixed(1)}</span>
                </div>
              )}

              {/* Title Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                <p className="text-white text-xs font-semibold line-clamp-2">
                  {movie.title}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
