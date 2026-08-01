import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, GlassCard, useToast } from '../../ui'
import { hiEventsService } from '../../../services/hiEventsService'
import { useAuth } from '../../../context/AuthContext'
import type { HiResaleFees, HiResaleMarketListing } from '../../../types/hievents'

const money = (n: number, currency = 'USD') =>
  new Intl.NumberFormat('es', { style: 'currency', currency }).format(n)

/**
 * Marketplace de reventa de un evento: tickets que otros usuarios pusieron en reventa.
 * Montar en la página de detalle del evento. `eventId` es el id numérico de HiEvents.
 */
export default function EventResaleSection({
  eventId,
  showEmpty = false
}: {
  eventId: number | string
  /** Si true, muestra un mensaje cuando no hay reventas (para páginas dedicadas). */
  showEmpty?: boolean
}) {
  const { status } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [listings, setListings] = useState<HiResaleMarketListing[]>([])
  const [fees, setFees] = useState<HiResaleFees | null>(null)
  const [loading, setLoading] = useState(true)
  const [buyingId, setBuyingId] = useState<number | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    hiEventsService
      .getEventResaleListings(eventId, controller.signal)
      .then((res) => {
        setListings(res.data ?? [])
        setFees(res.fees ?? null)
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setListings([])
          setFees(null)
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [eventId])

  const buy = async (listing: HiResaleMarketListing) => {
    if (status !== 'authenticated') {
      navigate('/login', { state: { returnTo: location.pathname + location.search } })
      return
    }
    setBuyingId(listing.id)
    try {
      const origin = window.location.origin
      const { checkout_url } = await hiEventsService.createResaleCheckout(
        listing.id,
        `${origin}/dashboard/tickets/upcomingevent`,
        window.location.href
      )
      window.location.href = checkout_url
    } catch (e) {
      toast.show({ variant: 'error', message: e instanceof Error ? e.message : 'No se pudo iniciar la compra.' })
      setBuyingId(null)
    }
  }

  if (loading) return null
  // El organizador puede desactivar la reventa para el evento: no se renderiza nada (ni CTA ni listado).
  if (fees && !fees.resale_enabled) return null
  if (listings.length === 0) {
    if (!showEmpty) return null
    return (
      <GlassCard depth='sm' radius='lg' className='p-8 text-center text-white/60'>
        No hay tickets en reventa para este evento.
      </GlassCard>
    )
  }

  return (
    <section className='mt-8'>
      <h2 className='font-display text-lg font-semibold text-white mb-3'>Reventa segura</h2>
      <p className='text-[13px] text-white/55 mb-4'>
        Tickets que otros asistentes pusieron en reventa. TicketSaver retiene el pago y traspasa el ticket de forma segura.
      </p>
      <div className='flex flex-col gap-3'>
        {listings.map((l) => {
          const ticketLine = [l.ticket_name, l.seat_label].filter(Boolean).join(' · ')
          return (
            <GlassCard key={l.id} depth='sm' radius='lg' className='p-4 flex items-center justify-between gap-3'>
              <div>
                {ticketLine && <div className='text-[12px] text-white/70'>{ticketLine}</div>}
                <div className='text-white font-semibold'>{money(l.buyer_total, l.currency)}</div>
                <div className='text-[11px] text-white/50'>
                  Precio {money(l.asking_price, l.currency)} + servicio {money(l.buyer_fee, l.currency)}
                </div>
              </div>
              <Button variant='primary' size='sm' onClick={() => buy(l)} disabled={buyingId === l.id}>
                {buyingId === l.id ? 'Redirigiendo…' : 'Comprar'}
              </Button>
            </GlassCard>
          )
        })}
      </div>
    </section>
  )
}
