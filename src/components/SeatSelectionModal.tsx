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
  eventId
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
  const selectedSeatItems = allSeats.filter(seat => selectedIds.includes(seat.id.toString()))

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
    setZoomLevel(prev => Math.min(prev + 0.1, 2.5))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5))
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

      setPanOffset(prev => ({
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
      setZoomLevel(prev => Math.min(prev + zoomFactor, 2.5))
    } else {
      setZoomLevel(prev => Math.max(prev - zoomFactor, 0.5))
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Select Seats - {sectionName}</h2>
            <p className="text-sm text-gray-600">Click on available seats to select them</p>
          </div>
          <div className="flex items-center space-x-2">
            {/* Zoom Controls */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
                className="px-2 py-1 text-sm bg-white rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Zoom Out"
              >
                −
              </button>
              <span className="px-2 py-1 text-sm text-gray-600 min-w-[3rem] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 2.5}
                className="px-2 py-1 text-sm bg-white rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Zoom In"
              >
                +
              </button>
              <button
                onClick={handleResetZoom}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                title="Reset Zoom"
              >
                Reset
              </button>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
              ×
            </button>
          </div>
        </div>

        {/* Seating Map */}
        <div
          className="p-6 overflow-auto max-h-[60vh] relative flex items-center justify-center"
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
            {(() => {
              const maxSeatsPerRow = Math.max(
                ...Object.values(seatsByRow).map(seats => seats.length)
              )

              return Object.entries(seatsByRow)
                .sort(([rowA], [rowB]) => rowA.localeCompare(rowB))
                .map(([row, seats]) => {
                  const sortedSeats = seats.sort((a, b) => {
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

                  return (
                    <div key={row} className="flex items-center justify-center w-full">
                      {/* Row Label */}
                      <div className="w-12 text-center font-semibold text-gray-700 mr-4">{row}</div>

                      {/* Seats Container */}
                      <div
                        className="flex justify-center items-center"
                        style={{
                          width: `${maxSeatsPerRow * 48}px`,
                          minWidth: '200px'
                        }}
                      >
                        <div className="flex space-x-1">
                          {sortedSeats.map(seat => {
                            const seatKey = seat.id.toString()
                            const isSelected = !!selectedSeats[seatKey]

                            return (
                              <SeatIcon
                                key={seat.id}
                                isAvailable={seat.is_available && !seat.is_sold_out}
                                isSelected={isSelected}
                                seatNumber={seat.seat_number}
                                row={seat.row}
                                onClick={() => onSeatToggle(seatKey)}
                                className="hover:scale-110 transition-transform"
                                stageDirection={stageDirection}
                              />
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )
                })
            })()}
          </div>
        </div>

        {/* Legend */}
        <div className="px-6 py-3 bg-gray-50 border-t">
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-700">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-gray-700">Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-500 rounded"></div>
              <span className="text-gray-700">Occupied</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-gray-700">Your Selection</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <div className="text-sm text-gray-700 space-y-1">
            <div>
              Selected seats: <span className="font-semibold">{totalSelected}</span>
            </div>
            <div className="text-xs text-gray-600">
              <span className="mr-3">
                Price per seat:{' '}
                <span className="font-medium">
                  {perSeatPrices.length <= 1
                    ? formatMoney(perSeatPrices[0] || 0)
                    : `${formatMoney(perSeatPrices[0])} - ${formatMoney(perSeatPrices[perSeatPrices.length - 1])}`}
                </span>
              </span>
              <span className="mr-3">
                Fee per seat:{' '}
                <span className="font-medium">
                  {perSeatFees.length <= 1
                    ? formatMoney(perSeatFees[0] || 0)
                    : `${formatMoney(perSeatFees[0])} - ${formatMoney(perSeatFees[perSeatFees.length - 1])}`}
                </span>
              </span>
              {totalSelected > 0 && (
                <span>
                  Total: <span className="font-semibold text-gray-800">{formatMoney(totalPrice)}</span>
                  {(selectedFeeTotal > 0 || selectedTaxTotal > 0) && (
                    <span className="text-gray-500">
                      {' '}
                      (Fees: {formatMoney(selectedFeeTotal)}
                      {selectedTaxTotal > 0 && `, Taxes: ${formatMoney(selectedTaxTotal)}`})
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
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
  )
}
