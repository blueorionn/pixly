import Link from 'next/link'
import { CirclePlus, GalleryHorizontal, House } from 'lucide-react'

// mobile bottom-nav items — plain, borderless, thumb-sized
const NAV_ITEM_CLASS =
  'text-muted-foreground hover:text-foreground flex size-11 cursor-pointer items-center justify-center rounded-lg transition-colors'

export default function Footer() {
  return (
    <nav
      aria-label='Primary'
      className='border-border bg-background/90 fixed inset-x-0 bottom-0 z-10 border-t backdrop-blur sm:hidden'
    >
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-around px-4 pb-[env(safe-area-inset-bottom)]'>
        <Link href='/' aria-label='Home' className={NAV_ITEM_CLASS}>
          <House className='size-5' />
        </Link>
        <button
          type='button'
          aria-label='Upload photo'
          className={NAV_ITEM_CLASS}
        >
          <CirclePlus className='size-5' />
        </button>
        <Link
          href='/scroll'
          aria-label='Scroll mode'
          className={NAV_ITEM_CLASS}
        >
          <GalleryHorizontal className='size-5' />
        </Link>
      </div>
    </nav>
  )
}
