import 'server-only'

import { and, desc, eq, isNull } from 'drizzle-orm'
import { db } from '@/db'
import { photos } from '@/db/schema'
import { type FeedPhoto, MAX_PER_PAGE_LIMIT } from './types/photos'

export async function getPublicFeed(
  limit = MAX_PER_PAGE_LIMIT,
  offsetPhoto: number
): Promise<FeedPhoto[]> {
  const safeLimit = Math.min(Math.max(limit, 1), MAX_PER_PAGE_LIMIT)

  try {
    return await db
      .select({
        id: photos.id,
        slug: photos.slug,
        name: photos.name,
        width: photos.width,
        height: photos.height,
        storageKey: photos.storageKey,
        createdAt: photos.createdAt,
      })
      .from(photos)
      .where(
        and(
          eq(photos.isHidden, false),
          eq(photos.isNsfw, false),
          isNull(photos.deletedAt)
        )
      )
      .orderBy(desc(photos.createdAt))
      .limit(safeLimit)
      .offset(offsetPhoto)
  } catch (error) {
    console.log('getPublicFeed failed:', error)
    throw new Error('Could not fetch photos')
  }
}

export async function getPhotoBySlug(slug: string) {
  const [photo] = await db
    .select()
    .from(photos)
    .where(and(eq(photos.slug, slug), isNull(photos.deletedAt)))
    .limit(1)
  return photo ?? null
}
