import { PortableTextBlock } from 'sanity'

// Base types
export interface Image {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
  caption?: string
  hotspot?: {
    x: number
    y: number
  }
}

export interface Slug {
  _type: 'slug'
  current: string
}

export interface Reference {
  _type: 'reference'
  _ref: string
}

// Category
export interface Category {
  _id: string
  _type: 'category'
  title: string
  slug: Slug
  description?: string
  type: 'genre' | 'topic' | 'content-type'
  parentCategory?: Reference
  color?: string
  icon?: string
  featured: boolean
  order: number
  seoTitle?: string
  seoDescription?: string
}

// Author
export interface Author {
  _id: string
  _type: 'author'
  name: string
  slug: Slug
  image?: Image
  bio?: PortableTextBlock[]
  email?: string
  social?: {
    twitter?: string
    instagram?: string
    website?: string
  }
  role: 'staff-writer' | 'senior-writer' | 'editor' | 'senior-editor' | 'contributor' | 'video-host' | 'critic'
  expertise?: string[]
  featured: boolean
  socialStats?: {
    twitterFollowers?: number
    instagramFollowers?: number
    youtubeSubscribers?: number
  }
  joinedDate?: string
  articlesPublished: number
}

// Movie
export interface Movie {
  _id: string
  _type: 'movie'
  title: string
  slug: Slug
  poster?: Image
  backdrop?: Image
  releaseDate?: string
  director?: string
  cast?: string[]
  categories?: Category[]
  synopsis?: string
  trailerUrl?: string
  runtime?: number
  boxOffice?: {
    openingWeekend?: number
    totalDomestic?: number
    worldwide?: number
  }
  streaming?: Array<{
    platform: string
    url?: string
    availableFrom?: string
  }>
  newsArticles?: NewsArticle[]
}

// TV Series
export interface TVSeries {
  _id: string
  _type: 'tvSeries'
  title: string
  slug: Slug
  poster?: Image
  backdrop?: Image
  firstAirDate?: string
  lastAirDate?: string
  status?: 'airing' | 'ended' | 'cancelled' | 'upcoming'
  creator?: string[]
  cast?: string[]
  numberOfSeasons?: number
  numberOfEpisodes?: number
  episodeRuntime?: number
  categories?: Category[]
  synopsis?: string
  trailerUrl?: string
  network?: string
  streaming?: Array<{
    platform: string
    url?: string
    availableFrom?: string
  }>
  newsArticles?: NewsArticle[]
}

// Content blocks for rich text
export interface PullQuote {
  _type: 'pullQuote'
  _key: string
  quote: string
  author?: string
}

export interface VideoEmbed {
  _type: 'videoEmbed'
  _key: string
  url: string
  caption?: string
}

// News Article
export interface NewsArticle {
  _id: string
  _type: 'newsArticle'
  title: string
  slug: Slug
  headline?: string
  excerpt: string
  featuredImage: Image
  content: Array<PortableTextBlock | Image | VideoEmbed | PullQuote>
  category: Category
  tags?: string[]
  author: Author
  publishedAt: string
  updatedAt?: string
  featured: boolean
  breaking: boolean
  trending: boolean
  readTime?: number
  viewCount: number
  relatedArticles?: NewsArticle[]
  seoTitle?: string
  seoDescription?: string
  socialImage?: Image
  relatedMovie?: Movie
  relatedSeries?: TVSeries
}

// Feature Article
export interface FeatureArticle {
  _id: string
  _type: 'featureArticle'
  title: string
  slug: Slug
  subtitle?: string
  headline?: string
  excerpt: string
  featuredImage: Image
  content: Array<PortableTextBlock | Image | VideoEmbed | PullQuote>
  sections?: Array<{
    _key: string
    sectionTitle: string
    anchorId: Slug
    content: Array<PortableTextBlock | Image | VideoEmbed | PullQuote>
  }>
  photoGallery?: Image[]
  showTableOfContents: boolean
  category: Category
  tags?: string[]
  author: Author
  contributingAuthors?: Author[]
  publishedAt: string
  updatedAt?: string
  featured: boolean
  trending: boolean
  readTime?: number
  viewCount: number
  relatedContent?: Array<NewsArticle | FeatureArticle | Review | VideoContent>
  seoTitle?: string
  seoDescription?: string
  socialImage?: Image
  relatedMovie?: Movie
  relatedSeries?: TVSeries
}

// Video Content
export interface VideoContent {
  _id: string
  _type: 'videoContent'
  title: string
  slug: Slug
  thumbnail: Image
  videoUrl: string
  videoType: 'youtube' | 'vimeo' | 'direct'
  duration?: string
  description: string
  transcript?: string
  category: Category
  videoCategory: 'review' | 'interview' | 'news' | 'feature' | 'trailer-reaction' | 'top-10' | 'explained' | 'behind-scenes'
  tags?: string[]
  host?: Author
  guests?: Author[]
  relatedMovie?: Movie
  relatedSeries?: TVSeries
  relatedContent?: Array<NewsArticle | FeatureArticle | Review | VideoContent>
  publishedAt: string
  featured: boolean
  trending: boolean
  viewCount: number
  playCount: number
  seoTitle?: string
  seoDescription?: string
}

// Review
export interface Review {
  _id: string
  _type: 'review'
  title: string
  slug: Slug
  contentType: 'movie' | 'tvSeries'
  movie?: Movie
  tvSeries?: TVSeries
  author?: Author
  rating: number
  content: Array<PortableTextBlock | Image>
  pros?: string[]
  cons?: string[]
  verdict: string
  featured: boolean
  publishedAt: string
  updatedAt?: string
  metaDescription?: string
  wordCount?: number
  spoilerWarning: boolean
  videoReview?: VideoContent
  relatedNews?: Array<NewsArticle | FeatureArticle>
  scoreBreakdown?: {
    acting?: number
    direction?: number
    story?: number
    cinematography?: number
    music?: number
  }
}

// Comment
export interface Comment {
  _id: string
  _type: 'comment'
  name: string
  email: string
  content: string
  parentArticle: Reference
  parentComment?: Reference
  approved: boolean
  spam: boolean
  publishedAt: string
  ipAddress?: string
  userAgent?: string
  likeCount: number
  replyCount: number
}

// Homepage data structure
export interface HomepageData {
  breakingNews?: NewsArticle
  featuredArticle?: NewsArticle | FeatureArticle
  latestNews: NewsArticle[]
  trendingArticles: Array<NewsArticle | Review | FeatureArticle>
  featuredVideos: VideoContent[]
  categoryArticles: Record<string, NewsArticle[]>
  featuredReviews: Review[]
}
