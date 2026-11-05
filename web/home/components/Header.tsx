'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  Check,
  ChevronDown,
  EyeOff,
  Globe,
  Images,
  GalleryVertical,
  Trash2,
  TriangleAlert,
  Upload,
} from 'lucide-react'

const VIEWS = [
  { value: 'public', label: 'Public', icon: Globe },
  { value: 'hidden', label: 'Hidden', icon: EyeOff },
  { value: 'deleted', label: 'Deleted', icon: Trash2 },
  { value: 'nsfw', label: 'NSFW', icon: TriangleAlert },
] as const

type View = (typeof VIEWS)[number]['value']

export default function HomeHeader() {
  const [view, setView] = useState<View>('public')
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const activeView = VIEWS.find((v) => v.value === view)!
  const ActiveIcon = activeView.icon

  return (
    <nav
      aria-label='Gallery sections'
      className='bg-background/80 sticky top-14 z-5 mb-4 backdrop-blur'
    >
      <div className='flex justify-center py-3'>
        <div className='border-border bg-surface inline-flex items-center gap-1 rounded border p-1'>
          <div className='relative' ref={menuRef}>
            <button
              type='button'
              onClick={() => setOpen((o) => !o)}
              aria-haspopup='listbox'
              aria-expanded={open}
              aria-label='Select gallery view'
              className='bg-accent text-accent-foreground flex cursor-pointer items-center gap-2 rounded px-4 py-1.5 text-sm font-medium transition-colors'
            >
              <ActiveIcon className='size-3.5' />
              {activeView.label}
              <ChevronDown
                className={`size-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
              />
            </button>

            {open && (
              <ul
                role='listbox'
                aria-label='Gallery views'
                className='bg-popover text-popover-foreground border-border absolute top-full left-0 z-10 mt-2 w-44 rounded border p-1 shadow-lg'
              >
                {VIEWS.map(({ value, label, icon: Icon }) => (
                  <li key={value}>
                    <button
                      type='button'
                      role='option'
                      aria-selected={view === value}
                      onClick={() => {
                        setView(value)
                        setOpen(false)
                      }}
                      className={`flex w-full cursor-pointer items-center gap-2 rounded px-3 py-2 text-sm transition-colors ${
                        view === value
                          ? 'text-accent'
                          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                      }`}
                    >
                      <Icon className='size-3.5' />
                      {label}
                      {view === value && <Check className='ml-auto size-3.5' />}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link
            key={'Collections'}
            href={'/collections'}
            className='text-muted-foreground hover:bg-muted/10 hover:text-foreground flex cursor-pointer items-center gap-2 rounded px-4 py-1.5 text-sm font-medium transition-colors'
          >
            <Images className='size-4' />
            {'Collections'}
          </Link>

          <Link
            key={'Upload'}
            href={'/upload'}
            className='text-muted-foreground hover:bg-muted/10 hover:text-foreground hidden cursor-pointer items-center gap-2 rounded px-4 py-1.5 text-sm font-medium transition-colors sm:flex'
          >
            <Upload className='size-4' />
            {'Upload'}
          </Link>

          <Link
            key={'Scroll'}
            href={'/scroll'}
            className='text-muted-foreground hover:bg-muted/10 hover:text-foreground hidden cursor-pointer items-center gap-2 rounded px-4 py-1.5 text-sm font-medium transition-colors sm:flex'
          >
            <GalleryVertical className='size-4 rotate-90' />
            {'Scroll'}
          </Link>
        </div>
      </div>
    </nav>
  )
}
