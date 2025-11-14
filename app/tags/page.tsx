import { client } from '@/sanity/lib/client'
import { CATEGORIES_QUERY } from '@/sanity/lib/queries'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Browse by Genre - CineReview',
  description: 'Explore movies and TV series by genre. Find action, drama, comedy, thriller, horror, and more.',
  keywords: ['movie genres', 'TV genres', 'categories', 'film categories', 'browse by genre'],
}

export default async function TagsPage() {
  const categories = await client.fetch(CATEGORIES_QUERY, {}, { next: { revalidate: 60 } })

  const genreColors: Record<string, string> = {
    Action: 'from-red-600 to-orange-600 dark:from-red-800 dark:to-orange-800',
    Drama: 'from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800',
    Comedy: 'from-yellow-500 to-orange-500 dark:from-yellow-700 dark:to-orange-700',
    Thriller: 'from-purple-600 to-pink-600 dark:from-purple-800 dark:to-pink-800',
    Horror: 'from-gray-900 to-red-900 dark:from-gray-950 dark:to-red-950',
    Romance: 'from-pink-500 to-rose-500 dark:from-pink-700 dark:to-rose-700',
    'Science Fiction': 'from-cyan-600 to-blue-600 dark:from-cyan-800 dark:to-blue-800',
    Fantasy: 'from-purple-500 to-indigo-500 dark:from-purple-700 dark:to-indigo-700',
    Animation: 'from-green-500 to-teal-500 dark:from-green-700 dark:to-teal-700',
    Documentary: 'from-amber-600 to-yellow-600 dark:from-amber-800 dark:to-yellow-800',
    Adventure: 'from-emerald-600 to-green-600 dark:from-emerald-800 dark:to-green-800',
    Crime: 'from-slate-700 to-zinc-900 dark:from-slate-900 dark:to-zinc-950',
    Mystery: 'from-indigo-700 to-purple-900 dark:from-indigo-900 dark:to-purple-950',
    'Sci-Fi': 'from-cyan-600 to-blue-600 dark:from-cyan-800 dark:to-blue-800',
  }

  const getGradient = (title: string) => {
    return genreColors[title] || 'from-purple-600 to-pink-600 dark:from-purple-800 dark:to-pink-800'
  }

  const genreIcons: Record<string, string> = {
    Action: 'M13 10V3L4 14h7v7l9-11h-7z',
    Drama: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z',
    Comedy: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    Thriller: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    Horror: 'M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7',
    Romance: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z',
    'Science Fiction': 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    Fantasy: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
    Animation: 'M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z',
    Documentary: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    Adventure: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    Crime: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
    Mystery: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  }

  const getIcon = (title: string) => {
    return genreIcons[title] || genreIcons['Drama']
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      {/* Header Section */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 dark:from-purple-950 dark:via-purple-900 dark:to-pink-950 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-[family-name:var(--font-playfair)]">
            Browse by Genre
          </h1>
          <p className="text-lg md:text-xl text-purple-100 dark:text-purple-200 max-w-3xl mx-auto">
            Explore our extensive collection of movies and TV series across all your favorite genres.
            From action-packed thrillers to heartwarming romances, find exactly what you're looking for.
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {categories && categories.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category: any) => (
                <Link
                  href={`/genre/${category.slug.current}`}
                  key={category._id}
                  className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className={`bg-gradient-to-br ${getGradient(category.title)} p-8 md:p-10 text-white min-h-[200px] flex flex-col justify-between`}>
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)',
                        backgroundSize: '32px 32px'
                      }}></div>
                    </div>

                    <div className="relative z-10">
                      {/* Icon */}
                      <div className="mb-4">
                        <svg
                          className="w-12 h-12 opacity-90 group-hover:scale-110 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d={getIcon(category.title)} />
                        </svg>
                      </div>

                      {/* Title */}
                      <h2 className="text-2xl md:text-3xl font-bold mb-2 group-hover:scale-105 transition-transform">
                        {category.title}
                      </h2>

                      {/* Description */}
                      {category.description && (
                        <p className="text-sm text-white/90 mb-4 line-clamp-2">
                          {category.description}
                        </p>
                      )}

                      {/* Count */}
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                        </svg>
                        <span>{category.movieCount} {category.movieCount === 1 ? 'title' : 'titles'}</span>
                      </div>
                    </div>

                    {/* Arrow Icon */}
                    <div className="absolute bottom-6 right-6">
                      <svg
                        className="w-8 h-8 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Stats Section */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg">
                <div className="text-4xl md:text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {categories.length}
                </div>
                <div className="text-zinc-600 dark:text-zinc-400 font-medium">Genres Available</div>
              </div>

              <div className="text-center p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg">
                <div className="text-4xl md:text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {categories.reduce((sum: number, cat: any) => sum + cat.movieCount, 0)}
                </div>
                <div className="text-zinc-600 dark:text-zinc-400 font-medium">Total Titles</div>
              </div>

              <div className="text-center p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-lg">
                <div className="text-4xl md:text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {Math.round(categories.reduce((sum: number, cat: any) => sum + cat.movieCount, 0) / categories.length)}
                </div>
                <div className="text-zinc-600 dark:text-zinc-400 font-medium">Avg. per Genre</div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <svg className="w-20 h-20 mx-auto text-zinc-300 dark:text-zinc-700 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">No Genres Available</h2>
            <p className="text-zinc-600 dark:text-zinc-400">Check back later for genre listings.</p>
          </div>
        )}
      </section>
    </div>
  )
}
