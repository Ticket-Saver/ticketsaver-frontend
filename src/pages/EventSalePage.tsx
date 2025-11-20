import { Link, useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchGitHubImage } from '../components/Utils/FetchDataJson'

interface EventSettings {
  data?: {
    location_details?: {
      address_line_1?: string
      city?: string
      country?: string
    }
    maps_url?: string
  }
  is_online_event?: boolean
  location_details?: {
    address_line_1?: string
    city?: string
    country?: string
  }
}

interface EventTicket {
  id: number
  title: string
  type: string
  description?: string
  prices?: Array<{
    id: number
    price: number
    price_including_taxes_and_fees: number
    tax_total: number
    fee_total: number
  }>
}

import { Skeleton } from '../components/Skeleton'
import { API_URLS } from '../config/api'

export default function EventPage() {
  const navigate = useNavigate()
  const { venue, name, date, label, delete: deleteParam } = useParams()

  const [venues, setVenue] = useState<null | {
    capacity: number
    location: {
      address: string
      city: string
      country: string
      maps_url: string
      zip_code: string
    }
    seatmap: boolean
    venue_label: string
    venue_name: string
  }>(null)
  const [description, setDescription] = useState<string>('')
  const [image, setImage] = useState<string>('')
  const [galleryImages, setGalleryImages] = useState<Array<{ url: string; file_name: string }>>([])
  const [hour, setHour] = useState<string>('')

  const [isOnlineEvent, setIsOnlineEvent] = useState<boolean>(false)
  const [eventSettings, setEventSettings] = useState<EventSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [availability, setAvailability] = useState<
    | {
        total: number
        available: number
        sold_out: number
      }
    | {
        has_availability: boolean
      }
    | null
  >(null)
  const [tipoticket, setTipoticket] = useState<string | null>(null)
  const [eventTickets, setEventTickets] = useState<EventTicket[]>([])

  const token2 = import.meta.env.VITE_TOKEN_HIEVENTS

  // Una sola llamada API al endpoint público
  useEffect(() => {
    if (deleteParam === 'delete') {
      navigate('/')
      return
    }

    const currentDate = new Date()
    const endDate = date ? new Date(date) : new Date()
    endDate.setDate(endDate.getDate() + 2)

    if (currentDate.getTime() > endDate.getTime()) {
      navigate('/')
      return
    }

    if (!venue || !label) return

    const fetchAllEventData = async () => {
      setIsLoading(true)

      try {
        // UNA SOLA LLAMADA: GET /api/public/events/{venue}/
        const publicEventUrl = API_URLS.getPublicEvent(venue)
        console.log('🔍 Fetching from:', publicEventUrl)

        const response = await fetch(publicEventUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token2}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch event: ${response.status}`)
        }

        const result = await response.json()
        console.log('📦 Complete event data:', result)

        const eventData = result.data || result

        // Extraer tipoticket
        if (eventData?.tipoticket) {
          setTipoticket(eventData.tipoticket)
          console.log('✅ tipoticket:', eventData.tipoticket)
        }

        // Extraer tickets para eventos generales
        if (eventData?.tickets && Array.isArray(eventData.tickets)) {
          setEventTickets(eventData.tickets)
          console.log('✅ tickets:', eventData.tickets)
        }

        // Extraer availability
        setAvailability(eventData?.availability || null)

        // Extraer hora del evento
        if (eventData?.start_date) {
          const dateTime = new Date(eventData.start_date)
          const hourValue = dateTime.getHours().toString().padStart(2, '0')
          setHour(`${hourValue}:00`)
        }

        // Extraer descripción
        if (eventData?.description) {
          setDescription(
            eventData.description.replace(/<\/?[^>]+(>|$)/g, '') || 'No hay descripción disponible'
          )
        }

        // Extraer tipo de mapa
        const hasSeatmap = eventData?.map === 'map1' || eventData?.map === 'map2'

        // Extraer imágenes (banner, thumbnail y gallery)
        let hasMainImage = false
        if (eventData?.images && Array.isArray(eventData.images)) {
          // Prioridad: EVENT_BANNER > EVENT_THUMBNAIL para la imagen principal
          const bannerImage = eventData.images.find(
            (img: { type: string; url: string }) => img.type === 'EVENT_BANNER'
          )
          const thumbnailImage = eventData.images.find(
            (img: { type: string; url: string }) => img.type === 'EVENT_THUMBNAIL'
          )

          // Usar BANNER primero, si no existe usar THUMBNAIL
          const mainImage = bannerImage || thumbnailImage
          if (mainImage) {
            setImage(mainImage.url)
            hasMainImage = true
            console.log('🎨 Main image set:', mainImage.type, mainImage.url)
          }

          // Extraer imágenes de galería del array 'gallery' o de images con tipo EVENT_GALLERY
          const galleryFromImages = eventData.images.filter(
            (img: { type: string; url: string; file_name: string }) => img.type === 'EVENT_GALLERY'
          )

          const galleryFromArray =
            eventData.gallery && Array.isArray(eventData.gallery) ? eventData.gallery : []

          const allGalleryImages = [...galleryFromImages, ...galleryFromArray]

          if (allGalleryImages.length > 0) {
            setGalleryImages(
              allGalleryImages.map((img: { url: string; file_name: string }) => ({
                url: img.url,
                file_name: img.file_name
              }))
            )
            console.log('🖼️  Gallery images set:', allGalleryImages.length)
          }
        }

        // Fallback para imágenes si no se obtuvieron del endpoint
        if (!hasMainImage && label) {
          console.log('⚠️  No image from API, trying GitHub fallback...')
          try {
            const githubImage = await fetchGitHubImage(label)
            setImage(githubImage)
            console.log('✅ Image loaded from GitHub')
          } catch (e) {
            console.warn('❌ Could not load fallback image:', e)
          }
        }

        // Extraer información de venue y location
        const venueData = eventData.venue || eventData
        const locationData = eventData.location_details || venueData.location_details || {}

        const matchingVenue = {
          capacity: eventData.capacity || 1000,
          location: {
            address: locationData.address_line_1 || locationData.address || '',
            city: locationData.city || '',
            country: locationData.country || 'United States',
            maps_url: locationData.maps_url || eventData.maps_url || '',
            zip_code: locationData.zip_code || ''
          },
          seatmap: hasSeatmap,
          venue_label: venueData.venue_label || venue,
          venue_name: venueData.venue_name || locationData.venue_name || eventData.title || venue
        }
        setVenue(matchingVenue)

        // Configurar event settings (para online events)
        setIsOnlineEvent(eventData?.is_online_event || false)
        setEventSettings({
          data: eventData,
          is_online_event: eventData?.is_online_event || false
        })

        console.log('✅ Event loaded successfully')
      } catch (error) {
        console.error('❌ Error loading event:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllEventData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [venue, date, deleteParam])

  // Sales are always active - no date restrictions
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative h-[80vh] bg-black">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10" />
          {isLoading ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <img
              src={image}
              alt="Event Cover"
              className="w-full h-full object-cover object-center"
            />
          )}
        </div>

        {/* Content Container */}
        <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-full items-end pb-16">
            <div className="flex flex-col md:flex-row gap-8 items-end w-full">
              {/* Event Info */}
              <div className="flex-1 space-y-4">
                {isLoading ? (
                  <>
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-20 w-full max-w-2xl" />
                    <Skeleton className="h-8 w-96" />
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-white/90">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                      <span className="text-lg font-medium">
                        {venues?.venue_name}, {venues?.location.city}
                      </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                      {name}
                    </h1>

                    <div className="flex items-center gap-2 text-white/90">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        />
                      </svg>
                      <span className="text-lg">
                        {new Date(date!).toLocaleDateString('en-GB', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}{' '}
                        - {hour} hrs
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Availability Card */}
              <div className="w-full md:w-96 bg-white rounded-xl shadow-2xl p-6 transform transition-all duration-300 hover:scale-[1.02]">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : (
                  <>
                    {/* Título dinámico según tipo de ticket */}
                    {tipoticket === 'general' && eventTickets.length > 0 ? (
                      <h2 className="text-xl font-bold text-gray-900 mb-6">Ticket Prices</h2>
                    ) : (
                      availability &&
                      'available' in availability &&
                      typeof availability.available === 'number' && (
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Availability</h2>
                      )
                    )}

                    <div className="space-y-4">
                      {/* Mostrar precios para eventos generales */}
                      {tipoticket === 'general' && eventTickets.length > 0 ? (
                        <div className="space-y-3">
                          {eventTickets.map(ticket => {
                            const price = ticket.prices?.[0]
                            if (!price) return null

                            return (
                              <div
                                key={ticket.id}
                                className="flex justify-between items-center py-3 border-b border-gray-100"
                              >
                                <div className="flex-1">
                                  <p className="text-gray-900 font-semibold">{ticket.title}</p>
                                  {ticket.description && (
                                    <p className="text-sm text-gray-600">{ticket.description}</p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-blue-600">
                                    ${price.price_including_taxes_and_fees?.toFixed(2)}
                                  </p>
                                  {/* <p className="text-xs text-gray-500">
                                    Base: ${price.price?.toFixed(2)}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    + Tax: ${price.tax_total?.toFixed(2)} + Fee: $
                                    {price.fee_total?.toFixed(2)}
                                  </p> */}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        /* Mostrar números solo si availability tiene la estructura completa */
                        availability &&
                        'available' in availability &&
                        typeof availability.available === 'number' && (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                              <p className="text-gray-700">Available</p>
                              <span className="text-xl font-bold text-green-700">
                                {availability.available}
                              </span>
                            </div>
                          </div>
                        )
                      )}

                      <div className="flex justify-center">
                        {
                          // Determinar si el botón debe estar habilitado
                          // Deshabilitado solo si has_availability es explícitamente false
                        }
                        {(() => {
                          const isDisabled =
                            availability &&
                            'has_availability' in availability &&
                            availability.has_availability === false

                          const buttonClasses = isDisabled
                            ? 'px-8 py-3 rounded-lg text-center font-semibold transition-all bg-gray-400 cursor-not-allowed text-white'
                            : 'px-8 py-3 rounded-lg text-center font-semibold transition-all bg-blue-600 hover:bg-blue-700 text-white'

                          if (isDisabled) {
                            return (
                              <button disabled className={buttonClasses}>
                                Sold Out
                              </button>
                            )
                          }

                          return (
                            <Link
                              to={`/sale/${name}/${venue}/${venues?.location?.city || 'unknown'}/${date}/${label}/${deleteParam}`}
                              state={{
                                eventName: name,
                                eventHour: hour,
                                eventDescription: description,
                                venueName: venues?.venue_name,
                                venueCity: venues?.location.city
                              }}
                              className={buttonClasses}
                            >
                              Buy Tickets
                            </Link>
                          )
                        })()}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the content */}
      <div className="w-full bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          {/* Event Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Event Details */}
            {isLoading ? (
              <>
                <div className="space-y-8">
                  <Skeleton className="h-64 w-full rounded-xl" />
                  <Skeleton className="h-96 w-full rounded-xl" />
                </div>
                <div className="space-y-8">
                  <Skeleton className="h-[600px] w-full rounded-xl" />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-8">
                  <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <h2 className="text-2xl font-bold text-gray-900">Date & Time</h2>
                    </div>
                    <p className="text-lg text-gray-700">
                      {new Date(date!).toLocaleDateString('en-GB', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        timeZone: 'UTC'
                      })}
                    </p>
                    <p className="text-lg text-gray-700">{hour} hrs</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <h2 className="text-2xl font-bold text-gray-900">About the Event</h2>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{description}</p>
                  </div>
                </div>
              </>
            )}

            {/* Right Column - Location */}
            {isLoading ? (
              <div className="space-y-8">
                <Skeleton className="h-[600px] w-full rounded-xl" />
              </div>
            ) : (
              <div className="space-y-8">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-900">Location</h2>
                  </div>
                  {isOnlineEvent ? (
                    <div className="text-center py-8">
                      <svg
                        className="w-16 h-16 text-blue-600 mx-auto mb-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-xl text-gray-700">This is an online event</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-gray-700">
                          <span className="font-semibold">Address:</span>{' '}
                          {eventSettings?.data?.location_details?.address_line_1}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">City:</span>{' '}
                          {eventSettings?.data?.location_details?.city}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">Country:</span>{' '}
                          {eventSettings?.data?.location_details?.country}
                        </p>
                      </div>
                      <div className="rounded-lg overflow-hidden shadow-md">
                        <iframe
                          className="w-full h-[400px]"
                          src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyDUv83_obzUR6e7lPMmt6kgVGzs67IwWhA&q=${encodeURIComponent(
                            eventSettings?.data?.location_details?.address_line_1 || ''
                          )},${encodeURIComponent(eventSettings?.data?.location_details?.city || '')},${encodeURIComponent(
                            eventSettings?.data?.location_details?.country || ''
                          )}`}
                          allowFullScreen
                          loading="lazy"
                        />
                      </div>
                      <a
                        href={eventSettings?.data?.maps_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                      >
                        <span>View on Google Maps</span>
                        <svg
                          className="w-4 h-4 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Event Gallery */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Event Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {isLoading
                ? Array(4)
                    .fill(0)
                    .map((_, index) => (
                      <Skeleton key={index} className="aspect-w-16 aspect-h-9 rounded-xl" />
                    ))
                : galleryImages.length > 0
                  ? galleryImages.map((galleryImage, index) => (
                      <div
                        key={index}
                        className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                      >
                        <img
                          src={galleryImage.url}
                          alt={galleryImage.file_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))
                  : [1, 2, 3, 4].map(index => (
                      <div
                        key={index}
                        className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                      >
                        <img
                          src={image}
                          alt={`Event image ${index}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
