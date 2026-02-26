import React from 'react'

interface SeatIconProps {
  isAvailable: boolean
  isSelected: boolean
  seatNumber: string | number
  row: string
  onClick?: () => void
  className?: string
  stageDirection?: 'north' | 'south' | 'east' | 'west'
  /** New: typed seat category. Replaces the old `isSpecial` boolean. */
  seatType?: string | null
  /** Legacy fallback — kept for backwards compat with maps not using seat_types */
  isSpecial?: boolean
}

const SEAT_TYPE_COLORS: Record<string, string> = {
  companion: '#7C3AED', // Purple
  wheelchair: '#1D4ED8', // Dark Blue
  limited_mobility: '#0D9488', // Teal
  sight_hearing: '#D97706' // Amber
}

export default function SeatIcon({
  isAvailable,
  isSelected,
  seatNumber,
  row,
  onClick,
  className = '',
  stageDirection = 'north',
  seatType = null,
  isSpecial = false
}: SeatIconProps) {
  // Resolve effective type (seatType takes precedence over legacy isSpecial)
  const effectiveType = seatType ?? (isSpecial ? 'wheelchair' : null)

  const getSeatColor = () => {
    if (isSelected) return '#fbbf24'
    if (!isAvailable) return '#6b7280'
    if (effectiveType && SEAT_TYPE_COLORS[effectiveType]) return SEAT_TYPE_COLORS[effectiveType]
    return '#3b82f6'
  }

  const getSeatClass = () => {
    if (isSelected) return 'selected'
    if (!isAvailable) return 'occupied'
    return 'available'
  }

  const getRotation = () => {
    switch (stageDirection) {
      case 'north':
        return 0
      case 'south':
        return 180
      case 'east':
        return 90
      case 'west':
        return -90
      default:
        return 0
    }
  }

  const color = getSeatColor()

  // ── SVG icon paths for each special type ─────────────────────────────────────

  // Companion: two-person silhouette (group icon)
  const CompanionIcon = () => (
    <g>
      <circle cx='41.5' cy='31.5' r='28' fill='#ffffff' stroke={color} strokeWidth='3' />
      {/* Two people outline */}
      <g fill={color} transform='translate(12, 12) scale(0.72)'>
        <path d='M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z' />
      </g>
    </g>
  )

  // Wheelchair: existing icon
  const WheelchairIcon = () => (
    <g>
      <circle cx='41.5' cy='31.5' r='28' fill='#ffffff' stroke={color} strokeWidth='3' />
      <path
        d='M 17.5 4 C 15 4 13 6 13 8.5 C 13 11 15 13 17.5 13 C 20 13 22 11 22 8.5 C 22 6 20 4 17.5 4 Z M 16 16 L 16 26 L 12 26 C 7 26 3 30 3 35 C 3 43.3 9.7 50 18 50 C 26.3 50 33 43.3 33 35 L 29 35 C 29 41.1 24.1 46 18 46 C 11.9 46 7 41.1 7 35 C 7 32 9 30 12 30 L 18 30 C 19.1 30 20 30.9 20 32 L 20 57.5 A 2.5 2.5 0 0 0 25 57.5 L 25 35 C 25 33.3 24 31.9 22.5 31.1 L 19 19.3 L 26.5 26.8 A 2.5 2.5 0 0 0 30.1 23.3 L 21 14 L 17.3 14 L 16 16 Z'
        fill={color}
        transform='translate(26, 6) scale(0.9)'
      />
    </g>
  )

  // Limited Mobility: person walking with cane
  const LimitedMobilityIcon = () => (
    <g>
      <circle cx='41.5' cy='31.5' r='28' fill='#ffffff' stroke={color} strokeWidth='3' />
      <g fill={color} transform='translate(22, 8) scale(0.75)'>
        <circle cx='12' cy='4' r='2' />
        {/* Body */}
        <path d='M13 8.5l-1 4 2 2-2 7h2l2-7-2-2 .5-2.5C15.5 11.5 17 13 17 13v3h2v-3.5c0-1.1-.9-2-2-2l-2.5-1.5 1-1z' />
        {/* Cane */}
        <line x1='8' y1='14' x2='8' y2='22' stroke={color} strokeWidth='2' strokeLinecap='round' />
        <line x1='8' y1='22' x2='11' y2='22' stroke={color} strokeWidth='2' strokeLinecap='round' />
      </g>
    </g>
  )

  // Sight/Hearing: eye icon
  const SightHearingIcon = () => (
    <g>
      <circle cx='41.5' cy='31.5' r='28' fill='#ffffff' stroke={color} strokeWidth='3' />
      <g
        fill='none'
        stroke={color}
        strokeWidth='2.5'
        strokeLinecap='round'
        strokeLinejoin='round'
        transform='translate(13, 19)'
      >
        <path d='M1 12.5s4.5-9 15-9 15 9 15 9-4.5 9-15 9-15-9-15-9z' />
        <circle cx='16' cy='12.5' r='4' fill={color} />
      </g>
    </g>
  )

  const getSpecialSvg = () => {
    switch (effectiveType) {
      case 'companion':
        return <CompanionIcon />
      case 'wheelchair':
        return <WheelchairIcon />
      case 'limited_mobility':
        return <LimitedMobilityIcon />
      case 'sight_hearing':
        return <SightHearingIcon />
      default:
        return null
    }
  }

  const isTyped = effectiveType !== null && effectiveType !== undefined

  return (
    <div
      className={`seat-icon ${getSeatClass()} ${className} relative inline-block`}
      onClick={isAvailable ? onClick : undefined}
      style={{
        cursor: isAvailable ? 'pointer' : 'not-allowed',
        opacity: isAvailable ? 1 : 0.6,
        width: '40px',
        height: '40px'
      }}
    >
      <svg
        focusable='false'
        viewBox='0 0 83 62.999'
        width='40'
        height='40'
        className='seat-svg'
        style={{
          display: 'block',
          transform: `rotate(${getRotation()}deg)`,
          transformOrigin: 'center'
        }}
      >
        {isTyped ? (
          getSpecialSvg()
        ) : (
          <path
            data-name='seat shape 1'
            d='M16.869 63a3 3 0 0 1-3-3v-8.93a5.02 5.02 0 0 1-1.084.118H5a5 5 0 0 1-5-5V5a5 5 0 0 1 5-5h7.785a5 5 0 0 1 5 5v4.466A21.977 21.977 0 0 1 35.869 0h13.239a21.942 21.942 0 0 1 16.106 7.014V5a5 5 0 0 1 5-5H78a5 5 0 0 1 5 5v41.187a5 5 0 0 1-5 5h-6.893V60a3 3 0 0 1-3 3Z'
            fill={color}
          />
        )}
      </svg>
      {!isTyped && (
        <div
          className='absolute inset-0 flex items-center justify-center'
          style={{
            fontSize: '10px',
            fontWeight: 'bold',
            color: isSelected ? '#1f2937' : '#ffffff',
            textShadow: isSelected ? 'none' : '1px 1px 2px rgba(0,0,0,0.8)'
          }}
        >
          {seatNumber}
        </div>
      )}
    </div>
  )
}
