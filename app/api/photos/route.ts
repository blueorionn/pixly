import { NextRequest, NextResponse } from 'next/server'

import { MAX_PER_PAGE_LIMIT } from '@/lib/queries/types/photos'
import { getPublicFeed } from '@/lib/queries/photos'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const limit = Number(searchParams.get('limit') ?? MAX_PER_PAGE_LIMIT)
  const offset = Number(searchParams.get('offset') ?? 0)

  const photos = await getPublicFeed(limit, offset)

  return NextResponse.json({
    success: true,
    limit,
    offset,
    length: photos.length,
    photos: photos,
  })
}
