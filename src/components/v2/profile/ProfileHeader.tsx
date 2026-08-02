import { useState, useRef, useEffect } from 'react'
import { cn } from '../../../types/ui'
import gradients from '../../../styles/effects/gradients.module.css'

interface ProfileHeaderProps {
  name?: string
  email?: string
  picture?: string
  /** Texto debajo del nombre (rol, sub-id, etc.). */
  subtitle?: string
}

const initialsFromName = (name?: string): string => {
  if (!name) return 'U'
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function ProfileHeader({ name, email, picture, subtitle }: ProfileHeaderProps) {
  const [imgError, setImgError] = useState(false)
  const initialsRef = useRef(initialsFromName(name))
  useEffect(() => {
    initialsRef.current = initialsFromName(name)
  }, [name])

  return (
    <header className='flex items-center gap-4 sm:gap-5'>
      <div
        className={cn(
          'h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-pill grid place-items-center font-display text-xl sm:text-2xl font-bold text-brand-ink border-2 border-white/20 overflow-hidden shadow-brand-glow',
          'bg-gradient-to-br from-brand-hi to-brand-mid'
        )}
        aria-hidden
      >
        {picture && !imgError ? (
          <img
            src={picture}
            alt={name ?? 'avatar'}
            className='h-full w-full object-cover'
            onError={() => setImgError(true)}
          />
        ) : (
          initialsRef.current
        )}
      </div>
      <div className='min-w-0'>
        <p className='text-[11px] text-white/55 uppercase tracking-[0.16em] font-display font-bold'>
          Account
        </p>
        <h1
          className={cn(
            'mt-1 font-display text-2xl sm:text-3xl font-bold tracking-tight truncate',
            gradients.textBrandSoft
          )}
        >
          {name ?? 'Guest'}
        </h1>
        {(email || subtitle) && (
          <p className='mt-1 text-[12.5px] text-white/55 truncate'>{email ?? subtitle}</p>
        )}
      </div>
    </header>
  )
}
