import { groq } from 'next-sanity'

// Get all reviews
export const REVIEWS_QUERY = groq`
  *[_type == "review"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    rating,
    publishedAt,
    featured,
    verdict,
    "movie": movie->{
      title,
      slug,
      poster,
      releaseDate,
      director
    },
    "author": author->{
      name,
      image
    }
  }
`

// Get featured reviews for homepage
export const FEATURED_REVIEWS_QUERY = groq`
  *[_type == "review" && featured == true] | order(publishedAt desc)[0...6] {
    _id,
    title,
    slug,
    rating,
    publishedAt,
    verdict,
    "movie": movie->{
      title,
      slug,
      poster,
      backdrop,
      releaseDate
    },
    "author": author->{
      name,
      image
    }
  }
`

// Get single review by slug (supports both old 'review' and new 'simpleReview' types)
export const REVIEW_QUERY = groq`
  *[(_type == "review" || _type == "simpleReview") && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    rating,
    content,
    excerpt,
    featured,
    featuredImage,
    tags,
    pros,
    cons,
    verdict,
    publishedAt,
    "movie": movie->{
      title,
      slug,
      poster,
      backdrop,
      director,
      cast,
      releaseDate,
      synopsis,
      trailerUrl,
      runtime,
      "categories": categories[]->{
        title,
        slug,
        color
      }
    },
    "author": author->{
      name,
      slug,
      image,
      bio,
      social
    }
  }
`

// Get all movies
export const MOVIES_QUERY = groq`
  *[_type == "movie"] | order(releaseDate desc) {
    _id,
    title,
    slug,
    poster,
    releaseDate,
    director,
    runtime,
    "categories": categories[]->{
      title,
      slug,
      color
    },
    "avgRating": math::avg(*[_type == "review" && references(^._id)].rating),
    "reviewCount": count(*[_type == "review" && references(^._id)])
  }
`

// Get single movie by slug
export const MOVIE_QUERY = groq`
  *[_type == "movie" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    poster,
    backdrop,
    releaseDate,
    director,
    cast,
    synopsis,
    trailerUrl,
    runtime,
    "categories": categories[]->{
      title,
      slug,
      description,
      color
    },
    "reviews": *[_type == "review" && references(^._id)] | order(publishedAt desc) {
      _id,
      title,
      slug,
      rating,
      verdict,
      publishedAt,
      "author": author->{
        name,
        image
      }
    },
    "avgRating": math::avg(*[_type == "review" && references(^._id)].rating),
    "reviewCount": count(*[_type == "review" && references(^._id)])
  }
`

// Get all categories
export const CATEGORIES_QUERY = groq`
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    color,
    "movieCount": count(*[_type == "movie" && references(^._id)])
  }
`

// Get recent reviews for sidebar/widgets
export const RECENT_REVIEWS_QUERY = groq`
  *[_type == "review"] | order(publishedAt desc)[0...5] {
    _id,
    title,
    slug,
    rating,
    publishedAt,
    "movie": movie->{
      title,
      slug,
      poster
    }
  }
`

// Get all movie recommendations ("Movies Like X" articles)
export const MOVIE_RECOMMENDATIONS_QUERY = groq`
  *[_type == "movieRecommendation"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    introduction,
    publishedAt,
    updatedAt,
    featured,
    "sourceMovie": sourceMovie->{
      title,
      slug,
      poster,
      releaseDate
    },
    "recommendationCount": count(recommendations)
  }
`

// Get single movie recommendation article by slug
export const MOVIE_RECOMMENDATION_QUERY = groq`
  *[_type == "movieRecommendation" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    introduction,
    conclusion,
    metaDescription,
    publishedAt,
    updatedAt,
    "sourceMovie": sourceMovie->{
      _id,
      title,
      slug,
      poster,
      backdrop,
      releaseDate,
      director,
      synopsis
    },
    "recommendations": recommendations[] {
      order,
      explanation,
      "movie": movie->{
        _id,
        title,
        slug,
        poster,
        releaseDate,
        director,
        runtime,
        synopsis,
        "avgRating": math::avg(*[_type == "review" && references(^._id)].rating),
        "categories": categories[]->{
          title,
          slug,
          color
        }
      }
    }
  }
`

// Get movies by category/genre
export const MOVIES_BY_CATEGORY_QUERY = groq`
  *[_type == "movie" && references($categoryId)] | order(releaseDate desc) {
    _id,
    title,
    slug,
    poster,
    releaseDate,
    director,
    "avgRating": math::avg(*[_type == "review" && references(^._id)].rating),
    "reviewCount": count(*[_type == "review" && references(^._id)])
  }
`

// Get related movies (same categories/director)
export const RELATED_MOVIES_QUERY = groq`
  *[_type == "movie" && _id != $movieId && (
    count((categories[]._ref)[@ in $categoryIds]) > 0 ||
    director == $director
  )][0...6] {
    _id,
    title,
    slug,
    poster,
    releaseDate,
    "avgRating": math::avg(*[_type == "review" && references(^._id)].rating)
  }
`

// Get similar movies for recommendation widget
export const SIMILAR_MOVIES_QUERY = groq`
  *[_type == "movie" && _id != $movieId] | score(
    boost(count((categories[]._ref)[@ in $categoryIds]) > 0, 3),
    boost(director == $director, 2),
    boost(releaseDate > $minDate && releaseDate < $maxDate, 1)
  ) | order(_score desc)[0...12] {
    _id,
    title,
    slug,
    poster,
    releaseDate,
    director,
    "avgRating": math::avg(*[_type == "review" && references(^._id)].rating),
    "categories": categories[]->{title, slug, color}
  }
`

// Get popular movies (based on review count and ratings)
export const POPULAR_MOVIES_QUERY = groq`
  *[_type == "movie"] {
    _id,
    title,
    slug,
    poster,
    backdrop,
    releaseDate,
    director,
    synopsis,
    "avgRating": math::avg(*[_type == "review" && references(^._id)].rating),
    "reviewCount": count(*[_type == "review" && references(^._id)]),
    "categories": categories[]->{title, slug, color}
  } | order(reviewCount desc, avgRating desc)[0...8]
`

// Get popular TV series
export const POPULAR_TV_SERIES_QUERY = groq`
  *[_type == "tvSeries"] {
    _id,
    title,
    slug,
    poster,
    backdrop,
    firstAirDate,
    status,
    creator,
    synopsis,
    numberOfSeasons,
    "avgRating": math::avg(*[_type == "review" && references(^._id)].rating),
    "reviewCount": count(*[_type == "review" && references(^._id)]),
    "categories": categories[]->{title, slug, color}
  } | order(reviewCount desc, avgRating desc)[0...8]
`

// Get single TV series by slug
export const TV_SERIES_QUERY = groq`
  *[_type == "tvSeries" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    poster,
    backdrop,
    firstAirDate,
    lastAirDate,
    status,
    creator,
    cast,
    numberOfSeasons,
    numberOfEpisodes,
    episodeRuntime,
    synopsis,
    trailerUrl,
    network,
    "categories": categories[]->{
      title,
      slug,
      description,
      color
    },
    "reviews": *[_type == "review" && references(^._id)] | order(publishedAt desc) {
      _id,
      title,
      slug,
      rating,
      verdict,
      publishedAt,
      "author": author->{
        name,
        image
      }
    },
    "avgRating": math::avg(*[_type == "review" && references(^._id)].rating),
    "reviewCount": count(*[_type == "review" && references(^._id)])
  }
`

// Get all TV series
export const TV_SERIES_LIST_QUERY = groq`
  *[_type == "tvSeries"] | order(firstAirDate desc) {
    _id,
    title,
    slug,
    poster,
    firstAirDate,
    status,
    creator,
    numberOfSeasons,
    "categories": categories[]->{
      title,
      slug,
      color
    },
    "avgRating": math::avg(*[_type == "review" && references(^._id)].rating),
    "reviewCount": count(*[_type == "review" && references(^._id)])
  }
`

// Get featured categories for homepage
export const FEATURED_CATEGORIES_QUERY = groq`
  *[_type == "category"] {
    _id,
    title,
    slug,
    description,
    color,
    "movieCount": count(*[_type == "movie" && references(^._id)]),
    "tvSeriesCount": count(*[_type == "tvSeries" && references(^._id)]),
    "totalCount": count(*[_type == "movie" && references(^._id)]) + count(*[_type == "tvSeries" && references(^._id)])
  } | order(totalCount desc)[0...6]
`
