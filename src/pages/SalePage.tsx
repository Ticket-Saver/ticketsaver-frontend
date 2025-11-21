import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import TicketSelectionSeat from './TicketEventSale'
import TicketSelectionNoSeat from './TicketEventSaleNoSeats'
import GeneralAdmissionTickets from './GeneralAdmissionTickets'
import { API_URLS } from '../config/api'

interface EventTicket {
  id: number
  title: string
  type: string
  description?: string
  is_available: boolean
  is_sold_out: boolean
  prices?: Array<{
    id: number
    price: number
    price_including_taxes_and_fees: number
    tax_total: number
    fee_total: number
  }>
}

export default function SalePage() {
  const {
    name,
    venue,
    location,
    date,
    label,
    delete: deleteParam
  } = useParams<{
    name: string
    venue: string
    location: string
    date: string
    label: string
    delete?: string
  }>()

  console.log('DEBUG - SalePage - Parámetros extraídos:', {
    name,
    venue,
    location,
    date,
    label,
    deleteParam
  })

  const [venues, setVenue] = useState<{
    seatmap: boolean
    venue_name?: string
    location: { city: string }
  } | null>(null)
  const [eventStartDate, setEventStartDate] = useState<string | null>(null)
  const [eventTimeZone, setEventTimeZone] = useState<string | null>(null)
  const [displayDate, setDisplayDate] = useState<string | null>(null)
  const [tipoticket, setTipoticket] = useState<'enumerado' | 'general' | null>(null)
  const [eventTickets, setEventTickets] = useState<EventTicket[]>([])
  const [bannerImageUrl, setBannerImageUrl] = useState<string | null>(null)
  const githubApiUrl = `${import.meta.env.VITE_GITHUB_API_URL as string}/venues.json`
  const token = import.meta.env.VITE_GITHUB_TOKEN
  const token2 = import.meta.env.VITE_TOKEN_HIEVENTS

  useEffect(() => {
    const fetchVenues = async () => {
      const storedVenues = localStorage.getItem('Venues')
      localStorage.removeItem('Venues')

      if (storedVenues) {
        setVenue(JSON.parse(storedVenues))
      } else {
        try {
          // Primero intentamos obtener el tipoticket del nuevo endpoint
          try {
            const publicEventUrl = API_URLS.getPublicEvent(venue!)
            const publicEventResponse = await fetch(publicEventUrl, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token2}`,
                'Content-Type': 'application/json'
              }
            })

            if (publicEventResponse.ok) {
              const publicEventData = await publicEventResponse.json()
              const eventData = publicEventData.data || publicEventData

              // Imagen de banner del evento (EVENT_BANNER)
              if (eventData.images && Array.isArray(eventData.images)) {
                const bannerImage = eventData.images.find(
                  (img: { type?: string }) => img.type === 'EVENT_BANNER'
                )
                if (bannerImage?.url) {
                  setBannerImageUrl(bannerImage.url)
                }
              }

              // Guardar timezone y fecha de inicio del evento para mostrar la fecha formateada
              const timeZone =
                (eventData && (eventData.timezone || eventData.settings?.timezone)) || null
              setEventTimeZone(timeZone)

              if (eventData.start_date) {
                setEventStartDate(eventData.start_date)

                const dateTime = new Date(eventData.start_date)
                const formatter = new Intl.DateTimeFormat('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  timeZone: timeZone || 'UTC'
                })

                setDisplayDate(formatter.format(dateTime))
              } else if (date) {
                // Fallback si no viene start_date: usar el parámetro de la URL
                const fallbackFormatter = new Intl.DateTimeFormat('en-GB', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })
                setDisplayDate(fallbackFormatter.format(new Date(date)))
              }

              // Establecer el tipoticket desde la API
              if (eventData.tipoticket) {
                setTipoticket(eventData.tipoticket)
                console.log('✅ tipoticket detectado:', eventData.tipoticket)
              }

              // Si es general y tiene tickets, guardarlos
              if (eventData.tipoticket === 'general' && eventData.tickets) {
                setEventTickets(eventData.tickets)
                console.log('✅ tickets cargados desde evento:', eventData.tickets)
              }
            }
          } catch (err) {
            console.warn('No se pudo obtener tipoticket desde API:', err)
          }

          const response = await fetch(githubApiUrl, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/vnd.github.v3.raw'
            }
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const data = await response.json()
          const matchingVenue = data[venue!]
          if (!matchingVenue) {
            const localResponse = await fetch(API_URLS.getEventSettings(venue!), {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${token2}`,
                'Content-Type': 'application/json'
              }
            })

            if (!localResponse.ok) {
              throw new Error(`Error en la respuesta local`)
            }

            const localData = await localResponse.json()

            const matchingVenue = {
              capacity: localData.data.capacity || 1000,
              location: {
                address: localData.data.location_details?.address || '',
                city: localData.data.location_details?.city || '',
                country: localData.data.location_details?.country || 'United States',
                maps_url: localData.data.location_details?.maps_url || '',
                zip_code: localData.data.location_details?.zip_code || ''
              },
              // seatmap: hasSeatmap,
              seatmap: false,
              venue_label: localData.data.venue_label || venue,
              venue_name: localData.data.location_details?.venue_name || localData.data.title
            }
            setVenue(matchingVenue)
          } else {
            setVenue(matchingVenue)
          }
        } catch (error) {
          console.error('Error fetching data: ', error)
        }
      }
    }
    fetchVenues()
  }, [venue, githubApiUrl, token, token2])

  console.log('venue', venue)
  console.log('tipoticket', tipoticket)

  // Pasar todos los parámetros a los componentes hijos
  const routeParams = {
    name,
    venue,
    date,
    location,
    label,
    delete: deleteParam,
    // Fecha amigable para mostrar en las pantallas de venta
    displayDate: displayDate || date,
    // Imagen de banner del evento
    bannerImageUrl: bannerImageUrl || undefined
  }

  console.log('DEBUG - SalePage - routeParams a pasar:', routeParams)

  // Decidir qué componente renderizar basado en tipoticket
  const renderTicketComponent = () => {
    // Si tipoticket está definido, usarlo como prioridad
    if (tipoticket === 'general') {
      return <GeneralAdmissionTickets routeParams={routeParams} preloadedTickets={eventTickets} />
    }

    if (tipoticket === 'enumerado') {
      // Para enumerado, seguir la lógica anterior con seatmap
      return venues?.seatmap ? (
        <TicketSelectionSeat routeParams={routeParams} />
      ) : (
        <TicketSelectionNoSeat routeParams={routeParams} />
      )
    }

    // Fallback: usar la lógica antigua si no hay tipoticket
    return venues?.seatmap ? (
      <TicketSelectionSeat routeParams={routeParams} />
    ) : (
      <TicketSelectionNoSeat routeParams={routeParams} />
    )
  }

  return <>{renderTicketComponent()}</>
}
