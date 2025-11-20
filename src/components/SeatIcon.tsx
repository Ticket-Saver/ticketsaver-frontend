import React from 'react'

interface SeatIconProps {
  isAvailable: boolean
  isSelected: boolean
  seatNumber: string | number
  row: string
  onClick?: () => void
  className?: string
  stageDirection?: 'north' | 'south' | 'east' | 'west'
}

export default function SeatIcon({
  isAvailable,
  isSelected,
  seatNumber,
  row,
  onClick,
  className = '',
  stageDirection = 'north'
}: SeatIconProps) {
  const getSeatColor = () => {
    if (isSelected) return '#fbbf24' // Amarillo para selección
    if (!isAvailable) return '#6b7280' // Gris para ocupado
    return '#3b82f6' // Azul para disponible
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
        focusable="false"
        viewBox="0 0 83 62.999"
        width="40"
        height="40"
        className="seat-svg"
        style={{
          display: 'block',
          transform: `rotate(${getRotation()}deg)`,
          transformOrigin: 'center'
        }}
      >
        <path
          data-name="seat shape 1"
          d="M16.869 63a3 3 0 0 1-3-3v-8.93a5.02 5.02 0 0 1-1.084.118H5a5 5 0 0 1-5-5V5a5 5 0 0 1 5-5h7.785a5 5 0 0 1 5 5v4.466A21.977 21.977 0 0 1 35.869 0h13.239a21.942 21.942 0 0 1 16.106 7.014V5a5 5 0 0 1 5-5H78a5 5 0 0 1 5 5v41.187a5 5 0 0 1-5 5h-6.893V60a3 3 0 0 1-3 3Z"
          fill={getSeatColor()}
        />
      </svg>
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          fontSize: '10px',
          fontWeight: 'bold',
          color: isSelected ? '#1f2937' : '#ffffff',
          textShadow: isSelected ? 'none' : '1px 1px 2px rgba(0,0,0,0.8)'
        }}
      >
        {seatNumber}
      </div>
    </div>
  )
}
