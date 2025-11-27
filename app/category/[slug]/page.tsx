import { client } from '@/sanity/lib/client'
import { categoryArticlesQuery } from '@/lib/queries'
import { NewsArticle, Category } from '@/lib/types'
import NewsCard from '@/components/NewsCard'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const category = await client.fetch<Category>(
    `*[_type == "category" && slug.current == "${slug}"][0]`
  )

  if (!category) {
    notFound()
  }

  const articles = await client.fetch<NewsArticle[]>(
    categoryArticlesQuery(slug, 50)
  )

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {category.icon && <span className="mr-2">{category.icon}</span>}
            {category.title}
          </h1>
          {category.description && (
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {category.description}
            </p>
          )}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <NewsCard key={article._id} article={article} />
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No articles found in this category yet.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
