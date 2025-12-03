'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Recommendations', href: '/recommendations' },
  { name: 'Reviews', href: '/reviews' },
  { name: 'News', href: '/news' },
]

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { data: session } = useSession()

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        className="fixed inset-y-0 left-0 w-full max-w-sm bg-white dark:bg-gray-900 z-50 overflow-y-auto lg:hidden shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 id="mobile-menu-title" className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            EntertainHub
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close menu"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          {/* Main Links */}
          <div className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="block py-3 px-4 text-base font-semibold text-gray-900 dark:text-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 rounded-lg transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            {session ? (
              <div>
                <div className="px-4 py-2 mb-2">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {session.user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {session.user?.email}
                  </p>
                </div>
                <button
                  onClick={() => {
                    signOut({ callbackUrl: '/' })
                    onClose()
                  }}
                  className="w-full py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-left"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  signIn(undefined, { callbackUrl: '/' })
                  onClose()
                }}
                className="w-full py-3 px-4 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Sign In
              </button>
            )}
          </div>
        </nav>
      </div>
    </>
  )
}
