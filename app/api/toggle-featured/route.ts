import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeClient } from '@/sanity/lib/client'

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, type, featured } = await request.json()

    await writeClient
      .patch(id)
      .set({ featured })
      .commit()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Toggle featured error:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
