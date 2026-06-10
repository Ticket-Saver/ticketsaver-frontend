import { useLocation, useNavigate } from 'react-router-dom'
import EventCover from '../EventCover'
import type { UIEvent } from '../../../types/uiEvent'
import type { HiImage } from '../../../types/hievents'

interface BannerProps {
  event: UIEvent
  /** Imágenes reales del evento (HiEvents). Si hay banner/cover, reemplaza al cover procedural. */
  images?: HiImage[]
  /** Texto opcional al pie del banner — ej. "World Tour '25". */
  tourName?: string
}

/** Elige la mejor imagen de fondo: banner > cover > thumbnail > primera disponible. */
const pickBannerImage = (images?: HiImage[]): string | undefined => {
  if (!images || images.length === 0) return undefined
  const byType = (t: string) => images.find((i) => i.type === t)?.url
  return (
    byType('EVENT_BANNER') ||
    byType('EVENT_COVER') ||
    byType('EVENT_THUMBNAIL') ||
    images[0]?.url
  )
}

export default function Banner({ event, images, tourName }: BannerProps) {
  const bgImage = pickBannerImage(images)
  const navigate = useNavigate()
  const location = useLocation()

  const goBack = () => {
    // location.key === 'default' significa que es la primera entrada
    if (location.key !== 'default') navigate(-1)
    else navigate('/events')
  }

  const handleShare = async () => {
    if (typeof navigator === 'undefined') return
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: event.title, url })
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url)
      }
    } catch {
      // Silenciamos cancelaciones del share-sheet.
    }
  }

  return (
    <div className='relative h-[260px] sm:h-[320px] lg:h-[420px] w-full overflow-hidden'>
      <div className='absolute inset-0'>
        {bgImage ? (
          <img
            src={bgImage}
            alt={event.title}
            className='h-full w-full object-cover'
          />
        ) : (
          <EventCover
            event={event}
            height={420}
            big
            hideCategory
            hideTitle
            hideDate
          />
        )}
      </div>

      <div
        aria-hidden
        className='absolute inset-x-0 bottom-0 h-3/5'
        style={{
          background:
            'linear-gradient(to top, rgba(10,4,24,1) 0%, rgba(10,4,24,0.55) 50%, transparent 100%)'
        }}
      />

      <div className='absolute top-4 lg:top-6 left-4 lg:left-10 right-4 lg:right-10 flex items-center justify-between z-10'>
        <CircleButton label='Go back' onClick={goBack}>
          <BackIcon />
        </CircleButton>
        <div className='flex gap-2'>
          <CircleButton label='Share event' onClick={handleShare}>
            <ShareIcon />
          </CircleButton>
          <CircleButton label='More options'>
            <MoreIcon />
          </CircleButton>
        </div>
      </div>

      {tourName && (
        <div className='absolute left-5 right-5 lg:left-10 lg:right-10 bottom-5 lg:bottom-8 flex justify-end'>
          <span className='hidden sm:inline text-white/70 text-[10.5px] font-display uppercase tracking-[0.1em]'>
            {tourName}
          </span>
        </div>
      )}
    </div>
  )
}

interface CircleButtonProps {
  label: string
  onClick?: () => void
  children: React.ReactNode
}

const CircleButton = ({ label, onClick, children }: CircleButtonProps) => (
  <button
    type='button'
    aria-label={label}
    onClick={onClick}
    className='grid h-10 w-10 place-items-center rounded-glass-sm border border-white/20 text-white backdrop-blur-glass hover:bg-black/60 transition'
    style={{ background: 'rgba(0,0,0,0.45)' }}
  >
    {children}
  </button>
)

const BackIcon = () => (
  <svg width='14' height='14' viewBox='0 0 14 14' fill='none' aria-hidden>
    <path
      d='M9 2 4 7l5 5'
      stroke='currentColor'
      strokeWidth='1.6'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

const ShareIcon = () => (
  <svg width='14' height='14' viewBox='0 0 14 14' fill='none' aria-hidden>
    <path
      d='M7 1v8M4 4l3-3 3 3M2 9v3a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9'
      stroke='currentColor'
      strokeWidth='1.4'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)

const MoreIcon = () => (
  <svg width='14' height='14' viewBox='0 0 14 14' fill='none' aria-hidden>
    <circle cx='3' cy='7' r='1.2' fill='currentColor' />
    <circle cx='7' cy='7' r='1.2' fill='currentColor' />
    <circle cx='11' cy='7' r='1.2' fill='currentColor' />
  </svg>
)
