import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact Us - CineReview',
  description: 'Get in touch with the CineReview team. We love hearing from movie enthusiasts!',
  keywords: ['contact', 'get in touch', 'feedback', 'movie reviews'],
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-800 dark:to-pink-800 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-[family-name:var(--font-playfair)]">
            Get in Touch
          </h1>
          <p className="text-lg md:text-xl text-purple-100 dark:text-purple-200 max-w-2xl mx-auto">
            Have questions, suggestions, or just want to chat about movies? We'd love to hear from you!
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left Column - Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-zinc-900 dark:text-zinc-100 font-[family-name:var(--font-playfair)]">
                Why Reach Out?
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                At CineReview, we value our community of film enthusiasts. Whether you have feedback,
                want to suggest a movie for review, report an issue, or collaborate with us,
                we're here to listen.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-lg hover:shadow-xl transition-all">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">Email Us</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                    For general inquiries and feedback
                  </p>
                  <a href="mailto:contact@cinereview.com" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
                    contact@cinereview.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-lg hover:shadow-xl transition-all">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">Suggestions</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                    Have a movie you'd like us to review?
                  </p>
                  <a href="mailto:suggestions@cinereview.com" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
                    suggestions@cinereview.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-lg hover:shadow-xl transition-all">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">Partnerships</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                    Interested in collaboration?
                  </p>
                  <a href="mailto:partnerships@cinereview.com" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
                    partnerships@cinereview.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-lg hover:shadow-xl transition-all">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">Contribute</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                    Want to write for CineReview?
                  </p>
                  <Link href="/studio" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
                    Visit our Studio
                  </Link>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="font-bold text-zinc-900 dark:text-zinc-100 mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800 flex items-center justify-center transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800 flex items-center justify-center transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800 flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - FAQ / Info */}
          <div>
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 dark:from-purple-800 dark:to-pink-800 rounded-2xl p-8 md:p-10 text-white shadow-2xl">
              <h2 className="text-3xl font-bold mb-6 font-[family-name:var(--font-playfair)]">
                Frequently Asked Questions
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-2">How can I submit a movie review?</h3>
                  <p className="text-purple-100 dark:text-purple-200 text-sm">
                    Visit our <Link href="/studio" className="underline hover:text-white">Studio</Link> to access
                    our content management system where you can create and publish reviews.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">Can I suggest a movie for review?</h3>
                  <p className="text-purple-100 dark:text-purple-200 text-sm">
                    Absolutely! Send your suggestions to suggestions@cinereview.com and our team
                    will consider it for future reviews.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">Do you accept guest contributors?</h3>
                  <p className="text-purple-100 dark:text-purple-200 text-sm">
                    Yes! We're always looking for passionate film enthusiasts to join our team.
                    Reach out to partnerships@cinereview.com with your writing samples.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">How often do you publish new reviews?</h3>
                  <p className="text-purple-100 dark:text-purple-200 text-sm">
                    We publish new content regularly. Follow us on social media or subscribe to our
                    newsletter to stay updated with the latest reviews and recommendations.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">Can I advertise on CineReview?</h3>
                  <p className="text-purple-100 dark:text-purple-200 text-sm">
                    For advertising inquiries, please contact partnerships@cinereview.com with details
                    about your proposal.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/20">
                <p className="text-purple-100 dark:text-purple-200 text-sm">
                  We typically respond to all inquiries within 24-48 hours. Thank you for your patience!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
