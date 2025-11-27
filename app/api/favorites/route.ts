import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/favorites - Get all favorites for the current user
// GET /api/favorites?contentId=xxx - Check if a specific content is favorited
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const contentId = searchParams.get('contentId')

    if (contentId) {
      // Check if specific content is favorited
      const favorite = await prisma.favorite.findUnique({
        where: {
          userId_contentId: {
            userId: session.user.id,
            contentId,
          },
        },
      })

      return NextResponse.json({ isFavorited: !!favorite })
    }

    // Get all favorites for the user
    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ favorites })
  } catch (error) {
    console.error('Get favorites error:', error)
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 })
  }
}

// POST /api/favorites - Add a favorite
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { contentId, contentType } = await request.json()

    if (!contentId || !contentType) {
      return NextResponse.json(
        { error: 'contentId and contentType are required' },
        { status: 400 }
      )
    }

    const favorite = await prisma.favorite.create({
      data: {
        contentId,
        contentType,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ favorite }, { status: 201 })
  } catch (error: any) {
    // Handle unique constraint violation (already favorited)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Already favorited' }, { status: 409 })
    }

    console.error('Create favorite error:', error)
    return NextResponse.json({ error: 'Failed to create favorite' }, { status: 500 })
  }
}

// DELETE /api/favorites?contentId=xxx - Remove a favorite
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const contentId = searchParams.get('contentId')

    if (!contentId) {
      return NextResponse.json({ error: 'contentId is required' }, { status: 400 })
    }

    await prisma.favorite.delete({
      where: {
        userId_contentId: {
          userId: session.user.id,
          contentId,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete favorite error:', error)
    return NextResponse.json({ error: 'Failed to delete favorite' }, { status: 500 })
  }
}
