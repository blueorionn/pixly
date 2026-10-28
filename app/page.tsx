import Header from '@/components/Header'
import Footer from '@/components/Footer'
import HomePage from '@/web/home/HomePage'

export const dynamic = 'force-dynamic'

export default function Home() {
  return (
    <div className='font-sans'>
      <Header />
      <HomePage />
      <Footer />
    </div>
  )
}
