'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Sun, Moon, GalleryHorizontal, Search, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useThemeProvider } from '@/context/ThemeContext'

// shared look for the header icon buttons — hairline box, muted glyph
const ICON_BUTTON_CLASS =
  'border-border text-muted-foreground hover:bg-muted/50 hover:text-foreground cursor-pointer'

export default function Header() {
  const { theme, setTheme } = useThemeProvider()

  return (
    <header className='border-border bg-background/80 sticky top-0 z-10 border-b backdrop-blur'>
      <div className='mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6'>
        <Link href='/' className='flex shrink-0 items-center gap-2'>
          <Image
            src='/pixly.svg'
            alt='Pixly logo'
            width={32}
            height={32}
            priority
            className='size-8'
          />
          <span className='text-foreground text-base font-semibold tracking-tight'>
            Pixly<span className='text-accent'>.</span>
          </span>
        </Link>

        <div className='ml-auto flex w-max items-center justify-center gap-2'>
          <div className='hidden items-center gap-2 sm:flex'>
            <Button variant='ghost' size='icon' className={ICON_BUTTON_CLASS}>
              <Link href='/search' aria-label='Search photos'>
                <Search className='size-4' />
              </Link>
            </Button>
            <Button
              variant='ghost'
              size='icon'
              aria-label='scroll'
              className={ICON_BUTTON_CLASS}
            >
              <GalleryHorizontal className='size-4' />
            </Button>
            <div
              aria-hidden
              className='bg-foreground/20 dark:bg-foreground/30 mx-1 h-5 w-px shrink-0'
            />
          </div>

          {/* mobile: search, scroll and divider */}
          <div className='flex items-center gap-2 sm:hidden'>
            <Button variant='ghost' size='icon' className={ICON_BUTTON_CLASS}>
              <Link href='/search' aria-label='Search photos'>
                <Search className='size-4' />
              </Link>
            </Button>
            <Button
              variant='ghost'
              size='icon'
              aria-label='scroll'
              className={ICON_BUTTON_CLASS}
            >
              <Link href='/scroll' aria-label='Search photos'>
                <GalleryHorizontal className='size-4' />
              </Link>
            </Button>
            <div
              aria-hidden
              className='bg-foreground/20 dark:bg-foreground/30 mx-1 h-5 w-px shrink-0'
            />
          </div>

          <Button
            variant='ghost'
            size='icon'
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className={ICON_BUTTON_CLASS}
          >
            {theme === 'dark' ? (
              <Sun className='size-4' />
            ) : (
              <Moon className='size-4' />
            )}
          </Button>

          <Link
            href='/account'
            aria-label='Your account'
            className='bg-accent text-accent-foreground hover:bg-accent-hover flex size-9 shrink-0 items-center justify-center rounded-full transition-colors'
          >
            <User className='size-4' />
          </Link>
        </div>
      </div>
    </header>
  )
}
