import { useId } from 'react'
import { Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { getCoverPalette } from '../../../lib/covers/palettes'
import { cn } from '../../../types/ui'
import type { UIEvent } from '../../../types/uiEvent'

export type TicketCardVariant = 'hero' | 'list'

interface TicketCardProps {
  event: UIEvent
  variant?: TicketCardVariant
  /** Para el variant 'hero': muestra los seat fields ("Section / Row / Seat"). */
  seatInfo?: {
    section?: string
    row?: string
    seat?: string
  }
  /** Número de ticket para mostrar en el hero ("No. 042"). */
  ticketNumber?: string | number
  /** Valor del QR REAL (el public_id de HiEvents). Sin esto, dibuja un QR decorativo. */
  qrValue?: string
  /** Hace toda la card un Link al detalle (variant list). */
  href?: string
  /** Cuando true, hace el filter saturate(.6) opacity(.7) para "past events". */
  past?: boolean
  className?: string
}

/**
 * TicketCard — dos variants:
 *  - `hero` (default en `TicketReceivedV2`): ticket card grande con gradient
 *    animado, perforación, QR (real o procedural), fields de seat. La estrella
 *    del post-purchase.
 *  - `list` (default en `TicketGrid`): horizontal compacta con date strip
 *    + cover + info, opcionalmente envuelta en un `<Link>`.
 */
export default function TicketCard({
  event,
  variant = 'list',
  seatInfo,
  ticketNumber,
  qrValue,
  href,
  past,
  className
}: TicketCardProps) {
  if (variant === 'hero') {
    return (
      <HeroTicket
        event={event}
        seatInfo={seatInfo}
        ticketNumber={ticketNumber}
        qrValue={qrValue}
        className={className}
      />
    )
  }

  const card = <ListTicket event={event} past={past} className={className} />
  if (href) {
    return (
      <Link to={href} className='block focus-visible:outline-none'>
        {card}
      </Link>
    )
  }
  return card
}

/* ─────────────── Hero (ticket card) ─────────────── */

const HeroTicket = ({
  event,
  seatInfo,
  ticketNumber,
  qrValue,
  className
}: {
  event: UIEvent
  seatInfo?: TicketCardProps['seatInfo']
  ticketNumber?: string | number
  qrValue?: string
  className?: string
}) => {
  const palette = getCoverPalette(event.cover)
  const noiseId = useId().replace(/[^a-z0-9]/gi, '')
  const ticketLabel = ticketNumber
    ? `No. ${String(ticketNumber).padStart(3, '0')}`
    : 'No. 042'

  return (
    <div
      className={cn('relative rounded-glass-xl overflow-hidden', className)}
      style={{
        background: `linear-gradient(135deg, ${palette.a}, ${palette.b}, ${palette.c})`,
        boxShadow:
          '0 30px 60px rgba(0,0,0,0.5), inset 0 0 0 0.5px rgba(255,255,255,0.15)'
      }}
    >
      <div
        aria-hidden
        className='absolute inset-0 animate-pulse-you'
        style={{
          background: `radial-gradient(circle at 75% 20%, ${palette.accent}66, transparent 60%), radial-gradient(circle at 20% 80%, #FFB1C866, transparent 50%)`,
          animationDuration: '6s'
        }}
      />

      <svg
        aria-hidden
        className='absolute inset-0 w-full h-full pointer-events-none'
        style={{ opacity: 0.2, mixBlendMode: 'overlay' }}
      >
        <filter id={`nft-noise-${noiseId}`}>
          <feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves={2} />
        </filter>
        <rect width='100%' height='100%' filter={`url(#nft-noise-${noiseId})`} />
      </svg>

      {/* Top */}
      <div className='relative px-5 pt-5 flex items-start justify-between gap-3'>
        <div className='min-w-0'>
          <div className='text-[9.5px] uppercase tracking-[0.2em] font-display font-bold text-white/70'>
            TicketSaver · {ticketLabel}
          </div>
          <div className='mt-2 font-display text-2xl sm:text-3xl font-bold text-white tracking-tight leading-none'>
            {event.title}
          </div>
          <div className='text-[11.5px] text-white/80 mt-1'>{event.subtitle}</div>
        </div>
      </div>

      {/* Big date */}
      <div className='relative px-5 pt-8 pb-5 text-center text-white'>
        <div className='text-[9.5px] font-display font-bold uppercase tracking-[0.2em] opacity-70'>
          {event.day} · {event.month}
        </div>
        <div className='font-display font-bold leading-[0.9] tracking-[-0.04em] text-[88px] sm:text-[96px] mt-1'>
          {String(event.date).padStart(2, '0')}
        </div>
        <div className='text-[11.5px] mt-2 opacity-80'>
          {event.time && `${event.time} · `}
          {event.venueName}
          {event.city && `, ${event.city}`}
        </div>
      </div>

      {/* Perforación */}
      <div className='relative'>
        <div
          aria-hidden
          className='absolute -left-2 -top-2 h-4 w-4 rounded-full bg-[#0A0A0C]'
        />
        <div
          aria-hidden
          className='absolute -right-2 -top-2 h-4 w-4 rounded-full bg-[#0A0A0C]'
        />
        <div
          aria-hidden
          className='h-px mx-5'
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.5) 50%, transparent 50%)',
            backgroundSize: '6px 1px'
          }}
        />
      </div>

      {/* Seat fields */}
      <div className='relative px-5 pt-4 pb-2 grid grid-cols-3 gap-2.5'>
        <SeatField label='Section' value={seatInfo?.section ?? '—'} />
        <SeatField label='Row' value={seatInfo?.row ?? '—'} />
        <SeatField label='Seat' value={seatInfo?.seat ?? '—'} />
      </div>

      {/* QR — real (public_id de HiEvents, escaneable por el check-in) si viene
          qrValue; si no, un patrón decorativo. */}
      <div className='relative px-5 pb-5 pt-3 flex items-center gap-3'>
        {qrValue ? (
          <div className='shrink-0 grid place-items-center rounded-glass-sm bg-white p-1.5 h-20 w-20'>
            <QRCodeSVG value={qrValue} size={68} level='M' />
          </div>
        ) : (
          <FakeQR seed={String(ticketNumber ?? event.id)} />
        )}
        <div className='flex-1 min-w-0'>
          <div className='text-[9.5px] uppercase tracking-[0.16em] font-display font-bold text-white/75'>
            Scan at entry
          </div>
          <p className='mt-1 text-[11px] text-white/85 leading-snug'>
            Show this code at the entrance. It&apos;s unique to your ticket.
          </p>
        </div>
      </div>
    </div>
  )
}

const SeatField = ({ label, value }: { label: string; value: string }) => (
  <div
    className='rounded-glass-sm border border-white/[0.16] backdrop-blur-glass px-2.5 py-2'
    style={{ background: 'rgba(0,0,0,0.30)' }}
  >
    <div className='text-[8.5px] uppercase tracking-[0.16em] font-display font-bold text-white/60'>
      {label}
    </div>
    <div className='mt-0.5 font-display text-base font-bold text-white tabular-nums tracking-[-0.02em]'>
      {value}
    </div>
  </div>
)

/* ─────────────── QR procedural ─────────────── */

const FakeQR = ({ seed }: { seed: string }) => {
  // Hash determinista para que el QR sea consistente por seat.
  let h = 0
  for (let i = 0; i < seed.length; i++) h = ((h << 5) + h + seed.charCodeAt(i)) | 0
  const r = (n: number) => ((Math.sin(h * (n + 1)) + 1) / 2) * 100

  const cells: [number, number][] = []
  for (let y = 0; y < 21; y++) {
    for (let x = 0; x < 21; x++) {
      const corner = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13)
      const innerCorner =
        (x >= 2 && x <= 4 && y >= 2 && y <= 4) ||
        (x >= 16 && x <= 18 && y >= 2 && y <= 4) ||
        (x >= 2 && x <= 4 && y >= 16 && y <= 18)
      const ring1 = (x === 0 || x === 6 || y === 0 || y === 6) && x < 7 && y < 7
      const ring2 = (x === 14 || x === 20 || y === 0 || y === 6) && x > 13 && y < 7
      const ring3 = (x === 0 || x === 6 || y === 14 || y === 20) && x < 7 && y > 13
      if (corner) {
        if (innerCorner || ring1 || ring2 || ring3) cells.push([x, y])
      } else if (r(x * 7 + y * 11) < 38) {
        cells.push([x, y])
      }
    }
  }
  return (
    <div className='shrink-0 grid place-items-center rounded-glass-sm bg-white p-1.5 h-20 w-20'>
      <svg viewBox='0 0 21 21' className='block w-full h-full'>
        {cells.map(([x, y], i) => (
          <rect key={i} x={x} y={y} width={1} height={1} fill='#1A0F33' />
        ))}
      </svg>
    </div>
  )
}

/* ─────────────── List (compacto) ─────────────── */

const ListTicket = ({
  event,
  past,
  className
}: {
  event: UIEvent
  past?: boolean
  className?: string
}) => {
  const palette = getCoverPalette(event.cover)
  return (
    <article
      className={cn(
        'relative rounded-glass-md overflow-hidden border border-white/[0.10] backdrop-blur-glass transition',
        past
          ? 'opacity-70 saturate-50'
          : 'hover:border-white/[0.18] hover:-translate-y-0.5',
        className
      )}
      style={{ background: 'rgba(255,255,255,0.04)' }}
    >
      <div className='flex'>
        <div
          className='relative w-24 shrink-0 grid place-items-stretch'
          style={{
            background: `linear-gradient(135deg, ${palette.a}, ${palette.b}, ${palette.c})`
          }}
        >
          <div
            aria-hidden
            className='absolute inset-0'
            style={{
              background: `radial-gradient(circle at 30% 30%, ${palette.accent}55, transparent 60%)`
            }}
          />
          <div className='relative p-2 flex flex-col justify-between text-white font-display'>
            <div className='text-[8.5px] uppercase tracking-[0.18em] font-bold opacity-85'>
              {event.day}
            </div>
            <div className='text-[34px] font-bold leading-none tracking-[-0.03em]'>
              {String(event.date).padStart(2, '0')}
            </div>
            <div className='text-[8.5px] uppercase tracking-[0.18em] font-bold opacity-70'>
              {event.month}
            </div>
          </div>
        </div>

        {/* perforation strip */}
        <div
          aria-hidden
          className='w-0.5 shrink-0'
          style={{
            backgroundImage:
              'linear-gradient(to bottom, rgba(255,255,255,0.25) 50%, transparent 50%)',
            backgroundSize: '2px 6px'
          }}
        />

        <div className='flex-1 min-w-0 p-3 flex flex-col gap-1.5'>
          <div className='font-display text-[15px] font-semibold text-white tracking-tight truncate'>
            {event.title}
          </div>
          <div className='text-[11px] text-white/55 truncate'>
            {event.venueName}
            {event.city && ` · ${event.city}`}
          </div>
          <div className='mt-auto flex items-center gap-1.5'>
            <Tag>
              {event.time || 'TBA'}
            </Tag>
          </div>
        </div>
      </div>
    </article>
  )
}

const Tag = ({ children, dim }: { children: string; dim?: boolean }) => (
  <span
    className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-pill text-[9.5px] font-display font-bold uppercase tracking-[0.10em]',
      dim
        ? 'bg-[rgba(0,82,255,0.20)] text-[#9CBBFF]'
        : 'bg-white/[0.10] text-white/85 border border-white/[0.12]'
    )}
  >
    {children}
  </span>
)
