// Schema markup utilities for SEO
import { Movie, Review, Person } from '@/types'

export function generateMovieSchema(movie: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    image: movie.poster ? `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${movie.poster.asset._ref.split('-')[1]}-${movie.poster.asset._ref.split('-')[2]}.jpg` : undefined,
    datePublished: movie.releaseDate,
    director: movie.director ? {
      '@type': 'Person',
      name: movie.director,
    } : undefined,
    actor: movie.cast ? movie.cast.map((actor: string) => ({
      '@type': 'Person',
      name: actor,
    })) : undefined,
    genre: movie.categories ? movie.categories.map((cat: any) => cat.title) : undefined,
    aggregateRating: movie.avgRating ? {
      '@type': 'AggregateRating',
      ratingValue: movie.avgRating.toFixed(1),
      ratingCount: movie.reviewCount || 0,
      bestRating: '10',
      worstRating: '1',
    } : undefined,
    duration: movie.runtime ? `PT${movie.runtime}M` : undefined,
    description: movie.synopsis,
  }
}

export function generateReviewSchema(review: any, movie: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: generateMovieSchema(movie),
    author: review.author ? {
      '@type': 'Person',
      name: review.author.name,
      image: review.author.image ? `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${review.author.image.asset._ref.split('-')[1]}-${review.author.image.asset._ref.split('-')[2]}.jpg` : undefined,
    } : undefined,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: '10',
      worstRating: '1',
    },
    reviewBody: review.verdict,
    datePublished: review.publishedAt,
    publisher: {
      '@type': 'Organization',
      name: 'CineReview',
    },
  }
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://yourdomain.com${item.url}`,
    })),
  }
}

export function generateArticleSchema(article: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: article.author ? {
      '@type': 'Person',
      name: article.author.name,
    } : {
      '@type': 'Organization',
      name: 'CineReview',
    },
    publisher: {
      '@type': 'Organization',
      name: 'CineReview',
      logo: {
        '@type': 'ImageObject',
        url: 'https://yourdomain.com/logo.png',
      },
    },
  }
}
