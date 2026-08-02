import { useEffect, useState } from 'react'
import { Button, GlassCard, useToast } from '../../../components/ui'
import Drawer from '../../../components/ui/Drawer'
import { hiEventsService } from '../../../services/hiEventsService'
import { useUserTickets } from '../../../hooks/useUserTickets'
import { useMyResaleListings } from '../../../hooks/useMyResaleListings'
import type {
  HiEventPublic,
  HiResaleFees,
  HiUserTicket,
  HiUserTicketsEvent
} from '../../../types/hievents'

interface ResellTarget {
  event: HiUserTicketsEvent
  ticket: HiUserTicket
}

const money = (n: number, currency = 'USD') =>
  new Intl.NumberFormat('es', { style: 'currency', currency }).format(n)

export default function ResalesV2() {
  const { events, loading: ticketsLoading, refresh: refreshTickets } = useUserTickets()
  const { listings, loading: listingsLoading, refresh: refreshListings } = useMyResaleListings()
  const toast = useToast()

  const [target, setTarget] = useState<ResellTarget | null>(null)

  // Detalle público por evento (resale_enabled + start_date) para gatear el botón "Revender".
  // Un fetch por evento distinto, no por ticket — /customer-auth/my-tickets no trae estos campos.
  const [eventDetails, setEventDetails] = useState<Record<number, HiEventPublic>>({})

  useEffect(() => {
    const ids = Array.from(new Set(events.map((e) => e.eventIdNumber)))
    const missing = ids.filter((id) => !(id in eventDetails))
    if (missing.length === 0) return
    let active = true
    Promise.all(missing.map((id) => hiEventsService.getEvent(id).catch(() => null))).then(
      (results) => {
        if (!active) return
        setEventDetails((prev) => {
          const next = { ...prev }
          missing.forEach((id, i) => {
            const ev = results[i]
            if (ev) next[id] = ev
          })
          return next
        })
      }
    )
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events])

  const onListed = () => {
    setTarget(null)
    refreshTickets()
    refreshListings()
  }

  const cancel = async (listingId: number) => {
    try {
      await hiEventsService.cancelResaleListing(listingId)
      toast.show({
        variant: 'success',
        message: 'Listado cancelado. Tu ticket vuelve a estar activo.'
      })
      refreshTickets()
      refreshListings()
    } catch (e) {
      toast.show({
        variant: 'error',
        message: e instanceof Error ? e.message : 'No se pudo cancelar.'
      })
    }
  }

  const loading = ticketsLoading || listingsLoading

  return (
    <div className='flex flex-col gap-6'>
      {/* Listados activos */}
      <section>
        <h2 className='font-display text-lg font-semibold text-white mb-3'>Mis reventas activas</h2>
        {loading ? (
          <GlassCard depth='sm' radius='lg' className='p-6 text-center text-white/60'>
            Cargando…
          </GlassCard>
        ) : listings.length === 0 ? (
          <GlassCard depth='sm' radius='lg' className='p-6 text-center text-white/60'>
            No tienes tickets en reventa.
          </GlassCard>
        ) : (
          <div className='flex flex-col gap-3'>
            {listings.map((l) => (
              <GlassCard
                key={l.id}
                depth='sm'
                radius='lg'
                className='p-4 flex items-center justify-between gap-3'
              >
                <div>
                  <div className='text-white font-medium'>{money(l.asking_price, l.currency)}</div>
                  <div className='text-[11px] text-white/50'>Estado: {l.status}</div>
                  <div className='text-[11px] text-white/50'>
                    Recibirás: {money(l.seller_net, l.currency)}
                  </div>
                  {l.payout_status && (
                    <div className='text-[11px] text-white/50'>
                      {l.payout_status === 'PAID' ? 'Pagado' : 'Pendiente de pago'}
                    </div>
                  )}
                </div>
                {l.status === 'LISTED' && (
                  <Button variant='danger' size='sm' onClick={() => cancel(l.id)}>
                    Cancelar
                  </Button>
                )}
              </GlassCard>
            ))}
          </div>
        )}
      </section>

      {/* Tickets revendibles */}
      <section>
        <h2 className='font-display text-lg font-semibold text-white mb-3'>
          Poner un ticket en reventa
        </h2>
        {loading ? null : (
          <div className='flex flex-col gap-3'>
            {events.flatMap((event) => {
              const detail = eventDetails[event.eventIdNumber]
              const resaleEnabled = detail?.resale_enabled === true
              const eventPast = detail ? Date.parse(detail.start_date) < Date.now() : false
              // ticket.status ya excluye a los que hicieron check-in: el backend los marca
              // 'USED' (attendee.checked_in_at) en vez de 'ACTIVE', así que este filter alcanza.
              return (event.tickets ?? [])
                .filter((t) => t.status === 'ACTIVE')
                .map((ticket) => {
                  const blockedReason = !detail
                    ? null
                    : !resaleEnabled
                      ? 'Este evento no tiene reventa habilitada.'
                      : eventPast
                        ? 'El evento ya finalizó.'
                        : null
                  return (
                    <GlassCard
                      key={ticket.ticketId}
                      depth='sm'
                      radius='lg'
                      className='p-4 flex items-center justify-between gap-3'
                    >
                      <div className='min-w-0'>
                        <div className='text-white font-medium truncate'>{event.eventName}</div>
                        <div className='text-[11px] text-white/50 truncate'>
                          {ticket.section ? `${ticket.section} · ` : ''}
                          {ticket.seatNumber ?? ticket.priceType ?? 'Entrada'}
                        </div>
                        {blockedReason && (
                          <div className='text-[11px] text-accent-coral/80 truncate'>
                            {blockedReason}
                          </div>
                        )}
                      </div>
                      <Button
                        variant='primary'
                        size='sm'
                        onClick={() => setTarget({ event, ticket })}
                        disabled={!!blockedReason}
                      >
                        Revender
                      </Button>
                    </GlassCard>
                  )
                })
            })}
          </div>
        )}
      </section>

      {target && (
        <ResellDrawer
          key={target.ticket.ticketId}
          target={target}
          onClose={() => setTarget(null)}
          onListed={onListed}
        />
      )}
    </div>
  )
}

function ResellDrawer({
  target,
  onClose,
  onListed
}: {
  target: ResellTarget
  onClose: () => void
  onListed: () => void
}) {
  const toast = useToast()
  const [price, setPrice] = useState('')
  const [fees, setFees] = useState<HiResaleFees | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const currency = target.event.currency ?? 'USD'
  const originalPrice = Number(target.ticket.price ?? 0)

  // Carga los % de fees del evento para mostrar el desglose.
  useEffect(() => {
    let active = true
    hiEventsService
      .getEventResaleListings(target.event.eventIdNumber)
      .then((res) => {
        if (active) setFees(res.fees)
      })
      .catch(() => {
        /* si falla, el listado igual valida en backend */
      })
    return () => {
      active = false
    }
  }, [target.event.eventIdNumber])

  const priceNum = Number(price) || 0
  const sellerFee = fees ? (priceNum * fees.seller_fee_percent) / 100 : 0
  const sellerNet = priceNum - sellerFee
  const maxPrice = fees && originalPrice > 0 ? (originalPrice * fees.max_price_percent) / 100 : null
  const overMax = maxPrice !== null && priceNum > maxPrice

  const submit = async () => {
    if (priceNum <= 0) {
      toast.show({ variant: 'warn', message: 'Ingresa un precio válido.' })
      return
    }
    setSubmitting(true)
    try {
      await hiEventsService.createResaleListing(target.ticket.ticketId, priceNum)
      toast.show({ variant: 'success', message: 'Ticket puesto en reventa.' })
      onListed()
    } catch (e) {
      toast.show({
        variant: 'error',
        message: e instanceof Error ? e.message : 'No se pudo publicar.'
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Drawer open onClose={onClose} side='right' ariaLabel='Revender ticket'>
      <div className='p-6 flex flex-col gap-4 w-full max-w-sm'>
        <h3 className='font-display text-lg font-semibold text-white'>Poner en reventa</h3>
        <p className='text-[13px] text-white/60'>{target.event.eventName}</p>

        <label className='text-[13px] text-white/70'>
          Precio de venta ({currency})
          <input
            type='number'
            inputMode='decimal'
            min='0'
            step='0.01'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className='mt-1 w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white outline-none focus:border-white/30'
            placeholder='0.00'
          />
        </label>

        {maxPrice !== null && (
          <p className={`text-[12px] ${overMax ? 'text-accent-coral' : 'text-white/45'}`}>
            Precio máximo permitido: {money(maxPrice, currency)}
          </p>
        )}

        {fees && priceNum > 0 && (
          <div className='rounded-lg bg-white/5 p-3 text-[12px] text-white/70 flex flex-col gap-1'>
            <div className='flex justify-between'>
              <span>Precio</span>
              <span>{money(priceNum, currency)}</span>
            </div>
            <div className='flex justify-between'>
              <span>Comisión vendedor ({fees.seller_fee_percent}%)</span>
              <span>-{money(sellerFee, currency)}</span>
            </div>
            <div className='flex justify-between font-semibold text-white border-t border-white/10 pt-1 mt-1'>
              <span>Recibes</span>
              <span>{money(sellerNet, currency)}</span>
            </div>
          </div>
        )}

        <p className='text-[12px] text-accent-coral/90'>
          Al publicar, este ticket queda bloqueado y no podrá usarse para ingresar hasta que
          canceles la reventa o se venda.
        </p>

        <div className='flex gap-2 mt-2'>
          <Button variant='ghost' size='md' onClick={onClose} disabled={submitting} fullWidth>
            Cancelar
          </Button>
          <Button
            variant='primary'
            size='md'
            onClick={submit}
            disabled={submitting || overMax}
            fullWidth
          >
            {submitting ? 'Publicando…' : 'Publicar reventa'}
          </Button>
        </div>
      </div>
    </Drawer>
  )
}
