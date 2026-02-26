import React, { useState } from 'react'
import SeatIcon from './SeatIcon'

interface SeatItem {
  id: number
  event_id: number
  title: string
  position: string
  section: string | null
  row: string
  seat_number: string | number
  price_range: string
  price: number
  price_including_taxes_and_fees?: number
  tax_total?: number
  fee_total?: number
  is_available: boolean
  is_sold_out: boolean
  seat_key: string
  seat_key_alt: string
  status: string
}

interface SeatSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  seatsByRow: Record<string, SeatItem[]>
  selectedSeats: Record<string, boolean>
  onSeatToggle: (seatKey: string) => void
  onProceed: () => void
  sectionName: string
  stageDirection?: 'north' | 'south' | 'east' | 'west'
  eventId: string
  reversedSections?: string[]
  specialRows?: string[]
  specialSeats?: string[]
  parsedRanges?: Record<
    string,
    {
      ranges: Array<{ start: number; end: number }>
      rows: string[]
      position?: string
      color?: string
      zone?: string
    }
  >
  frontRows?: string[]
  isLoadingGroup?: boolean
  seatTypes?: Record<string, string[]>
}

export default function SeatSelectionModal({
  isOpen,
  onClose,
  seatsByRow,
  selectedSeats,
  onSeatToggle,
  onProceed,
  sectionName,
  stageDirection = 'north',
  eventId,
  reversedSections = [],
  specialRows = [],
  specialSeats = [],
  parsedRanges = {},
  frontRows = [],
  isLoadingGroup = false,
  seatTypes = {}
}: SeatSelectionModalProps) {
  const [zoomLevel, setZoomLevel] = useState(0.8)
  const [isPanning, setIsPanning] = useState(false)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 })

  if (!isOpen) return null

  const allSeats: SeatItem[] = Object.values(seatsByRow).flat()
  const totalSelected = Object.values(selectedSeats).filter(Boolean).length
  const selectedIds = Object.entries(selectedSeats)
    .filter(([, v]) => !!v)
    .map(([k]) => k)
  const selectedSeatItems = allSeats.filter((seat) => selectedIds.includes(seat.id.toString()))

  // Usar directamente los datos del endpoint /seats que ya vienen en cada SeatItem
  const getSeatInclusive = (seat: SeatItem) =>
    Number(seat.price_including_taxes_and_fees) || Number(seat.price) || 0
  const getSeatFee = (seat: SeatItem) => Number(seat.fee_total) || 0
  const getSeatTax = (seat: SeatItem) => Number(seat.tax_total) || 0

  const selectedUniquePrices = Array.from(new Set(selectedSeatItems.map(getSeatInclusive))).sort(
    (a, b) => a - b
  )
  const allUniquePrices = Array.from(new Set(allSeats.map(getSeatInclusive))).sort((a, b) => a - b)
  const totalPrice = selectedSeatItems.reduce((sum, s) => sum + getSeatInclusive(s), 0)
  const selectedFeeTotal = selectedSeatItems.reduce((sum, s) => sum + getSeatFee(s), 0)
  const selectedTaxTotal = selectedSeatItems.reduce((sum, s) => sum + getSeatTax(s), 0)
  const selectedUniqueFees = Array.from(new Set(selectedSeatItems.map(getSeatFee))).sort(
    (a, b) => a - b
  )
  const allUniqueFees = Array.from(new Set(allSeats.map(getSeatFee))).sort((a, b) => a - b)

  const formatMoney = (n: number) => `$${n.toFixed(2)}`
  const perSeatPrices = totalSelected > 0 ? selectedUniquePrices : allUniquePrices
  const perSeatFees = totalSelected > 0 ? selectedUniqueFees : allUniqueFees

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.1, 2.5))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5))
  }

  const handleResetZoom = () => {
    setZoomLevel(0.8)
    setPanOffset({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsPanning(true)
      setLastPanPoint({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x
      const deltaY = e.clientY - lastPanPoint.y

      setPanOffset((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }))

      setLastPanPoint({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false)
  }

  const handleWheelZoom = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY
    const zoomFactor = 0.05

    if (delta < 0) {
      setZoomLevel((prev) => Math.min(prev + zoomFactor, 2.5))
    } else {
      setZoomLevel((prev) => Math.max(prev - zoomFactor, 0.5))
    }
  }

  const getStagePosition = () => {
    switch (stageDirection) {
      case 'north':
        return 'top'
      case 'south':
        return 'bottom'
      case 'east':
        return 'right'
      case 'west':
        return 'left'
      default:
        return 'top'
    }
  }

  const getStageTextStyle = () => {
    const position = getStagePosition()
    switch (position) {
      case 'top':
        return 'absolute top-2 left-1/2 transform -translate-x-1/2 text-center mb-4'
      case 'bottom':
        return 'absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center mt-4'
      case 'left':
        return 'absolute left-2 top-1/2 transform -translate-y-1/2 -rotate-90 mr-4'
      case 'right':
        return 'absolute right-2 top-1/2 transform -translate-y-1/2 rotate-90 ml-4'
      default:
        return 'absolute top-2 left-1/2 transform -translate-x-1/2 text-center mb-4'
    }
  }

  // Returns the seat type key ('companion'|'wheelchair'|'limited_mobility'|'sight_hearing') or null.
  // When seat_types is available (new format), it takes precedence over legacy special_seats.
  const getSeatType = (seat: SeatItem): string | null => {
    const knownColors = [
      'orange',
      'cyan',
      'red',
      'green',
      'purple',
      'blue',
      'yellow',
      'pink',
      'brown'
    ]
    const createColorlessTokens = (str: string) =>
      str
        .toLowerCase()
        .split('-')
        .filter((t) => !knownColors.includes(t))

    const seatRowNum = `${seat.row}${seat.seat_number}`
    const seatPos = (seat.position || '').toLowerCase()
    const seatSec = (seat.section || '').toLowerCase()

    // --- New typed seat_types system ---
    if (Object.keys(seatTypes).length > 0) {
      for (const [typeKey, ids] of Object.entries(seatTypes)) {
        for (const id of ids) {
          const tokens = createColorlessTokens(id)
          const matchesPositionOrSection = tokens.some((t) => t === seatPos || t === seatSec)
          const matchesSeatAndRow = tokens.some((t) => t === seatRowNum.toLowerCase())
          if (matchesPositionOrSection && matchesSeatAndRow) return typeKey
        }
      }
      // Also check special_rows for 'wheelchair' legacy mapping when seatTypes is present
      for (const specialRowId of specialRows) {
        const tokens = createColorlessTokens(specialRowId)
        const matchesPositionOrSection = tokens.some((t) => t === seatPos || t === seatSec)
        const matchesRow = tokens.some((t) => t === seat.row.toLowerCase())
        const seatIdTokens = [seatPos, seatSec, seat.row.toLowerCase(), 'balcony', 'loge'].filter(
          Boolean
        )
        const matchesZone = tokens.includes('balcony') ? seatIdTokens.includes('balcony') : true
        if (matchesPositionOrSection && matchesRow && matchesZone) return null // already handled above
      }
      return null
    }

    // --- Legacy special_seats / special_rows fallback ---
    for (const specialSeatId of specialSeats) {
      const specialTokens = createColorlessTokens(specialSeatId)
      const matchesPositionOrSection = specialTokens.some((t) => t === seatPos || t === seatSec)
      const matchesSeatAndRow = specialTokens.some((t) => t === seatRowNum.toLowerCase())
      if (matchesPositionOrSection && matchesSeatAndRow) return 'wheelchair'
    }
    for (const specialRowId of specialRows) {
      const specialTokens = createColorlessTokens(specialRowId)
      const matchesPositionOrSection = specialTokens.some((t) => t === seatPos || t === seatSec)
      const matchesRow = specialTokens.some((t) => t === seat.row.toLowerCase())
      const seatIdTokens = [seatPos, seatSec, seat.row.toLowerCase(), 'balcony', 'loge'].filter(
        Boolean
      )
      const matchesZone = specialTokens.includes('balcony')
        ? seatIdTokens.includes('balcony')
        : true
      if (matchesPositionOrSection && matchesRow && matchesZone) return 'wheelchair'
    }
    return null
  }

  const isReversed =
    reversedSections.includes(sectionName) ||
    allSeats.some(
      (s) => reversedSections.includes(s.position) || reversedSections.includes(s.section || '')
    )

  // Determine which special types are present in this section (for the legend)
  const typesInSection = new Set<string>()
  allSeats.forEach((s) => {
    const t = getSeatType(s)
    if (t) typesInSection.add(t)
  })

  const selectedTypes = new Set<string>()
  selectedSeatItems.forEach((s) => {
    const t = getSeatType(s)
    if (t) selectedTypes.add(t)
  })

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col'>
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b'>
          <div>
            <h2 className='text-xl font-semibold text-gray-900'>Select Seats - {sectionName}</h2>
            <p className='text-sm text-gray-600'>Click on available seats to select them</p>
          </div>
          <div className='flex items-center space-x-2'>
            {/* Zoom Controls */}
            <div className='flex items-center space-x-1 bg-gray-100 rounded-lg p-1'>
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
                className='px-2 py-1 text-sm bg-white rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                title='Zoom Out'
              >
                −
              </button>
              <span className='px-2 py-1 text-sm text-gray-600 min-w-[3rem] text-center'>
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 2.5}
                className='px-2 py-1 text-sm bg-white rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed'
                title='Zoom In'
              >
                +
              </button>
              <button
                onClick={handleResetZoom}
                className='px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200'
                title='Reset Zoom'
              >
                Reset
              </button>
            </div>
            <button onClick={onClose} className='text-gray-400 hover:text-gray-600 text-2xl'>
              ×
            </button>
          </div>
        </div>

        {/* Seating Map */}
        <div
          className='p-6 overflow-auto max-h-[60vh] relative flex items-center justify-center'
          onWheel={handleWheelZoom}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
        >
          {/* Stage Text */}
          <div
            className={`${getStageTextStyle()} text-lg font-bold text-gray-600 z-20 pointer-events-none`}
            style={{
              position: 'absolute',
              zIndex: 1000
            }}
          >
            Stage
          </div>

          <div
            className={`flex flex-col items-center justify-center space-y-4 w-full ${
              stageDirection === 'north'
                ? 'pt-8'
                : stageDirection === 'south'
                  ? 'pb-8'
                  : stageDirection === 'east'
                    ? 'pr-8'
                    : stageDirection === 'west'
                      ? 'pl-8'
                      : 'pt-8'
            }`}
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
              transformOrigin: 'center center',
              minHeight: 'fit-content'
            }}
          >
            {isLoadingGroup ? (
              <div className='flex flex-col items-center justify-center p-12 mt-12 mb-12'>
                <span className='loading loading-spinner loading-lg text-blue-600 mb-4' />
                <p className='text-gray-600 font-medium'>Obteniendo asientos...</p>
              </div>
            ) : (
              (() => {
                return Object.entries(seatsByRow)
                  .sort(([rowA], [rowB]) => {
                    const rowATrimmed = rowA.trim()
                    const rowBTrimmed = rowB.trim()

                    // Match logic against frontRows: either exact match "AA" or "102:AA"
                    const isFrontA = frontRows.some((fr) => {
                      if (fr === rowATrimmed) return true
                      if (fr.includes(':')) {
                        const [sec, r] = fr.split(':')
                        return sec.trim() === sectionName.trim() && r.trim() === rowATrimmed
                      }
                      return false
                    })

                    const isFrontB = frontRows.some((fr) => {
                      if (fr === rowBTrimmed) return true
                      if (fr.includes(':')) {
                        const [sec, r] = fr.split(':')
                        return sec.trim() === sectionName.trim() && r.trim() === rowBTrimmed
                      }
                      return false
                    })

                    if (isFrontA && !isFrontB) return -1
                    if (!isFrontA && isFrontB) return 1

                    // Default length + alphabetical sorting
                    const lenDiff = rowA.length - rowB.length
                    if (lenDiff !== 0) return lenDiff
                    return rowA.localeCompare(rowB)
                  })
                  .map(([row, seats]) => {
                    let sortedSeats = seats.sort((a, b) => {
                      const numA =
                        typeof a.seat_number === 'string'
                          ? parseInt(a.seat_number, 10)
                          : a.seat_number
                      const numB =
                        typeof b.seat_number === 'string'
                          ? parseInt(b.seat_number, 10)
                          : b.seat_number
                      return numA - numB
                    })

                    if (isReversed) {
                      sortedSeats = sortedSeats.reverse()
                    }

                    return (
                      <div key={row} className='flex items-center justify-center w-max mx-auto'>
                        {/* Row Label (Left) */}
                        <div className='w-12 shrink-0 text-right font-semibold text-gray-700 mr-3 md:mr-4'>
                          {row}
                        </div>

                        {/* Seats Container */}
                        <div className='flex justify-center items-center shrink-0'>
                          <div className='flex space-x-1'>
                            {sortedSeats.map((seat) => {
                              const seatKey = seat.id.toString()
                              const isSelected = !!selectedSeats[seatKey]
                              const seatType = getSeatType(seat)

                              return (
                                <SeatIcon
                                  key={seat.id}
                                  isAvailable={seat.is_available && !seat.is_sold_out}
                                  isSelected={isSelected}
                                  seatNumber={seat.seat_number}
                                  row={seat.row}
                                  onClick={() => onSeatToggle(seatKey)}
                                  className='hover:scale-110 transition-transform'
                                  stageDirection={stageDirection}
                                  seatType={seatType}
                                />
                              )
                            })}
                          </div>
                        </div>

                        {/* Invisible balancer (Right) to keep seats perfectly centered */}
                        <div
                          className='w-12 shrink-0 ml-3 md:ml-4 opacity-0 pointer-events-none'
                          aria-hidden='true'
                        >
                          {row}
                        </div>
                      </div>
                    )
                  })
              })()
            )}
          </div>
        </div>

        {/* Legend */}
        <div className='px-6 py-3 bg-gray-50 border-t'>
          <div className='flex flex-wrap items-center justify-center gap-4 text-sm text-gray-700'>
            <div className='flex items-center space-x-2'>
              <div className='w-4 h-4 rounded' style={{ backgroundColor: '#3b82f6' }}></div>
              <span>Disponible</span>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='w-4 h-4 rounded' style={{ backgroundColor: '#6b7280' }}></div>
              <span>Ocupado</span>
            </div>
            <div className='flex items-center space-x-2'>
              <div className='w-4 h-4 rounded' style={{ backgroundColor: '#fbbf24' }}></div>
              <span>Tu selección</span>
            </div>
            {typesInSection.has('companion') && (
              <div className='flex items-center space-x-2'>
                <div className='w-4 h-4 rounded' style={{ backgroundColor: '#7C3AED' }}></div>
                <span>Asiento Acompañante</span>
              </div>
            )}
            {typesInSection.has('wheelchair') && (
              <div className='flex items-center space-x-2'>
                <div className='w-4 h-4 rounded' style={{ backgroundColor: '#1D4ED8' }}></div>
                <span>Espacio Silla de Ruedas ♿</span>
              </div>
            )}
            {typesInSection.has('limited_mobility') && (
              <div className='flex items-center space-x-2'>
                <div className='w-4 h-4 rounded' style={{ backgroundColor: '#0D9488' }}></div>
                <span>Movilidad Reducida</span>
              </div>
            )}
            {typesInSection.has('sight_hearing') && (
              <div className='flex items-center space-x-2'>
                <div className='w-4 h-4 rounded' style={{ backgroundColor: '#D97706' }}></div>
                <span>Discapacidad Visual/Auditiva</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className='flex flex-col p-4 border-t bg-gray-50 flex-shrink-0'>
          {selectedTypes.has('wheelchair') && (
            <div className='mb-3 text-sm text-blue-800 bg-blue-50 border border-blue-200 p-2.5 rounded flex items-start gap-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='shrink-0 mt-0.5'
              >
                <circle cx='12' cy='12' r='10' />
                <path d='M12 16v-4' />
                <path d='M12 8h.01' />
              </svg>
              <span>
                <strong>Atención — Silla de Ruedas:</strong> Este espacio no incluye una butaca
                física. Es un espacio libre asignado para silla de ruedas ♿.
              </span>
            </div>
          )}
          {selectedTypes.has('companion') && (
            <div className='mb-3 text-sm text-purple-800 bg-purple-50 border border-purple-200 p-2.5 rounded flex items-start gap-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='shrink-0 mt-0.5'
              >
                <path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2' />
                <circle cx='9' cy='7' r='4' />
                <path d='M23 21v-2a4 4 0 0 0-3-3.87' />
                <path d='M16 3.13a4 4 0 0 1 0 7.75' />
              </svg>
              <span>
                <strong>Asiento Acompañante:</strong> Este asiento está designado para acompañantes
                de personas con movilidad reducida.
              </span>
            </div>
          )}
          {selectedTypes.has('limited_mobility') && (
            <div className='mb-3 text-sm text-teal-800 bg-teal-50 border border-teal-200 p-2.5 rounded flex items-start gap-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='shrink-0 mt-0.5'
              >
                <circle cx='12' cy='12' r='10' />
                <path d='M12 16v-4' />
                <path d='M12 8h.01' />
              </svg>
              <span>
                <strong>Movilidad Reducida:</strong> Asiento con butaca física, habilitado para
                personas con movilidad reducida (sin silla de ruedas).
              </span>
            </div>
          )}
          {selectedTypes.has('sight_hearing') && (
            <div className='mb-3 text-sm text-amber-800 bg-amber-50 border border-amber-200 p-2.5 rounded flex items-start gap-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='shrink-0 mt-0.5'
              >
                <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
                <circle cx='12' cy='12' r='3' />
              </svg>
              <span>
                <strong>Discapacidad Visual/Auditiva:</strong> Asiento designado para personas con
                discapacidad visual o auditiva.
              </span>
            </div>
          )}
          <div className='flex items-center justify-between'>
            <div className='text-sm text-gray-700 space-y-1'>
              <div>
                Selected seats: <span className='font-semibold'>{totalSelected}</span>
              </div>
              <div className='text-xs text-gray-600'>
                <span className='mr-3'>
                  Price per seat:{' '}
                  <span className='font-medium'>
                    {perSeatPrices.length <= 1
                      ? formatMoney(perSeatPrices[0] || 0)
                      : `${formatMoney(perSeatPrices[0])} - ${formatMoney(perSeatPrices[perSeatPrices.length - 1])}`}
                  </span>
                </span>
                <span className='mr-3'>
                  Fee per seat:{' '}
                  <span className='font-medium'>
                    {perSeatFees.length <= 1
                      ? formatMoney(perSeatFees[0] || 0)
                      : `${formatMoney(perSeatFees[0])} - ${formatMoney(perSeatFees[perSeatFees.length - 1])}`}
                  </span>
                </span>
                {totalSelected > 0 && (
                  <span>
                    Total:{' '}
                    <span className='font-semibold text-gray-800'>{formatMoney(totalPrice)}</span>
                    {(selectedFeeTotal > 0 || selectedTaxTotal > 0) && (
                      <span className='text-gray-500'>
                        {' '}
                        (Fees: {formatMoney(selectedFeeTotal)}
                        {selectedTaxTotal > 0 && `, Taxes: ${formatMoney(selectedTaxTotal)}`})
                      </span>
                    )}
                  </span>
                )}
              </div>
            </div>
            <div className='flex space-x-3'>
              <button
                onClick={onClose}
                className='px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50'
              >
                Cancel
              </button>
              <button
                onClick={onProceed}
                disabled={totalSelected === 0}
                className={`px-6 py-2 rounded text-white font-medium ${
                  totalSelected === 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                Continue ({totalSelected})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
