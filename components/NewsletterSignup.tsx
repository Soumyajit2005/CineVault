'use client'

import { useState, FormEvent } from 'react'
import { EnvelopeIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')
    setMessage('')

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    // Simulate API call - replace with actual newsletter service
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setStatus('success')
      setMessage('Successfully subscribed! Check your inbox for confirmation.')
      setEmail('')

      // Reset after 5 seconds
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 5000)
    } catch (error) {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <section className="py-16 bg-gradient-to-br from-red-600 to-red-800 dark:from-red-700 dark:to-red-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/10 p-4 rounded-full">
            <EnvelopeIcon className="h-12 w-12 text-white" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Stay in the Loop
        </h2>
        <p className="text-lg text-red-100 mb-8 max-w-2xl mx-auto">
          Get the latest entertainment news, exclusive interviews, and in-depth reviews delivered straight to your inbox. Join thousands of fellow movie and TV enthusiasts!
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              disabled={status === 'loading'}
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>

          {/* Status Messages */}
          {status === 'success' && (
            <div className="mt-4 flex items-center justify-center gap-2 text-white bg-green-500/20 py-2 px-4 rounded-lg">
              <CheckCircleIcon className="h-5 w-5" />
              <p className="text-sm">{message}</p>
            </div>
          )}

          {status === 'error' && (
            <div className="mt-4 flex items-center justify-center gap-2 text-white bg-red-900/50 py-2 px-4 rounded-lg">
              <ExclamationCircleIcon className="h-5 w-5" />
              <p className="text-sm">{message}</p>
            </div>
          )}

          {/* Privacy Note */}
          <p className="mt-4 text-xs text-red-100/80">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>
      </div>
    </section>
  )
}
