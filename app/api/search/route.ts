import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ results: [] })
  }

  try {
    // Search both movies and TV series
    const results = await client.fetch(
      `*[
        _type in ["movie", "tvSeries"] &&
        title match $query
      ] | order(
        select(
          title match $exactQuery => 3,
          title match $query => 2,
          1
        )
      ) desc [0...10] {
        _id,
        _type,
        title,
        slug,
        poster,
        releaseDate,
        firstAirDate
      }`,
      {
        query: `${query}*`,
        exactQuery: query
      }
    )

    // Check if any of these items exist in recommendation articles
    const resultsWithRecommendations = await Promise.all(
      results.map(async (item: any) => {
        const hasRecommendation = await client.fetch(
          `*[_type == "recommendation" && sourceContent._ref == $id][0] {
            slug
          }`,
          { id: item._id }
        )

        return {
          ...item,
          hasRecommendation: !!hasRecommendation,
          recommendationSlug: hasRecommendation?.slug?.current
        }
      })
    )

    return NextResponse.json({ results: resultsWithRecommendations })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
