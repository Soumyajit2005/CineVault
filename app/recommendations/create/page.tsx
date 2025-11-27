'use client'

import { useState, useRef, DragEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'
import RichTextEditor from '@/components/RichTextEditor'

export default function CreateRecommendationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    coverImage: '',
    content: '',
    tags: '',
    featured: false,
  })

  const uploadImageToSanity = async (file: File) => {
    try {
      setUploadingImage(true)

      const formDataToSend = new FormData()
      formDataToSend.append('file', file)

      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formDataToSend,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload image')
      }

      const data = await response.json()
      setFormData(prev => ({ ...prev, coverImage: data.assetId }))
      setImagePreview(URL.createObjectURL(file))
    } catch (error) {
      console.error('Failed to upload image:', error)
      alert(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (PNG, JPG, GIF, etc.)')
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('Image size must be less than 10MB')
        return
      }
      uploadImageToSanity(file)
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('Please drop an image file (PNG, JPG, GIF, etc.)')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10MB')
      return
    }

    uploadImageToSanity(file)
  }

  const removeImage = () => {
    setFormData(prev => ({ ...prev, coverImage: '' }))
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const contentBlocks = [
        {
          _type: 'block',
          _key: 'content-block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              _key: 'content-span',
              text: formData.content.replace(/<[^>]*>/g, ''),
              marks: [],
            },
          ],
          markDefs: [],
        },
      ]

      const tagsList = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      const doc: any = {
        _type: 'recommendation',
        title: formData.title,
        slug: {
          _type: 'slug',
          current: formData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, ''),
        },
        excerpt: formData.excerpt,
        content: contentBlocks,
        featured: formData.featured,
        publishedAt: new Date().toISOString(),
      }

      if (formData.coverImage) {
        doc.featuredImage = {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: formData.coverImage,
          },
        }
      }

      if (tagsList.length > 0) {
        doc.tags = tagsList
      }

      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create content')
      }

      alert('Recommendation created successfully!')
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Failed to create:', error)
      alert(`Failed to create: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-purple-950 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mb-4 font-medium"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2 font-[family-name:var(--font-playfair)]">
            Add New Recommendation
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Share your favorite entertainment picks
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="p-8 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none text-lg"
                placeholder="Enter a catchy title..."
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Excerpt / Summary *
              </label>
              <textarea
                required
                rows={2}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none resize-none"
                placeholder="Brief summary (shows in cards and previews)..."
                maxLength={250}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.excerpt.length}/250 characters</p>
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cover Image (optional)
              </label>

              {!imagePreview ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => !uploadingImage && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                    uploadingImage
                      ? 'cursor-wait opacity-60'
                      : 'cursor-pointer'
                  } ${
                    isDragging
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 scale-105'
                      : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 bg-gray-50 dark:bg-gray-900/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={uploadingImage}
                  />

                  {uploadingImage ? (
                    <div className="flex flex-col items-center py-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                      <p className="mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">Uploading image...</p>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Please wait</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className={`p-3 rounded-full mb-3 transition-colors ${
                        isDragging
                          ? 'bg-purple-100 dark:bg-purple-900/40'
                          : 'bg-gray-100 dark:bg-gray-800'
                      }`}>
                        <PhotoIcon className={`h-8 w-8 transition-colors ${
                          isDragging
                            ? 'text-purple-600 dark:text-purple-400'
                            : 'text-gray-400 dark:text-gray-500'
                        }`} />
                      </div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {isDragging ? 'Drop your image here' : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden border-2 border-green-500 dark:border-green-600 shadow-sm">
                  <img
                    src={imagePreview}
                    alt="Cover preview"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-green-600 text-white text-xs font-medium px-2 py-1 rounded">
                    ✓ Uploaded
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition-colors"
                    title="Remove image"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="action, thriller, must-watch"
              />
            </div>

            {/* Content - Rich Text Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content * (Use the toolbar to format text, add images, and links)
              </label>
              <RichTextEditor
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                placeholder="Start writing your content here..."
              />
            </div>

            {/* Featured Checkbox */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 block">
                    Feature on Homepage
                  </span>
                  <span className="text-xs text-gray-500">
                    Show this content in the featured section
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="px-8 py-6 bg-gray-50 dark:bg-slate-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <Link
              href="/"
              className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || !formData.title || !formData.excerpt || !formData.content}
              className="flex-1 max-w-xs ml-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'Creating...' : 'Create & Publish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
