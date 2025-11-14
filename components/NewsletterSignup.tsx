'use client'

import { useState, useEffect } from 'react'

interface NewsletterSignupProps {
  placement?: 'inline' | 'popup' | 'footer'
  showAfterScroll?: boolean
}

export default function NewsletterSignup({ placement = 'inline', showAfterScroll = false }: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(!showAfterScroll)

  // Show newsletter after user scrolls 50% - use useEffect to avoid hydration mismatch
  useEffect(() => {
    if (!showAfterScroll) return

    const handleScroll = () => {
      const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      if (scrolled > 50) {
        setVisible(true)
        window.removeEventListener('scroll', handleScroll)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [showAfterScroll])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    // Simulate API call - replace with your newsletter service
    setTimeout(() => {
      if (email && email.includes('@')) {
        setStatus('success')
        setMessage('Thank you for subscribing! Check your email for confirmation.')
        setEmail('')
      } else {
        setStatus('error')
        setMessage('Please enter a valid email address.')
      }
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 5000)
    }, 1000)
  }

  if (!visible) return null

  const styles = {
    inline: {
      container: "bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white",
      title: "text-2xl md:text-3xl font-bold mb-3 font-[family-name:var(--font-playfair)]",
      description: "text-purple-100 mb-6 text-lg",
    },
    popup: {
      container: "fixed bottom-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white shadow-2xl z-50 transform transition-transform",
      title: "text-xl font-bold mb-2",
      description: "text-purple-100 mb-4 text-sm",
    },
    footer: {
      container: "bg-zinc-100 rounded-xl p-6",
      title: "text-xl font-bold mb-2 text-zinc-900",
      description: "text-zinc-600 mb-4",
    },
  }

  const currentStyle = styles[placement]

  return (
    <div className={currentStyle.container}>
      {placement === 'popup' && (
        <button
          onClick={() => setVisible(false)}
          className="absolute top-4 right-4 text-white hover:text-purple-200"
          aria-label="Close newsletter signup"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <div className={placement === 'popup' ? 'max-w-4xl mx-auto' : ''}>
        <h3 className={currentStyle.title}>
          {placement === 'inline' ? 'Join Our Community of Film Lovers' : 'Never Miss a Review'}
        </h3>
        <p className={currentStyle.description}>
          {placement === 'inline'
            ? 'Get weekly movie recommendations, exclusive reviews, and insider film news delivered straight to your inbox.'
            : 'Subscribe to get the latest reviews and recommendations'
          }
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className={`flex-1 px-4 py-3 rounded-full ${
              placement === 'footer'
                ? 'bg-white border-2 border-zinc-300 text-zinc-900 placeholder-zinc-500 focus:border-purple-600'
                : 'bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:bg-white/30'
            } focus:outline-none transition-colors`}
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className={`px-8 py-3 rounded-full font-semibold transition-all ${
              placement === 'footer'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                : 'bg-white text-purple-900 hover:bg-purple-50'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-sm ${
            status === 'success'
              ? (placement === 'footer' ? 'text-green-600' : 'text-green-200')
              : (placement === 'footer' ? 'text-red-600' : 'text-red-200')
          }`}>
            {message}
          </p>
        )}

        {placement === 'inline' && (
          <p className="mt-4 text-sm text-purple-200">
            By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        )}
      </div>
    </div>
  )
}
