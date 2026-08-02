import { useState } from 'react'
import { cn } from '../../../types/ui'
import { getCoverPalette } from '../../../lib/covers/palettes'
import type { UIEvent } from '../../../types/uiEvent'

interface ArtistRowProps {
  event: UIEvent
  /** Número de próximas fechas del mismo artista (incluye la actual). */
  upcomingCount: number
}

export default function ArtistRow({ event, upcomingCount }: ArtistRowProps) {
  const [following, setFollowing] = useState(false)
  const palette = getCoverPalette(event.cover)
  const initial = (event.title.trim()[0] || '?').toUpperCase()

  const upcomingText =
    upcomingCount > 1
      ? `${upcomingCount} upcoming dates`
      : 'Single date · catch it'

  return (
    <div className='flex items-center gap-3'>
      <div
        className='h-9 w-9 shrink-0 rounded-pill grid place-items-center font-display text-sm font-bold text-white border-[1.5px] border-white/20'
        style={{
          background: `linear-gradient(135deg, ${palette.a}, ${palette.b})`
        }}
        aria-hidden
      >
        {initial}
      </div>
      <div className='min-w-0 flex-1'>
        <div className='text-xs font-medium text-white truncate'>
          {event.title}
        </div>
        <div className='text-[10.5px] text-white/55 mt-0.5'>{upcomingText}</div>
      </div>
      <button
        type='button'
        aria-pressed={following}
        onClick={() => setFollowing((s) => !s)}
        className={cn(
          'rounded-pill px-3.5 py-1.5 text-[11px] font-display font-semibold border transition',
          following
            ? 'bg-white text-brand-ink border-transparent'
            : 'bg-brand-hi/15 text-brand-hi border-brand-hi/30 hover:bg-brand-hi/25'
        )}
      >
        {following ? 'Following' : 'Follow'}
      </button>
    </div>
  )
}
