import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import LayoutV2 from '../../layouts/LayoutV2'
import TicketCard from '../../components/v2/ticket/TicketCard'
import AppleWalletButton from '../../components/v2/ticket/AppleWalletButton'
import GoogleWalletButton from '../../components/v2/ticket/GoogleWalletButton'
import { Button, GlassCard } from '../../components/ui'
import { useUIEvents } from '../../hooks/useUIEvents'
import { hiEventsService } from '../../services/hiEventsService'
import { hiEventToUIEvent } from '../../services/hiEventsAdapter'
import { coverHash, coverSeed } from '../../lib/covers/coverHash'
import type { HiAttendee } from '../../types/hievents'
import type { UIEvent } from '../../types/uiEvent'

/**
 * TicketPublicV2 — ticketera pública (SIN login). Es el destino del botón
 * "View Ticket" del mail de HiEvents y del QR.
 *
 * Ruta: /ticket/:eventId/:publicId  (eventId numérico de HiEvents,
 * publicId = "A-XXXXXXX"). Trae el attendee por public_id
 * (GET /events/{id}/attendees/{publicId}) y el evento (del listado o por API)
 * → muestra UNA TicketCard con el QR REAL (el public_id, el mismo string que
 * escanea el check-in de HiEvents).
 */
export default function TicketPublicV2() {
  const navigate = useNavigate()
  const { eventId, publicId } = useParams<{ eventId: string; publicId: string }>()
  const { byId } = useUIEvents()

  const [attendee, setAttendee] = useState<HiAttendee | null>(null)
  const [fetchedEvent, setFetchedEvent] = useState<UIEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const ranRef = useRef(false)

  useEffect(() => {
    if (ranRef.current) return
    ranRef.current = true
    ;(async () => {
      try {
        if (!eventId || !publicId) throw new Error('Falta el identificador del ticket.')
        const att = await hiEventsService.getAttendee(eventId, publicId)
        setAttendee(att)
        // El evento: si no está en el listado (pantalla abierta desde el mail),
        // lo traemos por API y lo adaptamos.
        if (!byId(eventId)) {
          try {
            const hi = await hiEventsService.getEvent(eventId)
            setFetchedEvent(hiEventToUIEvent(hi))
          } catch {
            // Sin evento igual mostramos el ticket (datos mínimos).
          }
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'No encontramos el ticket.')
      } finally {
        setLoading(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId, publicId])

  if (loading) {
    return (
      <LayoutV2 hideHeader hideFooter meshSeed={6}>
        <div className='min-h-[60vh] grid place-items-center px-4 text-center'>
          <div>
            <span className='mx-auto block h-9 w-9 rounded-full border-2 border-white/15 border-t-brand-hi animate-spin' />
            <p className='mt-4 text-sm text-white/70'>Cargando tu ticket…</p>
          </div>
        </div>
      </LayoutV2>
    )
  }

  if (error || !attendee) {
    return (
      <LayoutV2 hideHeader hideFooter meshSeed={6}>
        <div className='min-h-[60vh] grid place-items-center px-4'>
          <GlassCard depth='md' radius='lg' className='max-w-md p-8 text-center'>
            <div className='font-display text-base font-semibold text-white'>
              No encontramos el ticket
            </div>
            <p className='mt-2 text-sm text-white/55'>
              {error ?? 'El enlace puede haber expirado o ser incorrecto.'}
            </p>
            <Button variant='primary' size='md' className='mt-4' onClick={() => navigate('/')}>
              Ir al inicio
            </Button>
          </GlassCard>
        </div>
      </LayoutV2>
    )
  }

  const seatInfo = {
    section: attendee.ticket?.section ?? undefined,
    row: attendee.ticket?.row ?? undefined,
    seat: attendee.ticket?.seat_number ?? undefined
  }
  const holder = `${attendee.first_name ?? ''} ${attendee.last_name ?? ''}`.trim()

  // Evento del listado o traído por API; si ninguno, un mínimo para que la card
  // renderice (caso muy raro).
  const displayEvent: UIEvent = byId(eventId) ??
    fetchedEvent ?? {
      id: String(eventId),
      eventId: String(eventId),
      title: attendee.ticket?.title ?? 'Ticket',
      subtitle: '',
      category: 'Music',
      isoDate: '',
      day: 'SAT',
      date: 1,
      month: 'JAN',
      year: 2026,
      time: '',
      startsAt: new Date(),
      venueLabel: '',
      venueName: '',
      city: '',
      country: '',
      cover: coverHash(String(eventId)),
      priceFrom: null,
      availability: 'available',
      tags: [],
      hero: false,
      isExternal: false,
      hidden: false,
      expired: false,
      requiresQueue: false,
      detailHref: '',
      raw: {
        eventId: String(eventId),
        event_date: '',
        event_hour: '',
        event_name: attendee.ticket?.title ?? '',
        venue_label: '',
        event_label: String(eventId),
        event_deleted_at: null,
        sale_starts_at: '',
        tricket_url: ''
      }
    }

  return (
    <LayoutV2 hideHeader hideFooter meshSeed={(coverSeed(String(eventId)) % 8) + 4}>
      <header className='sticky top-0 z-30 backdrop-blur-glass-strong border-b border-white/[0.08] bg-[#0A0A0C]/55'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 h-14 flex items-center justify-between'>
          <button
            type='button'
            onClick={() => navigate('/')}
            className='inline-flex items-center gap-2 text-white/75 hover:text-white text-[12px] font-display'
          >
            TicketSaver
          </button>
          <div className='font-display text-[11px] uppercase tracking-[0.18em] text-brand-hi font-semibold'>
            Your ticket
          </div>
          <span className='w-16' />
        </div>
      </header>

      <main className='mx-auto max-w-md px-5 pb-12 pt-7'>
        <div className='text-center mb-6'>
          <h1 className='font-display text-2xl font-bold text-white tracking-tight'>
            {displayEvent.title}
          </h1>
          {holder && <p className='mt-1 text-sm text-white/60'>{holder}</p>}
        </div>

        <TicketCard
          event={displayEvent}
          variant='hero'
          seatInfo={seatInfo}
          qrValue={attendee.public_id}
        />

        <div className='mt-4 space-y-2.5'>
          <AppleWalletButton
            payload={{
              ticketId: attendee.public_id,
              eventLabel: displayEvent.id,
              eventName: displayEvent.title,
              venueName: displayEvent.venueName,
              date: displayEvent.isoDate,
              time: displayEvent.time,
              seatInfo
            }}
          />
          <GoogleWalletButton
            payload={{
              ticketId: attendee.public_id,
              eventLabel: displayEvent.id,
              eventName: displayEvent.title,
              venueName: displayEvent.venueName,
              date: displayEvent.isoDate,
              time: displayEvent.time,
              seatInfo
            }}
          />
        </div>

        <p className='mt-4 text-center text-[11px] text-white/45'>
          Presentá este código QR en la entrada del evento.
        </p>
      </main>
    </LayoutV2>
  )
}
