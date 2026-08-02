import { useParams, Link } from 'react-router-dom'
import LayoutV2 from '../../layouts/LayoutV2'
import { Button } from '../../components/ui'
import EventResaleSection from '../../components/v2/resale/EventResaleSection'
import { useUIEvents } from '../../hooks/useUIEvents'

/**
 * Vista de un evento en el marketplace de reventa: cabecera del evento + solo los tickets
 * disponibles en reventa (via EventResaleSection). Ruta /reventa/:eventId.
 */
export default function ResaleEventV2() {
  const { eventId } = useParams<{ eventId: string }>()
  const { byId } = useUIEvents()
  const event = byId(eventId)

  return (
    <LayoutV2 meshSeed={7}>
      <div className='px-5 lg:px-10 max-w-3xl mx-auto w-full pt-6 lg:pt-10 pb-10'>
        <Link to='/reventa' className='text-[13px] text-white/55 hover:text-white'>
          ← Volver a Reventa
        </Link>

        <header className='mt-4 mb-2'>
          <h1 className='font-display text-2xl font-bold text-white'>
            {event?.title ?? 'Reventa de tickets'}
          </h1>
          {event && (
            <p className='text-[13px] text-white/55 mt-1'>
              {event.venueName}
              {event.city ? ` · ${event.city}` : ''}
              {event.isoDate ? ` · ${event.day} ${event.date} ${event.month}` : ''}
            </p>
          )}
        </header>

        {eventId && <EventResaleSection eventId={eventId} showEmpty />}

        {event && (
          <div className='mt-8'>
            <Link to={event.detailHref}>
              <Button variant='ghost' size='sm'>
                Ver evento completo
              </Button>
            </Link>
          </div>
        )}
      </div>
    </LayoutV2>
  )
}
