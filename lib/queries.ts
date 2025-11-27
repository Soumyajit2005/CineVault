// Common field fragments for reusability
const imageFields = `
  asset,
  alt,
  caption,
  hotspot
`

const categoryFields = `
  _id,
  _type,
  title,
  slug,
  type,
  color,
  icon,
  featured
`

const authorFields = `
  _id,
  _type,
  name,
  slug,
  image {
    ${imageFields}
  },
  role,
  expertise,
  featured
`

const movieBasicFields = `
  _id,
  _type,
  title,
  slug,
  poster {
    ${imageFields}
  },
  releaseDate,
  director
`

const tvSeriesBasicFields = `
  _id,
  _type,
  title,
  slug,
  poster {
    ${imageFields}
  },
  firstAirDate,
  status
`

// Breaking News Query
export const breakingNewsQuery = `
  *[_type == "newsArticle" && breaking == true] | order(publishedAt desc)[0] {
    _id,
    _type,
    title,
    slug,
    excerpt,
    publishedAt,
    category-> {
      ${categoryFields}
    }
  }
`

// Featured Article Query (for Hero Section)
export const featuredArticleQuery = `
  *[_type in ["newsArticle", "featureArticle"] && featured == true] | order(publishedAt desc)[0] {
    _id,
    _type,
    title,
    slug,
    headline,
    excerpt,
    featuredImage {
      ${imageFields}
    },
    category-> {
      ${categoryFields}
    },
    author-> {
      ${authorFields}
    },
    publishedAt,
    readTime
  }
`

// Latest News Query
export const latestNewsQuery = `
  *[_type == "newsArticle"] | order(publishedAt desc)[0...9] {
    _id,
    _type,
    title,
    slug,
    excerpt,
    featuredImage {
      ${imageFields}
    },
    category-> {
      ${categoryFields}
    },
    author-> {
      ${authorFields}
    },
    publishedAt,
    readTime,
    viewCount
  }
`

// Trending Articles Query
export const trendingArticlesQuery = `
  *[_type in ["newsArticle", "featureArticle", "review"] && trending == true] | order(viewCount desc)[0...5] {
    _id,
    _type,
    title,
    slug,
    featuredImage {
      ${imageFields}
    },
    "image": select(
      _type == "review" => movie->poster,
      featuredImage
    ),
    category-> {
      ${categoryFields}
    },
    publishedAt,
    viewCount
  }
`

// Featured Videos Query
export const featuredVideosQuery = `
  *[_type == "videoContent" && featured == true] | order(publishedAt desc)[0...6] {
    _id,
    _type,
    title,
    slug,
    thumbnail {
      ${imageFields}
    },
    duration,
    videoCategory,
    host-> {
      ${authorFields}
    },
    publishedAt,
    viewCount,
    playCount
  }
`

// Category Articles Query (parameterized)
export const categoryArticlesQuery = (categorySlug: string, limit: number = 6) => `
  *[_type == "newsArticle" && references(*[_type == "category" && slug.current == "${categorySlug}"]._id)] | order(publishedAt desc)[0...${limit}] {
    _id,
    _type,
    title,
    slug,
    excerpt,
    featuredImage {
      ${imageFields}
    },
    category-> {
      ${categoryFields}
    },
    author-> {
      ${authorFields}
    },
    publishedAt,
    readTime
  }
`

// Featured Categories Query
export const featuredCategoriesQuery = `
  *[_type == "category" && featured == true && type == "topic"] | order(order asc) {
    _id,
    title,
    slug,
    description,
    color,
    icon,
    order
  }
`

// Featured Reviews Query
export const featuredReviewsQuery = `
  *[_type == "review" && featured == true] | order(publishedAt desc)[0...4] {
    _id,
    _type,
    title,
    slug,
    contentType,
    rating,
    movie-> {
      ${movieBasicFields}
    },
    tvSeries-> {
      ${tvSeriesBasicFields}
    },
    author-> {
      ${authorFields}
    },
    verdict,
    publishedAt,
    spoilerWarning
  }
`

// Simplified Queries for New Schema Structure
export const featuredRecommendationsQuery = `
  *[_type == "recommendation" && featured == true] | order(publishedAt desc)[0...6] {
    _id,
    _type,
    title,
    slug,
    excerpt,
    featuredImage {
      ${imageFields}
    },
    category,
    tags,
    rating,
    featured,
    publishedAt,
    author
  }
`

export const allRecommendationsQuery = `
  *[_type == "recommendation"] | order(publishedAt desc) {
    _id,
    _type,
    title,
    slug,
    excerpt,
    featuredImage {
      ${imageFields}
    },
    category,
    tags,
    rating,
    featured,
    publishedAt,
    author
  }
`

export const featuredSimpleReviewsQuery = `
  *[_type == "simpleReview" && featured == true] | order(publishedAt desc)[0...6] {
    _id,
    _type,
    title,
    slug,
    excerpt,
    featuredImage {
      ${imageFields}
    },
    type,
    rating,
    pros,
    cons,
    verdict,
    tags,
    featured,
    publishedAt,
    author
  }
`

export const allSimpleReviewsQuery = `
  *[_type == "simpleReview"] | order(publishedAt desc) {
    _id,
    _type,
    title,
    slug,
    excerpt,
    featuredImage {
      ${imageFields}
    },
    type,
    rating,
    pros,
    cons,
    verdict,
    tags,
    featured,
    publishedAt,
    author
  }
`

export const featuredSimpleNewsQuery = `
  *[_type == "simpleNews" && featured == true] | order(publishedAt desc)[0...6] {
    _id,
    _type,
    title,
    slug,
    excerpt,
    featuredImage {
      ${imageFields}
    },
    category,
    tags,
    featured,
    publishedAt,
    author
  }
`

export const allSimpleNewsQuery = `
  *[_type == "simpleNews"] | order(publishedAt desc) {
    _id,
    _type,
    title,
    slug,
    excerpt,
    featuredImage {
      ${imageFields}
    },
    category,
    tags,
    featured,
    publishedAt,
    author
  }
`

// Complete Homepage Data Query
export const homepageQuery = `
{
  "breakingNews": ${breakingNewsQuery},
  "featuredArticle": ${featuredArticleQuery},
  "latestNews": ${latestNewsQuery},
  "trendingArticles": ${trendingArticlesQuery},
  "featuredVideos": ${featuredVideosQuery},
  "featuredCategories": ${featuredCategoriesQuery},
  "featuredReviews": ${featuredReviewsQuery}
}
`

// Article Detail Query
export const articleDetailQuery = (slug: string) => `
  *[_type in ["newsArticle", "featureArticle"] && slug.current == "${slug}"][0] {
    _id,
    _type,
    title,
    slug,
    headline,
    subtitle,
    excerpt,
    featuredImage {
      ${imageFields}
    },
    content,
    sections,
    photoGallery[] {
      ${imageFields}
    },
    showTableOfContents,
    category-> {
      ${categoryFields}
    },
    tags,
    author-> {
      ${authorFields},
      bio,
      social,
      socialStats
    },
    contributingAuthors[]-> {
      ${authorFields}
    },
    publishedAt,
    updatedAt,
    featured,
    trending,
    readTime,
    viewCount,
    relatedMovie-> {
      ${movieBasicFields},
      synopsis,
      trailerUrl
    },
    relatedSeries-> {
      ${tvSeriesBasicFields},
      synopsis,
      trailerUrl
    },
    seoTitle,
    seoDescription,
    socialImage {
      ${imageFields}
    }
  }
`

// Review Detail Query
export const reviewDetailQuery = (slug: string) => `
  *[_type == "review" && slug.current == "${slug}"][0] {
    _id,
    _type,
    title,
    slug,
    contentType,
    movie-> {
      ${movieBasicFields},
      backdrop {
        ${imageFields}
      },
      synopsis,
      cast,
      runtime,
      categories[]-> {
        ${categoryFields}
      },
      trailerUrl,
      streaming
    },
    tvSeries-> {
      ${tvSeriesBasicFields},
      backdrop {
        ${imageFields}
      },
      synopsis,
      cast,
      numberOfSeasons,
      episodeRuntime,
      categories[]-> {
        ${categoryFields}
      },
      trailerUrl,
      streaming
    },
    author-> {
      ${authorFields},
      bio,
      social
    },
    rating,
    content,
    pros,
    cons,
    verdict,
    featured,
    publishedAt,
    updatedAt,
    metaDescription,
    wordCount,
    spoilerWarning,
    videoReview-> {
      _id,
      title,
      slug,
      thumbnail {
        ${imageFields}
      },
      videoUrl,
      duration
    },
    scoreBreakdown
  }
`

// Video Detail Query
export const videoDetailQuery = (slug: string) => `
  *[_type == "videoContent" && slug.current == "${slug}"][0] {
    _id,
    _type,
    title,
    slug,
    thumbnail {
      ${imageFields}
    },
    videoUrl,
    videoType,
    duration,
    description,
    transcript,
    category-> {
      ${categoryFields}
    },
    videoCategory,
    tags,
    host-> {
      ${authorFields},
      bio,
      social
    },
    guests[]-> {
      ${authorFields}
    },
    relatedMovie-> {
      ${movieBasicFields}
    },
    relatedSeries-> {
      ${tvSeriesBasicFields}
    },
    publishedAt,
    featured,
    trending,
    viewCount,
    playCount,
    seoTitle,
    seoDescription
  }
`
