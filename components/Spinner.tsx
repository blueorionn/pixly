export function Spinner({ className = 'size-4' }: { className?: string }) {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      className={`animate-spin ${className}`}
      aria-hidden
    >
      <circle
        cx='12'
        cy='12'
        r='9'
        stroke='currentColor'
        strokeWidth='2.5'
        className='opacity-25'
      />
      <path
        d='M21 12a9 9 0 0 0-9-9'
        stroke='currentColor'
        strokeWidth='2.5'
        strokeLinecap='round'
      />
    </svg>
  )
}
