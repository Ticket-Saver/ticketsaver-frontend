import { useState } from 'react'
import TicketQR from './TicketQR'

// Función para traducir zonas del español al inglés
function translateZone(zone: string | null | undefined): string {
  if (!zone) return ''

  const zoneLower = zone.toLowerCase()

  // Handle compound zones like "centro-derecha", "centro-izquierda"
  const zoneTranslations: { [key: string]: string } = {
    centro: 'Center',
    'centro-derecha': 'Right Center',
    'centro-izquierda': 'Left Center',
    izquierda: 'Left',
    derecha: 'Right',
    vip: 'VIP',
    general: 'General',
    premium: 'Premium'
  }

  return zoneTranslations[zoneLower] || zone
}

// Función para traducir tipos de precio del español al inglés
function translatePriceType(priceType: string | null | undefined): string {
  if (!priceType) return ''

  const priceTypeLower = priceType.toLowerCase()

  const priceTypeTranslations: { [key: string]: string } = {
    celeste: 'Cyan',
    anaranjado: 'Orange',
    naranja: 'Orange',
    rojo: 'Red',
    azul: 'Blue',
    verde: 'Green',
    amarillo: 'Yellow',
    morado: 'Purple',
    rosa: 'Pink'
  }

  return priceTypeTranslations[priceTypeLower] || priceType
}

function formatEventDate(dateStr?: string) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

export interface EventsClaimConfig {
  eventId: string
  id: string
  title: string
  description: string
  thumbnailURL: string
  date: string
  color?: string
  fontColor?: string
  venue?: string
  city?: string
  route?: string
  ticketDetails?: TicketDetail[]
  publicId?: string
  eventIdNumber?: number
}

interface TicketDetail {
  ticket: string
  zone?: string | null
  section?: string | null
  seatNumber?: string | null
  price: string
  priceType?: string | null
}

function AdditionalInfo({
  details,
  publicId,
  eventIdNumber
}: {
  details: TicketDetail[]
  publicId?: string
  eventIdNumber?: number
}) {
  return (
    <>
      {details.map((detail, index) => {
        // Detectar si es un ticket numerado o general
        const hasSeating = detail.zone || detail.section || detail.seatNumber

        return (
          <div
            key={index}
            className='w-full bg-neutral rounded-xl flex flex-col sm:flex-row mb-4 items-center justify-between'
          >
            <div className='flex flex-col justify-between p-4 py-6 w-full sm:w-2/5'>
              <p className='text-xl font-bold py-3'>Ticket: {detail.ticket}</p>
              <div className='w-full h-[1px] bg-gradient-to-r from-[#E779C1] to-[#221551] my-4'></div>

              {hasSeating ? (
                // Ticket numerado con asiento
                <p className='text-lg'>
                  Zone: {translateZone(detail.zone)}
                  {detail.priceType ? ` ${translatePriceType(detail.priceType)}` : ''} - Seat:{' '}
                  {detail.section}
                  {detail.seatNumber}
                </p>
              ) : (
                // Ticket general sin asiento específico
                <p className='text-lg'>Type: General Admission</p>
              )}
              {/* <p className="text-lg">Price: {detail.price}</p> */}
            </div>
            <div className='flex justify-center items-center p-4 w-full sm:w-1/3'>
              {/* Prefer QR by ticket id; fallback to legacy event/publicId URL if missing */}
              {detail.ticket ? (
                <TicketQR value={detail.ticket} size={100} />
              ) : (
                publicId &&
                eventIdNumber && <TicketQR eventId={eventIdNumber} publicId={publicId} size={100} />
              )}
            </div>
          </div>
        )
      })}
    </>
  )
}

export default function EveClaim({
  title,
  venue,
  thumbnailURL,
  description,
  ticketDetails,
  publicId,
  eventIdNumber,
  date
}: EventsClaimConfig) {
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false)

  const handleViewTicketsClick = () => {
    setShowAdditionalInfo(!showAdditionalInfo)
  }

  return (
    <>
      <div className='w-full bg-neutral rounded-xl flex flex-col sm:flex-row items-center justify-between'>
        <div className='flex flex-col justify-between p-4 py-6 w-full sm:w-2/5'>
          <div className='text-xl sm:text-3xl font-semibold'>{title}</div>
          <div className='w-full h-[1px] bg-gradient-to-r from-[#E779C1] to-[#221551] my-4'></div>
          <div className='text-lg sm:text-xl font-semibold pb-4'>{venue}</div>
          <div className='text-lg sm:text-xl pb-4'>{formatEventDate(date)}</div>
          <div
            className='text-sm sm:text-lg pb-4'
            dangerouslySetInnerHTML={{ __html: description }}
          ></div>
          {ticketDetails && (
            <div onClick={handleViewTicketsClick} className='cursor-pointer mt-4 text-blue-500'>
              {showAdditionalInfo ? '▲ Hide tickets' : '▼ View tickets'}
            </div>
          )}
        </div>
        <div className='w-full sm:w-2/5 flex justify-center items-center p-4'>
          <img
            src={thumbnailURL}
            alt='Event Image'
            className='w-full h-48 sm:h-64 object-cover rounded-xl'
          />
        </div>
      </div>
      {showAdditionalInfo && ticketDetails && (
        <AdditionalInfo details={ticketDetails} publicId={publicId} eventIdNumber={eventIdNumber} />
      )}
    </>
  )
}
