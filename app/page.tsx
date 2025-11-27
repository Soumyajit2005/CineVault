import { client } from '@/sanity/lib/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import {
  featuredRecommendationsQuery,
  featuredSimpleReviewsQuery,
  featuredSimpleNewsQuery,
} from '@/lib/queries'
import HomePageClient from '@/components/HomePageClient'

export const revalidate = 60 // Revalidate every 60 seconds

interface ContentItem {
  _id: string
  _type: string
  title: string
  slug: { current: string }
  excerpt?: string
  featuredImage?: any
  category?: string
  tags?: string[]
  rating?: number
  featured: boolean
  publishedAt: string
  author?: string
  type?: string
  verdict?: string
}

export default async function HomePage() {
  // Get session to check if user is admin
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.isAdmin || false

  // Fetch featured content for all 3 sections
  const [recommendations, reviews, news] = await Promise.all([
    client.fetch<ContentItem[]>(featuredRecommendationsQuery),
    client.fetch<ContentItem[]>(featuredSimpleReviewsQuery),
    client.fetch<ContentItem[]>(featuredSimpleNewsQuery),
  ])

  return (
    <HomePageClient
      recommendations={recommendations}
      reviews={reviews}
      news={news}
      isAdmin={isAdmin}
    />
  )
}
