interface VenueMapProps {
  venueName: string
  city: string
  /** URL directa de Google Maps (Directions). Si no, se construye a partir de la query. */
  mapsUrl?: string
}

export default function VenueMap({ venueName, city, mapsUrl }: VenueMapProps) {
  const query = [venueName, city].filter(Boolean).join(', ')
  const iframeSrc = `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=14&output=embed`
  const directionsUrl =
    mapsUrl ??
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`

  return (
    <div className='rounded-glass-md overflow-hidden border border-white/[0.12] bg-white/[0.04]'>
      <div className='relative h-[200px] lg:h-[280px] bg-[#1a1230]'>
        <iframe
          title={`${venueName} location`}
          src={iframeSrc}
          width='100%'
          height='100%'
          loading='lazy'
          referrerPolicy='no-referrer-when-downgrade'
          className='block w-full h-full border-0'
          style={{
            filter:
              'invert(0.92) hue-rotate(180deg) saturate(0.6) brightness(0.95)'
          }}
        />
        <div
          className='absolute left-3 top-3 px-2.5 py-1.5 rounded-glass-sm border border-white/[0.14] text-white text-[11.5px] font-medium flex items-center gap-1.5 backdrop-blur-glass'
          style={{ background: 'rgba(14,8,32,0.75)' }}
        >
          <PinIcon />
          {venueName}
        </div>
      </div>
      <div className='px-3.5 py-3 flex items-center justify-between gap-3'>
        <div className='min-w-0'>
          <div className='text-[12.5px] font-medium text-white truncate'>
            {venueName}
          </div>
          {city && (
            <div className='text-[10.5px] text-white/55 mt-0.5 truncate'>
              {city}
            </div>
          )}
        </div>
        <a
          href={directionsUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='shrink-0 inline-flex items-center gap-1 rounded-pill bg-brand-hi/20 border border-brand-hi/30 text-brand-hi text-[10.5px] font-display font-semibold px-3 py-1.5 hover:bg-brand-hi/30 transition'
        >
          Directions
          <ChevRight />
        </a>
      </div>
    </div>
  )
}

const PinIcon = () => (
  <svg width='11' height='11' viewBox='0 0 12 12' fill='none' aria-hidden>
    <path
      d='M6 1.5C4 1.5 2.5 3 2.5 5c0 2.5 3.5 5.5 3.5 5.5S9.5 7.5 9.5 5c0-2-1.5-3.5-3.5-3.5Z'
      stroke='currentColor'
      strokeWidth='1.2'
    />
    <circle cx='6' cy='5' r='1.3' fill='currentColor' />
  </svg>
)

const ChevRight = () => (
  <svg width='10' height='10' viewBox='0 0 12 12' fill='none' aria-hidden>
    <path
      d='m4.5 2.5 3.5 3.5-3.5 3.5'
      stroke='currentColor'
      strokeWidth='1.6'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)
