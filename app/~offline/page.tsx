import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Offline',
  robots: { index: false },
}

export default function OfflinePage() {
  return (
    <main className='flex min-h-dvh flex-col items-center justify-center gap-2 p-8 text-center'>
      <h1 className='text-foreground text-2xl font-semibold'>
        You&rsquo;re offline
      </h1>
      <p className='text-muted-foreground max-w-sm'>
        You need an internet connection
      </p>
    </main>
  )
}
