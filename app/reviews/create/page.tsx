'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeftIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function CreateReviewPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [pros, setPros] = useState<string[]>([''])
  const [cons, setCons] = useState<string[]>([''])
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    type: 'movie',
    rating: 7,
    tags: '',
    verdict: '',
    featured: false,
    content: '',
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addPro = () => setPros([...pros, ''])
  const removePro = (index: number) => setPros(pros.filter((_, i) => i !== index))
  const updatePro = (index: number, value: string) => {
    const newPros = [...pros]
    newPros[index] = value
    setPros(newPros)
  }

  const addCon = () => setCons([...cons, ''])
  const removeCon = (index: number) => setCons(cons.filter((_, i) => i !== index))
  const updateCon = (index: number, value: string) => {
    const newCons = [...cons]
    newCons[index] = value
    setCons(newCons)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formElement = e.currentTarget
      const formDataToSend = new FormData(formElement)

      // Add pros and cons as JSON
      formDataToSend.append('prosJson', JSON.stringify(pros.filter(p => p.trim())))
      formDataToSend.append('consJson', JSON.stringify(cons.filter(c => c.trim())))

      const response = await fetch('/api/content/create', {
        method: 'POST',
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error('Failed to create review')
      }

      const result = await response.json()
      router.push(`/reviews/${result.slug}`)
    } catch (error) {
      console.error('Error creating review:', error)
      alert('Failed to create review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2 font-[family-name:var(--font-playfair)]">
            Create Review
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Share your honest opinion with detailed analysis
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
          <input type="hidden" name="contentType" value="simpleReview" />

          <div className="p-8 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Enter review title"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label htmlFor="excerpt" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Excerpt * (max 200 characters)
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                required
                maxLength={200}
                rows={3}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Brief description"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {formData.excerpt.length}/200 characters
              </p>
            </div>

            {/* Featured Image */}
            <div>
              <label htmlFor="featuredImage" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Featured Image *
              </label>
              <input
                type="file"
                id="featuredImage"
                name="featuredImage"
                accept="image/*"
                required
                onChange={handleImageChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              {imagePreview && (
                <div className="mt-4 relative w-full h-64 rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </div>

            {/* Type and Rating Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Review Type *
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="movie">Movie</option>
                  <option value="tv-show">TV Show</option>
                  <option value="book">Book</option>
                  <option value="game">Game</option>
                </select>
              </div>

              {/* Rating */}
              <div>
                <label htmlFor="rating" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Rating * (1-10)
                </label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  required
                  min="1"
                  max="10"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Pros */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Pros (What Works)
              </label>
              <div className="space-y-2">
                {pros.map((pro, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={pro}
                      onChange={(e) => updatePro(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder={`Pro #${index + 1}`}
                    />
                    {pros.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePro(index)}
                        className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPro}
                  className="inline-flex items-center gap-2 px-4 py-2 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Pro
                </button>
              </div>
            </div>

            {/* Cons */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Cons (What Doesn't Work)
              </label>
              <div className="space-y-2">
                {cons.map((con, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={con}
                      onChange={(e) => updateCon(index, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder={`Con #${index + 1}`}
                    />
                    {cons.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCon(index)}
                        className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <XMarkIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCon}
                  className="inline-flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Con
                </button>
              </div>
            </div>

            {/* Verdict */}
            <div>
              <label htmlFor="verdict" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Verdict
              </label>
              <textarea
                id="verdict"
                name="verdict"
                rows={3}
                value={formData.verdict}
                onChange={(e) => setFormData({ ...formData, verdict: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Your final verdict"
              />
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="action, thriller, must-watch"
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows={12}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
                placeholder="Write your detailed review here..."
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Write in plain text or Markdown
              </p>
            </div>

            {/* Featured Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="featured" className="ml-2 text-sm text-gray-900 dark:text-white">
                Feature on homepage
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="px-8 py-6 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <Link
              href="/"
              className="px-6 py-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-semibold"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
