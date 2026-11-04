import PhotoFeed from './PhotoFeed'
import { getPublicFeed } from '@/lib/queries/photos'
import { MAX_PER_PAGE_LIMIT } from '@/lib/queries/types/photos'

export default async function HomePage() {
  const photos = await getPublicFeed(MAX_PER_PAGE_LIMIT, 0)

  return (
    <main className='mx-auto max-w-7xl px-4 pt-6 pb-24 sm:px-6 sm:pb-6'>
      <PhotoFeed initialPhotos={photos} cdnPrefix='/home' />
    </main>
  )
}
