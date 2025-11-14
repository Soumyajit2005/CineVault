'use client'

import Link from 'next/link'
import { useTheme } from '@/contexts/ThemeContext'
import SearchBar from './SearchBar'
import { useState } from 'react'

export default function Header() {
  const { theme, toggleTheme, mounted } = useTheme()
  const [showSharePopup, setShowSharePopup] = useState(false)
  const [copied, setCopied] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const shareWebsite = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Movie Review Blog',
          text: 'Check out this amazing movie and TV series review website!',
          url: window.location.origin,
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      setShowSharePopup(true)
    }
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setShowSharePopup(false)
      }, 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const navigationItems = [
    { name: 'Movies', href: '/movies' },
    { name: 'TV Shows', href: '/tv' },
    { name: 'Tags', href: '/tags' },
    { name: 'Reviews', href: '/reviews' },
    { name: 'Contact', href: '/contact' },
    { name: 'Studio', href: '/studio' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between gap-4 py-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </div>
              <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                CineReview
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden lg:block">
            <SearchBar />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {theme === 'light' ? (
                  <svg className="w-5 h-5 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>
            )}

            {/* Share Website Button */}
            <div className="relative">
              <button
                onClick={shareWebsite}
                className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Share website"
              >
                <svg className="w-5 h-5 text-zinc-700 dark:text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>

              {/* Share Popup */}
              {showSharePopup && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-800 rounded-lg shadow-2xl border border-zinc-200 dark:border-zinc-700 p-4 z-50">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">Share CineReview</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={typeof window !== 'undefined' ? window.location.origin : ''}
                      readOnly
                      className="flex-1 px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-600 rounded text-zinc-600 dark:text-zinc-400"
                    />
                    <button
                      onClick={copyLink}
                      className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-medium transition-colors"
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <button
                    onClick={() => setShowSharePopup(false)}
                    className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6 text-zinc-700 dark:text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-4">
          <SearchBar />
        </div>

        {/* Navigation */}
        <nav className="hidden lg:block border-t border-zinc-200 dark:border-zinc-800">
          <ul className="flex items-center justify-center gap-1">
            {navigationItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="block px-4 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden border-t border-zinc-200 dark:border-zinc-800 py-2">
            <ul className="space-y-1">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  )
}
