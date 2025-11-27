import { client } from '@/sanity/lib/client'
import { Author, NewsArticle } from '@/lib/types'
import { urlFor } from '@/lib/sanity'
import Image from 'next/image'
import NewsCard from '@/components/NewsCard'
import { PortableText } from '@portabletext/react'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params
  const author = await client.fetch<Author>(
    `*[_type == "author" && slug.current == "${slug}"][0] {
      ...,
      image { asset, alt }
    }`
  )

  if (!author) {
    notFound()
  }

  const articles = await client.fetch<NewsArticle[]>(
    `*[_type in ["newsArticle", "featureArticle"] && references("${author._id}")] | order(publishedAt desc) [0...20] {
      _id, _type, title, slug, excerpt, featuredImage, category->, author->, publishedAt, readTime, viewCount
    }`
  )

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Author Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {author.image && (
              <Image
                src={urlFor(author.image).width(150).height(150).url()}
                alt={author.name}
                width={150}
                height={150}
                className="rounded-full"
              />
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {author.name}
              </h1>
              {author.role && (
                <p className="text-red-600 dark:text-red-500 font-semibold mb-4">
                  {author.role}
                </p>
              )}
              {author.bio && (
                <div className="prose dark:prose-invert">
                  <PortableText value={author.bio} />
                </div>
              )}
              {author.expertise && author.expertise.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {author.expertise.map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-sm rounded-full"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Articles */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Articles by {author.name}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <NewsCard key={article._id} article={article} />
          ))}
        </div>
      </div>
    </div>
  )
}
