import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import LayoutV2 from '../../../layouts/LayoutV2'
import StepHeader from '../sale/StepHeader'
import CheckoutStripe from '../../CheckoutStripe'
import { Button, GlassCard } from '../../ui'
import { useCart } from '../../../router/cartContext'
import { useUIEvents } from '../../../hooks/useUIEvents'
import { useSessionTimer } from '../../../hooks/useSessionTimer'
import { coverSeed } from '../../../lib/covers/coverHash'
import { cn } from '../../../types/ui'
import glass from '../../../styles/effects/glass.module.css'

const round2 = (n: number) => Math.round(n * 100) / 100

/**
 * Pantalla v2 de checkout. Layout dedicado al pago:
 *   - LayoutV2 sin Header ni Footer (foco total en la compra).
 *   - `StepHeader` con paso "Pay" activo y CountdownPill del session timer.
 *   - Main: Stripe Embedded Checkout (envuelve `CheckoutStripe` legacy).
 *   - Sidebar / sheet inferior: resumen read-only del cart con desglose
 *     fee/tax y total. Para mobile va arriba del Stripe form.
 *
 * Los datos vienen del `cartContext`. Si está vacío, redirigimos a
 * /events. Mantenemos `cart_checkout` en localStorage actualizado para
 * que las Netlify Functions / Stripe webhook puedan leerlo (compat
 * legacy).
 */
export default function CheckoutV2() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items: cart, eventLabel, pricing } = useCart()
  const { byLabel } = useUIEvents()
  const timer = useSessionTimer(eventLabel ?? undefined, 10)

  const event = byLabel(eventLabel ?? undefined)

  const eventInfo = useMemo(
    () =>
      event
        ? {
            id: event.id,
            // id numérico de HiEvents — el que usa la cadena de orden/checkout.
            eventId: event.eventId,
            name: event.title,
            venue: event.venueName,
            venueId: event.venueLabel,
            date: event.raw.event_date,
            location: event.city
          }
        : null,
    [event]
  )

  const customer = useMemo(
    () => ({
      name: user ? `${user.firstName} ${user.lastName ?? ''}`.trim() : undefined,
      email: user?.email,
      phone: user?.phone
    }),
    [user]
  )

  // Si el cart está vacío, no hay nada para cobrar → mandar a explorar.
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/events', { replace: true })
    }
  }, [cart.length, navigate])

  // Mantener cart_checkout en localStorage sincronizado por si el
  // webhook / ReturnPage legacy lo necesita.
  useEffect(() => {
    if (cart.length === 0 || !eventInfo) return
    localStorage.setItem(
      'cart_checkout',
      JSON.stringify({ cart, eventInfo, customer })
    )
  }, [cart, eventInfo, customer])

  if (cart.length === 0 || !event || !eventInfo) {
    return (
      <LayoutV2 hideHeader hideFooter meshSeed={3}>
        <div className='min-h-[60vh] grid place-items-center px-4'>
          <GlassCard depth='md' radius='lg' className='p-8 text-center max-w-md'>
            <div className='font-display text-base font-semibold text-white'>
              Your cart is empty
            </div>
            <p className='mt-2 text-sm text-white/55'>
              Add tickets first to proceed to checkout.
            </p>
            <Button
              variant='primary'
              size='md'
              onClick={() => navigate('/events')}
              className='mt-4'
            >
              Browse events
            </Button>
          </GlassCard>
        </div>
      </LayoutV2>
    )
  }

  const subtitle = `${event.day}, ${event.month} ${event.date}${event.time ? ` · ${event.time}` : ''} · ${event.venueName}`

  return (
    <LayoutV2
      hideHeader
      hideFooter
      meshSeed={(coverSeed(event.id) % 8) + 3}
    >
      <StepHeader
        step='pay'
        title={event.title}
        subtitle={subtitle}
        eventLabel={event.id}
        onBack={() => navigate(-1)}
      />

      <main className='mx-auto max-w-6xl px-4 lg:px-10 py-5 lg:py-8 pb-12'>
        <div className='grid gap-5 lg:grid-cols-[1fr_360px] lg:items-start'>
          <div className='min-w-0 space-y-4'>
            {/* Order summary visible en mobile arriba del Stripe form. */}
            <div className='lg:hidden'>
              <OrderSummary
                items={cart}
                pricing={pricing}
                timer={timer}
                eventTitle={event.title}
              />
            </div>

            <PaymentPanel>
              <CheckoutStripe
                cart={cart}
                eventInfo={eventInfo}
                customer={customer}
              />
            </PaymentPanel>

            <SecurityNote />
          </div>

          <aside className='hidden lg:block'>
            <OrderSummary
              items={cart}
              pricing={pricing}
              timer={timer}
              eventTitle={event.title}
              sticky
            />
          </aside>
        </div>
      </main>
    </LayoutV2>
  )
}

const PaymentPanel = ({ children }: { children: React.ReactNode }) => (
  <GlassCard depth='lg' radius='lg' className='p-4 lg:p-6'>
    <div className='flex items-center justify-between mb-4'>
      <h2 className='font-display text-base lg:text-lg font-semibold text-white tracking-tight'>
        Payment
      </h2>
      <span className='inline-flex items-center gap-1.5 text-[10.5px] text-white/55 font-display'>
        <LockIcon />
        Secured by Stripe
      </span>
    </div>
    {/* El pago real es un redirect a Stripe (no embebido), así que el form de
        asistentes va con la estética v2, no sobre fondo blanco. */}
    <div className='mt-1'>{children}</div>
  </GlassCard>
)

const SecurityNote = () => (
  <p className='text-[10.5px] text-white/45 text-center px-2'>
    256-bit SSL · PCI DSS compliant · Your card never touches our servers.
  </p>
)

interface OrderSummaryProps {
  items: ReturnType<typeof useCart>['items']
  pricing: ReturnType<typeof useCart>['pricing']
  timer: ReturnType<typeof useSessionTimer>
  eventTitle: string
  sticky?: boolean
}

const OrderSummary = ({
  items,
  pricing,
  timer,
  eventTitle,
  sticky
}: OrderSummaryProps) => (
  <div
    className={cn(
      glass.glassLg,
      'rounded-glass-lg p-5 flex flex-col',
      sticky && 'sticky top-24 max-h-[calc(100vh-7rem)]'
    )}
    aria-label='Order summary'
  >
    <header className='flex items-center justify-between mb-3'>
      <div>
        <div className='text-[10px] uppercase tracking-[0.16em] font-display font-bold text-white/55'>
          Order summary
        </div>
        <div className='mt-1 font-display text-sm font-semibold text-white tracking-tight truncate'>
          {eventTitle}
        </div>
      </div>
      <span className='text-[10px] uppercase tracking-[0.16em] text-white/55 font-display'>
        {items.length} {items.length === 1 ? 'ticket' : 'tickets'}
      </span>
    </header>

    {timer.hasStarted && !timer.isExpired && (
      <HoldBanner
        formatted={timer.formattedTime}
        warn={timer.isWarning}
        critical={timer.isCritical}
      />
    )}

    <div className='flex-1 min-h-0 overflow-y-auto -mx-1 px-1 mt-3'>
      <ul className='space-y-2'>
        {items.map((item) => {
          const net = item.price_base ?? item.price_final
          const fee = Number(item.fee) || 0
          const tax = Number(item.tax) || 0
          const total = round2(net + fee + tax)
          return (
            <li
              key={item.ticketId}
              className='rounded-glass-sm bg-white/[0.04] border border-white/[0.08] px-3 py-2.5'
            >
              <div className='flex items-start justify-between gap-3'>
                <div className='min-w-0 flex-1'>
                  <div className='font-display text-[12.5px] font-semibold text-white truncate'>
                    {item.subZone} · {item.seatLabel}
                  </div>
                  {item.coords && (
                    <div className='text-[10.5px] text-white/55 mt-0.5'>
                      Row {item.coords.row + 1} · Seat {item.coords.col + 1}
                    </div>
                  )}
                </div>
                <span className='font-display text-[13px] font-bold text-white tabular-nums'>
                  ${total.toFixed(2)}
                </span>
              </div>
              <div className='mt-2 pt-2 border-t border-white/[0.06] space-y-1 text-[10.5px]'>
                <BreakdownRow label='Net' value={net} />
                <BreakdownRow label='Service fee' value={fee} />
                <BreakdownRow label='Tax' value={tax} />
              </div>
            </li>
          )
        })}
      </ul>
    </div>

    <footer className='mt-4 pt-4 border-t border-white/[0.08] space-y-1.5'>
      <BreakdownRow label='Subtotal' value={pricing.subtotal} />
      <BreakdownRow label='Service fee' value={pricing.serviceFee} />
      <BreakdownRow label='Taxes' value={pricing.taxes} />
      <div className='pt-3 mt-2 border-t border-white/[0.08] flex items-center justify-between'>
        <span className='text-[13px] text-white/65'>Total</span>
        <span className='font-display text-xl font-bold text-white tabular-nums'>
          ${pricing.total.toFixed(2)}
        </span>
      </div>
    </footer>
  </div>
)

const BreakdownRow = ({ label, value }: { label: string; value: number }) => (
  <div className='flex justify-between'>
    <span className='text-white/55'>{label}</span>
    <span className='text-white/85 font-display tabular-nums'>
      ${value.toFixed(2)}
    </span>
  </div>
)

const HoldBanner = ({
  formatted,
  warn,
  critical
}: {
  formatted: string
  warn: boolean
  critical: boolean
}) => (
  <div
    className={cn(
      'flex items-center gap-2.5 rounded-glass-md px-3 py-2 border backdrop-blur-glass-strong',
      critical
        ? 'border-red-400/45 bg-red-500/15 text-red-200'
        : warn
          ? 'border-accent-coral/35 bg-accent-coral/15 text-[#FFD6E2]'
          : 'border-brand-hi/30 bg-brand-hi/10 text-white/85'
    )}
  >
    <ClockIcon />
    <span className='text-[11.5px]'>
      <strong className='font-semibold'>Hold</strong> ·{' '}
      <span className='font-display font-bold tabular-nums'>{formatted}</span>{' '}
      left to complete
    </span>
  </div>
)

const LockIcon = () => (
  <svg width='11' height='11' viewBox='0 0 12 12' fill='none' aria-hidden>
    <rect
      x='2.5'
      y='5.5'
      width='7'
      height='5'
      rx='1.2'
      stroke='currentColor'
      strokeWidth='1.2'
    />
    <path
      d='M4 5.5V4a2 2 0 1 1 4 0v1.5'
      stroke='currentColor'
      strokeWidth='1.2'
    />
  </svg>
)

const ClockIcon = () => (
  <svg
    width='14'
    height='14'
    viewBox='0 0 14 14'
    fill='none'
    aria-hidden
    className='shrink-0'
  >
    <circle cx='7' cy='7.6' r='5.4' stroke='currentColor' strokeWidth='1.4' />
    <path
      d='M7 5v3l2 1'
      stroke='currentColor'
      strokeWidth='1.4'
      strokeLinecap='round'
    />
  </svg>
)
