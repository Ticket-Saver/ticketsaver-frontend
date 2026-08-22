import { useState } from 'react'
import { Button } from '../../ui'
import { cn } from '../../../types/ui'
import glass from '../../../styles/effects/glass.module.css'
import { type PricingBreakdown } from '../../../lib/pricing'

const round2 = (n: number) => Math.round(n * 100) / 100

interface ItemBreakdown {
  net: number
  fee: number
  tax: number
  total: number
}

/**
 * Desglose por item con los valores REALES de HiEvents (net/fee/tax que ya trae
 * cada item del carrito). Nada hardcodeado.
 */
const breakdownPerItem = (item: CartSummaryItem): ItemBreakdown => {
  const net = item.net ?? item.price
  const fee = item.fee ?? 0
  const tax = item.tax ?? 0
  return { net: round2(net), fee: round2(fee), tax: round2(tax), total: round2(net + fee + tax) }
}

const ItemBreakdownRows = ({ b }: { b: ItemBreakdown }) => (
  <div className='mt-2 pt-2 border-t border-white/[0.06] space-y-1 text-[10.5px]'>
    <div className='flex justify-between'>
      <span className='text-white/55'>Net seat</span>
      <span className='text-white/80 tabular-nums font-display'>${b.net.toFixed(2)}</span>
    </div>
    <div className='flex justify-between'>
      <span className='text-white/55'>Service fee</span>
      <span className='text-white/80 tabular-nums font-display'>${b.fee.toFixed(2)}</span>
    </div>
    <div className='flex justify-between'>
      <span className='text-white/55'>Tax</span>
      <span className='text-white/80 tabular-nums font-display'>${b.tax.toFixed(2)}</span>
    </div>
  </div>
)

export interface CartSummaryItem {
  id: string
  /** Línea principal — ej. "Stage Left 1 · K-7" o "2 × General Admission". */
  label: string
  /** Línea secundaria — ej. "Row K · Seat 7" o "$55 each". */
  sublabel?: string
  /** Total del item (con impuestos). */
  price: number
  /** Desglose real de HiEvents. Si vienen, el panel los usa en vez de los % legacy. */
  net?: number
  fee?: number
  tax?: number
}

/** Fila del listado, compartida por el sidebar y el bottom sheet. */
const SummaryItemRow = ({
  item,
  onRemoveItem
}: {
  item: CartSummaryItem
  onRemoveItem?: (id: string) => void
}) => {
  const b = breakdownPerItem(item)
  return (
    <li className='rounded-glass-sm bg-white/[0.04] border border-white/[0.08] px-3 py-2.5'>
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0 flex-1'>
          <div className='font-display text-[12.5px] font-semibold text-white truncate'>
            {item.label}
          </div>
          {item.sublabel && (
            <div className='text-[10.5px] text-white/55 mt-0.5 truncate'>{item.sublabel}</div>
          )}
        </div>
        <div className='flex items-start gap-2 shrink-0'>
          <span className='font-display text-[13px] font-bold text-white tabular-nums'>
            ${b.total.toFixed(2)}
          </span>
          {onRemoveItem && (
            <button
              type='button'
              aria-label={`Remove ${item.label}`}
              onClick={() => onRemoveItem(item.id)}
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
          )}
        </div>
      </div>
      <ItemBreakdownRows b={b} />
    </li>
  )
}

interface BaseProps {
  items: CartSummaryItem[]
  /** Subtotal + fees + taxes + total computados por `computePricing`. */
  breakdown: PricingBreakdown
  count: number
  max: number
  ctaLabel: string
  ctaDisabled?: boolean
  onCheckout: () => void
  onBack?: () => void
  /** Texto de ayuda debajo del listado. */
  helperText?: string
  /** Override del título del panel. */
  title?: string
  /**
   * Quita el item del carrito. Recibe el `id` del `CartSummaryItem`, que en
   * asientos es un ticket y en GA es la fila agrupada — cada página decide qué
   * borra. Sin este prop no se renderiza el botón.
   */
  onRemoveItem?: (id: string) => void
}

const PriceRow = ({
  label,
  value,
  emphasize
}: {
  label: string
  value: number
  emphasize?: boolean
}) => (
  <div className='flex items-center justify-between gap-3'>
    <span
      className={cn(
        'text-[12.5px]',
        emphasize ? 'text-white/80 font-display font-medium' : 'text-white/55'
      )}
    >
      {label}
    </span>
    <span
      className={cn(
        'font-display tabular-nums',
        emphasize ? 'text-xl font-bold text-white' : 'text-[12.5px] font-semibold text-white/85'
      )}
    >
      ${value.toFixed(2)}
    </span>
  </div>
)

const BreakdownLines = ({ breakdown }: { breakdown: PricingBreakdown }) => (
  <div className='space-y-1.5'>
    <PriceRow label='Subtotal' value={breakdown.subtotal} />
    {breakdown.serviceFee > 0 && <PriceRow label='Service fee' value={breakdown.serviceFee} />}
    {breakdown.taxes > 0 && <PriceRow label='Taxes' value={breakdown.taxes} />}
  </div>
)

/**
 * Panel de resumen de compra reutilizable por SeatGrid y SaleNoSeatsV2.
 *
 * El componente expone dos sub-vistas:
 * - `<Sidebar>` para desktop (lg+): card glass sticky a la derecha del
 *   contenido principal.
 * - `<MobileSheet>` para mobile: bottom sheet flotante con items
 *   colapsables (un tap expande/contrae) y CTA siempre visible.
 *
 * Las páginas montan ambos y dejan que el CSS responsive resuelva cuál
 * se ve — mantiene el resumen visible mientras el usuario interactúa con
 * la sección principal (mapa / steppers).
 */
export const CartSidebar = (props: BaseProps) => {
  const {
    items,
    breakdown,
    count,
    max,
    ctaLabel,
    ctaDisabled,
    onCheckout,
    onBack,
    helperText,
    title,
    onRemoveItem
  } = props

  return (
    <aside
      className={cn(
        glass.glassLg,
        'hidden lg:flex flex-col rounded-glass-lg p-5 sticky top-24 max-h-[calc(100vh-7rem)]'
      )}
      aria-label='Order summary'
    >
      <header className='flex items-center justify-between mb-4'>
        <h3 className='font-display text-base font-semibold text-white tracking-tight'>
          {title ?? 'Your order'}
        </h3>
        <span className='text-[10px] uppercase tracking-[0.16em] text-white/55 font-display'>
          {count} / {max}
        </span>
      </header>

      <div className='flex-1 min-h-0 overflow-y-auto -mx-1 px-1'>
        {items.length === 0 ? (
          <EmptyHint />
        ) : (
          <ul className='space-y-2'>
            {items.map((item) => (
              <SummaryItemRow key={item.id} item={item} onRemoveItem={onRemoveItem} />
            ))}
          </ul>
        )}
        {helperText && items.length > 0 && (
          <p className='mt-3 text-[10.5px] text-white/40 text-center'>{helperText}</p>
        )}
      </div>

      <footer className='mt-4 pt-4 border-t border-white/[0.08] space-y-3'>
        {items.length > 0 && (
          <>
            <BreakdownLines breakdown={breakdown} />
            <div className='pt-3 border-t border-white/[0.08]'>
              <PriceRow label='Total' value={breakdown.total} emphasize />
            </div>
          </>
        )}
        <Button variant='primary' size='md' onClick={onCheckout} disabled={ctaDisabled} fullWidth>
          {ctaLabel}
        </Button>
        {onBack && (
          <Button variant='ghost' size='sm' onClick={onBack} fullWidth>
            Back
          </Button>
        )}
      </footer>
    </aside>
  )
}

export const CartMobileSheet = (props: BaseProps) => {
  const {
    items,
    breakdown,
    count,
    ctaLabel,
    ctaDisabled,
    onCheckout,
    onBack,
    helperText,
    title,
    onRemoveItem
  } = props
  const [expanded, setExpanded] = useState(false)
  const hasItems = items.length > 0

  return (
    <div
      className='lg:hidden fixed inset-x-0 bottom-0 z-40 px-3'
      style={{
        paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))'
      }}
    >
      <div
        aria-hidden
        className='absolute inset-x-0 bottom-0 h-40 pointer-events-none'
        style={{
          background: 'linear-gradient(to top, rgba(10,10,12,0.92) 50%, rgba(10,10,12,0))'
        }}
      />
      <div
        className={cn(glass.glassLg, 'relative max-w-3xl mx-auto rounded-glass-lg overflow-hidden')}
      >
        <button
          type='button'
          onClick={() => setExpanded((s) => !s)}
          disabled={!hasItems}
          aria-expanded={expanded}
          aria-label={expanded ? 'Collapse order summary' : 'Expand order summary'}
          className='w-full flex items-center justify-between gap-3 px-4 py-3 text-left disabled:cursor-default'
        >
          <div className='min-w-0'>
            <div className='text-[10px] font-display font-bold uppercase tracking-[0.16em] text-white/55'>
              {title ?? 'Your order'}
            </div>
            <div className='font-display text-sm font-semibold text-white truncate'>
              {hasItems
                ? `${count} ${count === 1 ? 'ticket' : 'tickets'} · $${breakdown.total.toFixed(2)}`
                : 'No tickets yet'}
            </div>
          </div>
          {hasItems && (
            <span
              aria-hidden
              className={cn(
                'shrink-0 grid h-7 w-7 place-items-center rounded-pill bg-white/[0.08] text-white/75 transition-transform',
                expanded && 'rotate-180'
              )}
            >
              <svg width='12' height='12' viewBox='0 0 12 12' fill='none'>
                <path
                  d='m3 4.5 3 3 3-3'
                  stroke='currentColor'
                  strokeWidth='1.6'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </span>
          )}
        </button>

        {expanded && hasItems && (
          <div className='max-h-[50vh] overflow-y-auto border-t border-white/[0.08] px-4 py-3 space-y-3'>
            <ul className='space-y-2'>
              {items.map((item) => (
                <SummaryItemRow key={item.id} item={item} onRemoveItem={onRemoveItem} />
              ))}
            </ul>

            <div className='pt-3 border-t border-white/[0.08]'>
              <BreakdownLines breakdown={breakdown} />
            </div>

            {helperText && <p className='text-[10.5px] text-white/40 text-center'>{helperText}</p>}
          </div>
        )}

        <div className='px-3 pb-3 pt-2 border-t border-white/[0.08] flex gap-2'>
          {onBack && (
            <Button variant='ghost' size='md' onClick={onBack} className='shrink-0'>
              Back
            </Button>
          )}
          <Button variant='primary' size='md' onClick={onCheckout} disabled={ctaDisabled} fullWidth>
            {ctaLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

const EmptyHint = () => (
  <div className='py-8 text-center'>
    <div className='font-display text-sm text-white/55'>No tickets yet</div>
    <p className='mt-2 text-[11px] text-white/40 leading-relaxed'>
      Tap a seat or add quantity to start your order.
    </p>
  </div>
)
