import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LayoutV2 from '../../layouts/LayoutV2'
import { GlassCard } from '../../components/ui'
import EventCardV2 from '../../components/v2/EventCardV2'
import { useUIEvents } from '../../hooks/useUIEvents'
import { hiEventsService } from '../../services/hiEventsService'
import type { HiResaleEvent } from '../../types/hievents'
import type { UIEvent } from '../../types/uiEvent'

const money = (n: number, currency = 'USD') =>
  new Intl.NumberFormat('es', { style: 'currency', currency }).format(n)

export default function ResaleMarketV2() {
  const navigate = useNavigate()
  const { byId, loading: eventsLoading } = useUIEvents()

  const [resaleEvents, setResaleEvents] = useState<HiResaleEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    hiEventsService
      .getResaleEvents(controller.signal)
      .then((res) => setResaleEvents(res.data ?? []))
      .catch(() => {
        if (!controller.signal.aborted) setResaleEvents([])
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [])

  // Cruza cada evento con reventa contra el catálogo UI para reusar EventCardV2.
  const cards = useMemo(
    () =>
      resaleEvents
        .map((re) => ({ re, ui: byId(String(re.event_id)) }))
        .filter((x): x is { re: HiResaleEvent; ui: UIEvent } => Boolean(x.ui)),
    [resaleEvents, byId]
  )

  const isLoading = loading || eventsLoading

  return (
    <LayoutV2 meshSeed={7}>
      <div className='px-5 lg:px-10 max-w-7xl mx-auto w-full pt-6 lg:pt-10 pb-10'>
        <header className='mb-6'>
          <h1 className='font-display text-2xl lg:text-3xl font-bold text-white'>Reventa</h1>
          <p className='text-[13px] text-white/55 mt-1'>
            Eventos con tickets en reventa. Compra segura: TicketSaver retiene el pago y traspasa el
            ticket.
          </p>
        </header>

        {isLoading ? (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {Array.from({ length: 4 }).map((_, i) => (
              <GlassCard key={i} depth='sm' radius='lg' className='h-64 animate-pulse' />
            ))}
          </div>
        ) : cards.length === 0 ? (
          <GlassCard depth='sm' radius='lg' className='p-10 text-center text-white/60'>
            Ahora mismo no hay tickets en reventa. Vuelve pronto.
          </GlassCard>
        ) : (
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {cards.map(({ re, ui }) => (
              <div key={re.event_id} className='relative'>
                <EventCardV2
                  event={ui}
                  variant='poster'
                  onClick={() => navigate(`/reventa/${re.event_id}`)}
                />
                <div className='mt-2 flex items-center justify-between text-[12px]'>
                  <span className='text-white/70'>
                    {re.listing_count} {re.listing_count === 1 ? 'ticket' : 'tickets'} en reventa
                  </span>
                  <span className='text-white font-medium'>
                    desde {money(re.min_price, re.currency)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </LayoutV2>
  )
}
