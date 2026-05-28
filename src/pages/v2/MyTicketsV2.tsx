import { useMemo } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import LayoutV2 from '../../layouts/LayoutV2'
import { GlassCard, Pill } from '../../components/ui'
import { useUIEvents } from '../../hooks/useUIEvents'
import { cn } from '../../types/ui'
import gradients from '../../styles/effects/gradients.module.css'

const TABS = [
  { to: 'upcomingevent', label: 'Upcoming' },
  { to: 'pastevent', label: 'Past' },
  { to: 'collectibles', label: 'Collection' }
] as const

/**
 * MyTicketsV2 — dashboard del usuario.
 *
 * Header con greeting y wallet pill. Stats placeholder (Upcoming /
 * Collected / Tier) que en producción vendrán de un endpoint que liste
 * los tickets del usuario autenticado.
 *
 * Las pestañas hijas se montan vía `<Outlet />` (UpcomingV2, PastV2,
 * CollectiblesV2). Cada sub-ruta usa `useUIEvents` + filtros simples
 * como demo hasta que exista el backend.
 */
export default function MyTicketsV2() {
  const { user } = useAuth0()
  const { visible, all } = useUIEvents()
  const location = useLocation()

  const greeting = user?.given_name
    ? `Hey, ${user.given_name}`
    : user?.name
      ? `Hey, ${user.name.split(' ')[0]}`
      : 'Hey there'

  // Stats demo. En backend real vendría un /api/userTickets.
  const stats = useMemo(() => {
    const upcoming = visible.slice(0, 3).length
    const pastCount = all.filter((e) => e.expired).slice(0, 6).length
    return {
      upcoming,
      collected: pastCount,
      tier: pastCount >= 10 ? 'Platinum' : pastCount >= 5 ? 'Gold' : 'Silver'
    }
  }, [visible, all])

  return (
    <LayoutV2 hideFooter meshSeed={3}>
      <main className='mx-auto max-w-7xl px-5 lg:px-10 pt-6 lg:pt-10 pb-16'>
        <header className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
          <div>
            <p className='text-[11.5px] text-white/55'>{greeting}</p>
            <h1
              className={`mt-1 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${gradients.textBrandSoft}`}
            >
              My tickets
            </h1>
            <p className='mt-2 text-sm text-white/55 max-w-xl'>
              All your upcoming shows, past attendance and collectibles in one
              wallet.
            </p>
          </div>
          <WalletPill />
        </header>

        <div className='mt-6 grid grid-cols-3 gap-3'>
          <StatCard label='Upcoming' value={stats.upcoming} />
          <StatCard label='Collected' value={stats.collected} />
          <StatCard label='Tier' value={stats.tier} />
        </div>

        <nav
          role='tablist'
          aria-label='My tickets sections'
          className='mt-8 flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1'
        >
          {TABS.map((tab) => {
            const active = location.pathname.endsWith(tab.to)
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                role='tab'
                aria-selected={active}
                className={cn(
                  'shrink-0 rounded-pill px-4 py-2 text-xs font-display font-semibold tracking-tight border transition',
                  active
                    ? 'bg-white text-brand-ink border-transparent shadow-cover-glow'
                    : 'bg-white/[0.06] text-white/85 border-white/[0.12] hover:bg-white/[0.10]'
                )}
              >
                {tab.label}
              </NavLink>
            )
          })}
        </nav>

        <section className='mt-6'>
          <Outlet />
        </section>
      </main>
    </LayoutV2>
  )
}

const WalletPill = () => (
  <Pill state='normal' size='md' className='shrink-0'>
    <span className='inline-flex items-center gap-2'>
      <span
        aria-hidden
        className='h-3.5 w-3.5 rounded-pill shrink-0'
        style={{ background: 'linear-gradient(135deg, #0052FF, #6E8FFF)' }}
      />
      <span className='font-display tabular-nums'>0x3f2a…b91d</span>
    </span>
  </Pill>
)

const StatCard = ({
  label,
  value
}: {
  label: string
  value: number | string
}) => (
  <GlassCard depth='sm' radius='md' className='p-4'>
    <div className='text-[9.5px] uppercase tracking-[0.16em] font-display font-bold text-white/55'>
      {label}
    </div>
    <div className='mt-1 font-display text-2xl lg:text-3xl font-bold text-white tracking-[-0.02em] tabular-nums'>
      {value}
    </div>
  </GlassCard>
)
