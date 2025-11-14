import { client } from '@/sanity/lib/client'
import { MOVIE_RECOMMENDATION_QUERY } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { generateMovieSchema, generateArticleSchema, generateBreadcrumbSchema } from '@/lib/schema-markup'

async function getRecommendation(slug: string) {
  const recommendation = await client.fetch(MOVIE_RECOMMENDATION_QUERY, { slug }, { next: { revalidate: 3600 } })
  return recommendation
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const rec = await getRecommendation(params.slug)

  if (!rec) {
    return {
      title: 'Recommendations Not Found',
    }
  }

  const description = rec.metaDescription || `Discover ${rec.recommendations?.length || 15} movies like ${rec.sourceMovie?.title}. Similar films with the same themes, style, and quality.`

  return {
    title: `${rec.title} - CineReview`,
    description,
    openGraph: {
      title: rec.title,
      description,
      images: rec.sourceMovie?.poster ? [urlFor(rec.sourceMovie.poster)?.width(1200).height(630).url() || ''] : [],
      type: 'article',
      publishedTime: rec.publishedAt,
      modifiedTime: rec.updatedAt || rec.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: rec.title,
      description,
      images: rec.sourceMovie?.poster ? [urlFor(rec.sourceMovie.poster)?.width(1200).height(630).url() || ''] : [],
    },
  }
}

export default async function MoviesLikePage({ params }: { params: { slug: string } }) {
  const rec = await getRecommendation(params.slug)

  if (!rec) {
    notFound()
  }

  // Sort recommendations by order
  const sortedRecs = rec.recommendations?.sort((a: any, b: any) => a.order - b.order) || []

  // Generate schema markup
  const articleSchema = generateArticleSchema({
    title: rec.title,
    description: rec.metaDescription || rec.introduction,
    image: rec.sourceMovie?.poster ? urlFor(rec.sourceMovie.poster)?.width(1200).height(630).url() : null,
    publishedAt: rec.publishedAt,
    updatedAt: rec.updatedAt || rec.publishedAt,
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Lists', url: '/lists' },
    { name: rec.title, url: `/lists/movies-like-${rec.slug.current}` },
  ])

  return (
    <>
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-zinc-50">
        {/* Hero Section with Source Movie */}
        {rec.sourceMovie?.backdrop && (
          <div className="relative h-80 w-full overflow-hidden">
            <Image
              src={urlFor(rec.sourceMovie.backdrop)?.width(1920).height(600).url() || ''}
              alt={rec.sourceMovie.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/70 to-transparent"></div>
            <div className="absolute bottom-8 left-0 right-0 container mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 font-[family-name:var(--font-playfair)]">
                {rec.title}
              </h1>
              {rec.updatedAt && (
                <p className="text-purple-200 text-sm">
                  Updated: {new Date(rec.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="max-w-5xl mx-auto">
            {/* Introduction */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10 mb-8">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Source Movie Poster */}
                {rec.sourceMovie?.poster && (
                  <div className="relative w-32 flex-shrink-0 rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src={urlFor(rec.sourceMovie.poster)?.width(200).height(300).url() || ''}
                      alt={rec.sourceMovie.title}
                      width={200}
                      height={300}
                      className="w-full h-auto"
                    />
                  </div>
                )}

                <div className="flex-1">
                  <p className="text-lg text-zinc-700 leading-relaxed mb-4">
                    {rec.introduction}
                  </p>
                  {rec.sourceMovie && (
                    <Link
                      href={`/movies/${rec.sourceMovie.slug.current}`}
                      className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                    >
                      View {rec.sourceMovie.title} Details →
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Table of Contents */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4 font-[family-name:var(--font-playfair)]">
                Movies in This List
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {sortedRecs.map((item: any, index: number) => (
                  <a
                    key={index}
                    href={`#movie-${index + 1}`}
                    className="text-purple-700 hover:text-purple-900 hover:underline"
                  >
                    {item.order}. {item.movie?.title} ({item.movie?.releaseDate ? new Date(item.movie.releaseDate).getFullYear() : 'N/A'})
                  </a>
                ))}
              </div>
            </div>

            {/* Movie Recommendations */}
            <div className="space-y-8">
              {sortedRecs.map((item: any, index: number) => (
                <article
                  key={index}
                  id={`movie-${item.order}`}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Movie Poster */}
                    {item.movie?.poster && (
                      <Link
                        href={`/movies/${item.movie.slug.current}`}
                        className="relative w-full md:w-48 aspect-[2/3] md:aspect-auto flex-shrink-0 overflow-hidden group"
                      >
                        <Image
                          src={urlFor(item.movie.poster)?.width(300).height(450).url() || ''}
                          alt={item.movie.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>
                    )}

                    {/* Movie Info */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-3">
                        <Link href={`/movies/${item.movie.slug.current}`}>
                          <h2 className="text-2xl md:text-3xl font-bold hover:text-purple-600 transition-colors font-[family-name:var(--font-playfair)]">
                            {item.order}. {item.movie?.title}
                          </h2>
                        </Link>
                      </div>

                      {/* Metadata */}
                      <div className="flex flex-wrap gap-3 text-sm text-zinc-600 mb-4">
                        {item.movie?.releaseDate && (
                          <span>{new Date(item.movie.releaseDate).getFullYear()}</span>
                        )}
                        {item.movie?.director && (
                          <>
                            <span>•</span>
                            <span>Dir. {item.movie.director}</span>
                          </>
                        )}
                        {item.movie?.runtime && (
                          <>
                            <span>•</span>
                            <span>{item.movie.runtime} min</span>
                          </>
                        )}
                        {item.movie?.avgRating && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500">★</span>
                              <span className="font-semibold">{item.movie.avgRating.toFixed(1)}/10</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Categories */}
                      {item.movie?.categories && item.movie.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.movie.categories.map((cat: any) => (
                            <span
                              key={cat.slug.current}
                              className="px-3 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: cat.color || '#e5e7eb',
                                color: cat.color ? '#ffffff' : '#374151',
                              }}
                            >
                              {cat.title}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Synopsis */}
                      {item.movie?.synopsis && (
                        <p className="text-zinc-700 mb-4 leading-relaxed">
                          {item.movie.synopsis}
                        </p>
                      )}

                      {/* Why It's Similar */}
                      <div className="bg-purple-50 border-l-4 border-purple-600 p-4 rounded mb-4">
                        <h3 className="font-semibold text-purple-900 mb-2">Why You'll Love This</h3>
                        <p className="text-zinc-700 leading-relaxed whitespace-pre-line">
                          {item.explanation}
                        </p>
                      </div>

                      <Link
                        href={`/movies/${item.movie.slug.current}`}
                        className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                      >
                        View Full Details →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Conclusion */}
            {rec.conclusion && (
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 mt-12 text-white">
                <h2 className="text-2xl font-bold mb-4 font-[family-name:var(--font-playfair)]">
                  Final Thoughts
                </h2>
                <p className="text-lg leading-relaxed whitespace-pre-line">
                  {rec.conclusion}
                </p>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-12 text-center space-x-4">
              <Link
                href="/lists"
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
              >
                ← Back to all lists
              </Link>
              {rec.sourceMovie && (
                <Link
                  href={`/movies/${rec.sourceMovie.slug.current}`}
                  className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                >
                  View {rec.sourceMovie.title} →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
