'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

interface NavItem {
  name: string
  href: string
  dropdown?: {
    name: string
    href: string
    description?: string
  }[]
}

const navigationItems: NavItem[] = [
  {
    name: 'News',
    href: '/news',
    dropdown: [
      { name: 'All News', href: '/news', description: 'Latest entertainment news' },
      { name: 'Breaking News', href: '/news/breaking', description: 'Breaking stories' },
      { name: 'Movie News', href: '/news/movies', description: 'Latest movie updates' },
      { name: 'TV News', href: '/news/tv', description: 'TV series updates' },
    ],
  },
  {
    name: 'Features',
    href: '/features',
    dropdown: [
      { name: 'All Features', href: '/features', description: 'In-depth articles' },
      { name: 'Interviews', href: '/features/interviews', description: 'Exclusive interviews' },
      { name: 'Analysis', href: '/features/analysis', description: 'Deep dives' },
      { name: 'Lists', href: '/features/lists', description: 'Top 10s and rankings' },
    ],
  },
  {
    name: 'Reviews',
    href: '/reviews',
    dropdown: [
      { name: 'All Reviews', href: '/reviews', description: 'Latest reviews' },
      { name: 'Movie Reviews', href: '/reviews/movies', description: 'Film reviews' },
      { name: 'TV Reviews', href: '/reviews/tv', description: 'Series reviews' },
      { name: 'Scores', href: '/reviews/scores', description: 'Detailed breakdowns' },
    ],
  },
  {
    name: 'Videos',
    href: '/videos',
    dropdown: [
      { name: 'All Videos', href: '/videos', description: 'Video content' },
      { name: 'Reviews', href: '/videos/reviews', description: 'Video reviews' },
      { name: 'Interviews', href: '/videos/interviews', description: 'Video interviews' },
      { name: 'Trailers', href: '/videos/trailers', description: 'Trailer reactions' },
    ],
  },
  {
    name: 'Movies',
    href: '/movies',
  },
  {
    name: 'TV',
    href: '/tv',
  },
]

export default function MainHeader() {
  const { theme, toggleTheme, mounted } = useTheme()
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header Row */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  CineReview
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">
                  Entertainment News
                </p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigationItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.dropdown && setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                >
                  {item.name}
                </Link>

                {/* Dropdown Menu */}
                {item.dropdown && activeDropdown === item.name && (
                  <div className="absolute left-0 top-full mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2">
                    {item.dropdown.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                      >
                        <div className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-500">
                          {subItem.name}
                        </div>
                        {subItem.description && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {subItem.description}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Search"
            >
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </button>

            {/* Dark Mode Toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {theme === 'light' ? (
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
          <div className="bg-white dark:bg-gray-800 w-full max-w-2xl mx-4 rounded-lg shadow-2xl">
            <div className="p-4">
              <div className="flex items-center gap-2">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search articles, reviews, videos..."
                  className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 outline-none"
                  autoFocus
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
