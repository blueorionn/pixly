import PhotoFeed from './PhotoFeed'
import HomeHeader from './components/Header'

export default async function HomePage() {
  return (
    <main className='mx-auto max-w-7xl px-4 pt-6 pb-24 sm:px-6 sm:pb-6'>
      <HomeHeader />
      <PhotoFeed />
    </main>
  )
}
