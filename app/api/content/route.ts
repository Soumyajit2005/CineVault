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
    const doc = await request.json()

    const result = await writeClient.create(doc)

    return NextResponse.json({ success: true, document: result })
  } catch (error) {
    console.error('Content creation error:', error)
    return NextResponse.json({ error: 'Failed to create content' }, { status: 500 })
  }
}
