import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Drawer from '../../ui/Drawer'
import { Button } from '../../ui'
import { useCart, type CartItem } from '../../../router/cartContext'
import { useSessionTimer } from '../../../hooks/useSessionTimer'
import {
  SERVICE_FEE_PCT,
  TAX_PCT
} from '../../../lib/pricing'
import { cn } from '../../../types/ui'
import glass from '../../../styles/effects/glass.module.css'

const round2 = (n: number) => Math.round(n * 100) / 100

interface SeatRow {
  kind: 'seat'
  item: CartItem
}

interface GAGroup {
  kind: 'ga'
  zoneName: string
  priceType: string
  subZone: string
  unitPrice: number
  items: CartItem[]
}

type Row = SeatRow | GAGroup

const groupItems = (items: CartItem[]): Row[] => {
  const rows: Row[] = []
  const gaIndex = new Map<string, GAGroup>()

  for (const item of items) {
    if (item.coords) {
      rows.push({ kind: 'seat', item })
      continue
    }
    const key = `${item.zoneName}::${item.priceType}`
    const existing = gaIndex.get(key)
    if (existing) {
      existing.items.push(item)
    } else {
      const group: GAGroup = {
        kind: 'ga',
        zoneName: item.zoneName,
        priceType: item.priceType,
        subZone: item.subZone,
        unitPrice: item.price_final,
        items: [item]
      }
      gaIndex.set(key, group)
      rows.push(group)
    }
  }

  return rows
}

/**
 * CartDrawer — overlay global con el carrito. Lo monta `LayoutV2` y se
 * abre desde el `CartTrigger` del Header. Lectura/escritura via
 * `useCart()` — sin estado local.
 */
export default function CartDrawer() {
  const navigate = useNavigate()
  const {
    items,
    isOpen,
    closeDrawer,
    eventLabel,
    pricing,
    addItem,
    removeItem,
    clear
  } = useCart()

  const timer = useSessionTimer(eventLabel ?? undefined, 10)
  const rows = useMemo(() => groupItems(items), [items])

  const handleCheckout = () => {
    if (items.length === 0) return
    closeDrawer()
    navigate('/checkout')
  }

  const handleIncrementGA = (group: GAGroup) => {
    const template = group.items[0]
    if (!template) return
    const newIssuedAt = Date.now()
    const newTicketId = `${template.ticketId}-${newIssuedAt}`
    addItem({
      ...template,
      ticketId: newTicketId,
      seatLabel: newTicketId,
      issuedAt: newIssuedAt
    })
  }

  const handleDecrementGA = (group: GAGroup) => {
    const last = group.items[group.items.length - 1]
    if (!last) return
    removeItem(last.ticketId)
  }

  return (
    <Drawer
      open={isOpen}
      onClose={closeDrawer}
      side='right'
      ariaLabel='Your cart'
      panelClassName={cn(glass.glassDrawer, 'flex flex-col')}
    >
      <header className='flex items-center justify-between gap-3 px-5 py-4 border-b border-white/[0.08]'>
        <div className='min-w-0'>
          <h2 className='font-display text-lg font-semibold text-white tracking-tight'>
            Your cart
          </h2>
          <p className='text-[11px] text-white/55 mt-0.5'>
            {items.length === 0
              ? 'Empty for now'
              : `${items.length} ${items.length === 1 ? 'ticket' : 'tickets'}`}
          </p>
        </div>
        <button
          type='button'
          aria-label='Close cart'
          onClick={closeDrawer}
          className='grid h-9 w-9 place-items-center rounded-glass-sm bg-white/[0.06] border border-white/10 text-white/75 hover:bg-white/[0.10] hover:text-white transition'
        >
          <CloseIcon />
        </button>
      </header>

      {items.length > 0 && timer.hasStarted && !timer.isExpired && (
        <HoldTimerBanner
          formatted={timer.formattedTime}
          warn={timer.isWarning}
          critical={timer.isCritical}
        />
      )}

      <div className='flex-1 min-h-0 overflow-y-auto px-5 py-4'>
        {items.length === 0 ? (
          <EmptyState onClose={closeDrawer} />
        ) : (
          <ul className='space-y-2.5'>
            {rows.map((row) =>
              row.kind === 'seat' ? (
                <SeatRowCard
                  key={row.item.ticketId}
                  item={row.item}
                  onRemove={() => removeItem(row.item.ticketId)}
                />
              ) : (
                <GAGroupCard
                  key={`${row.zoneName}::${row.priceType}`}
                  group={row}
                  onIncrement={() => handleIncrementGA(row)}
                  onDecrement={() => handleDecrementGA(row)}
                />
              )
            )}
          </ul>
        )}
      </div>

      {items.length > 0 && (
        <footer className='border-t border-white/[0.08] px-5 py-4 space-y-3'>
          <div className='space-y-1.5 text-[12px]'>
            <PriceRow label='Subtotal' value={pricing.subtotal} />
            <PriceRow label='Service fee (8.5%)' value={pricing.serviceFee} />
            <PriceRow label='Taxes (6%)' value={pricing.taxes} />
          </div>
          <div className='pt-3 border-t border-white/[0.08] flex items-center justify-between'>
            <span className='text-[13px] text-white/65'>Total</span>
            <span className='font-display text-xl font-bold text-white tabular-nums'>
              ${pricing.total.toFixed(2)}
            </span>
          </div>
          <Button variant='primary' size='md' fullWidth onClick={handleCheckout}>
            Checkout · ${pricing.total.toFixed(2)}
          </Button>
          <button
            type='button'
            onClick={clear}
            className='w-full text-[11px] text-white/40 hover:text-white/65 transition py-1'
          >
            Clear cart
          </button>
        </footer>
      )}
    </Drawer>
  )
}

const PriceRow = ({ label, value }: { label: string; value: number }) => (
  <div className='flex items-center justify-between'>
    <span className='text-white/55'>{label}</span>
    <span className='text-white/85 font-display tabular-nums'>
      ${value.toFixed(2)}
    </span>
  </div>
)

const HoldTimerBanner = ({
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
      'mx-5 mt-4 flex items-center gap-2.5 rounded-glass-md px-3 py-2 border backdrop-blur-glass-strong',
      critical
        ? 'border-red-400/45 bg-red-500/15 text-red-200'
        : warn
          ? 'border-accent-coral/35 bg-accent-coral/15 text-[#FFD6E2]'
          : 'border-brand-hi/30 bg-brand-hi/10 text-white/80'
    )}
  >
    <ClockIcon />
    <span className='text-[11.5px]'>
      <strong className='font-semibold'>Seats held for you.</strong>{' '}
      Complete in{' '}
      <span className='font-display font-bold tabular-nums'>{formatted}</span>{' '}
      or they release.
    </span>
  </div>
)

const SeatRowCard = ({
  item,
  onRemove
}: {
  item: CartItem
  onRemove: () => void
}) => {
  const net = item.price_final
  const fee = round2(net * SERVICE_FEE_PCT)
  const tax = round2(net * TAX_PCT)
  const total = round2(net + fee + tax)
  return (
    <li className='rounded-glass-md bg-white/[0.05] border border-white/[0.10] px-3 py-2.5'>
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0 flex-1'>
          <div className='font-display text-[13px] font-semibold text-white truncate'>
            {item.subZone} · {item.seatLabel}
          </div>
          {item.coords && (
            <div className='text-[10.5px] text-white/55 mt-0.5'>
              Row {item.coords.row + 1} · Seat {item.coords.col + 1}
            </div>
          )}
        </div>
        <div className='flex items-start gap-2 shrink-0'>
          <span className='font-display text-[13px] font-bold text-white tabular-nums'>
            ${total.toFixed(2)}
          </span>
          <button
            type='button'
            aria-label='Remove ticket'
            onClick={onRemove}
            className='grid h-6 w-6 place-items-center rounded-pill bg-white/[0.06] border border-white/10 text-white/55 hover:text-accent-coral hover:bg-white/[0.10] transition'
          >
            <svg width='10' height='10' viewBox='0 0 12 12' aria-hidden>
              <path
                d='m3 3 6 6m0-6-6 6'
                stroke='currentColor'
                strokeWidth='1.6'
                strokeLinecap='round'
              />
            </svg>
          </button>
        </div>
      </div>
      <BreakdownLines net={net} fee={fee} tax={tax} />
    </li>
  )
}

const GAGroupCard = ({
  group,
  onIncrement,
  onDecrement
}: {
  group: GAGroup
  onIncrement: () => void
  onDecrement: () => void
}) => {
  const qty = group.items.length
  const groupNet = round2(qty * group.unitPrice)
  const groupFee = round2(groupNet * SERVICE_FEE_PCT)
  const groupTax = round2(groupNet * TAX_PCT)
  const groupTotal = round2(groupNet + groupFee + groupTax)
  return (
    <li className='rounded-glass-md bg-white/[0.05] border border-white/[0.10] px-3 py-2.5'>
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0 flex-1'>
          <div className='font-display text-[13px] font-semibold text-white truncate'>
            {group.subZone}
          </div>
          <div className='text-[10.5px] text-white/55 mt-0.5'>
            ${group.unitPrice.toFixed(2)} each · {group.priceType}
          </div>
        </div>
        <div className='shrink-0 flex items-center gap-1 rounded-pill bg-white/[0.06] border border-white/10 p-0.5'>
          <StepperBtn label='Remove one' onClick={onDecrement}>
            −
          </StepperBtn>
          <span className='font-display text-sm font-semibold text-white tabular-nums min-w-[20px] text-center'>
            {qty}
          </span>
          <StepperBtn label='Add one' onClick={onIncrement}>
            +
          </StepperBtn>
        </div>
      </div>
      <BreakdownLines net={groupNet} fee={groupFee} tax={groupTax} />
      <div className='mt-2 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[12px]'>
        <span className='text-white/55'>Subtotal</span>
        <span className='font-display font-bold text-white tabular-nums'>
          ${groupTotal.toFixed(2)}
        </span>
      </div>
    </li>
  )
}

const StepperBtn = ({
  label,
  onClick,
  children
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) => (
  <button
    type='button'
    aria-label={label}
    onClick={onClick}
    className='grid h-7 w-7 place-items-center rounded-pill text-white font-display text-base font-bold hover:bg-white/[0.10] transition'
  >
    {children}
  </button>
)

const BreakdownLines = ({
  net,
  fee,
  tax
}: {
  net: number
  fee: number
  tax: number
}) => (
  <div className='mt-2 pt-2 border-t border-white/[0.06] space-y-0.5 text-[10.5px]'>
    <BreakdownRow label='Net' value={net} />
    <BreakdownRow label='Service fee (8.5%)' value={fee} />
    <BreakdownRow label='Tax (6%)' value={tax} />
  </div>
)

const BreakdownRow = ({ label, value }: { label: string; value: number }) => (
  <div className='flex justify-between'>
    <span className='text-white/55'>{label}</span>
    <span className='text-white/80 tabular-nums font-display'>
      ${value.toFixed(2)}
    </span>
  </div>
)

const EmptyState = ({ onClose }: { onClose: () => void }) => (
  <div className='h-full flex flex-col items-center justify-center text-center px-4 py-10'>
    <div className='h-14 w-14 rounded-glass-md bg-white/[0.06] border border-white/[0.08] grid place-items-center mb-3'>
      <svg width='22' height='22' viewBox='0 0 24 24' fill='none' aria-hidden>
        <path
          d='M3 5h2l2 12h11l2-9H7'
          stroke='currentColor'
          strokeWidth='1.6'
          strokeLinejoin='round'
          strokeLinecap='round'
          className='text-white/65'
        />
        <circle cx='10' cy='20' r='1.4' fill='currentColor' className='text-white/65' />
        <circle cx='17' cy='20' r='1.4' fill='currentColor' className='text-white/65' />
      </svg>
    </div>
    <h3 className='font-display text-base font-semibold text-white'>
      Your cart is empty
    </h3>
    <p className='mt-2 text-[12px] text-white/55 max-w-xs'>
      Browse events and add tickets to see them here. Your hold lasts 10
      minutes once you pick your first seat.
    </p>
    <Button
      variant='ghost'
      size='md'
      onClick={onClose}
      className='mt-5'
    >
      Keep browsing
    </Button>
  </div>
)

const CloseIcon = () => (
  <svg width='12' height='12' viewBox='0 0 12 12' fill='none' aria-hidden>
    <path
      d='m3 3 6 6m0-6-6 6'
      stroke='currentColor'
      strokeWidth='1.6'
      strokeLinecap='round'
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
    <path d='M7 5v3l2 1' stroke='currentColor' strokeWidth='1.4' strokeLinecap='round' />
  </svg>
)
