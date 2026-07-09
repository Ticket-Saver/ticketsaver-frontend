import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import LayoutV2 from '../../layouts/LayoutV2'
import { GlassCard } from '../../components/ui'
import { useUserTickets, type UseUserTicketsResult } from '../../hooks/useUserTickets'
import { cn } from '../../types/ui'
import gradients from '../../styles/effects/gradients.module.css'

/** Contexto que MyTicketsV2 pasa a las tabs hijas (Upcoming / Past). */
export type MyTicketsContext = UseUserTicketsResult

const TABS = [
  { to: 'upcomingevent', label: 'Upcoming' },
  { to: 'pastevent', label: 'Past' }
] as const

/**
 * MyTicketsV2 — dashboard del usuario con sus tickets REALES de HiEvents
 * (GET /user/tickets vía `useUserTickets`, identificado por email de Auth0;
 * ver nota del hook sobre el futuro login custom).
 *
 * Header con greeting + stats reales. Las pestañas hijas (UpcomingV2 / PastV2)
 * se montan vía `<Outlet />` y reciben los datos por `useOutletContext` para no
 * re-consultar el endpoint por tab.
 */
export default function MyTicketsV2() {
  const { user } = useAuth0()
  const tickets = useUserTickets()
  const location = useLocation()

  const greeting = user?.given_name
    ? `Hey, ${user.given_name}`
    : user?.name
      ? `Hey, ${user.name.split(' ')[0]}`
      : 'Hey there'

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
              All your upcoming shows and past attendance in one place.
            </p>
          </div>
        </header>

        <div className='mt-6 grid grid-cols-3 gap-3'>
          <StatCard label='Upcoming' value={tickets.upcoming.length} />
          <StatCard label='Tickets' value={tickets.totalTickets} />
          <StatCard label='Past' value={tickets.past.length} />
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
          {tickets.error ? (
            <GlassCard depth='sm' radius='lg' className='p-8 text-center'>
              <div className='font-display text-base font-semibold text-white'>
                We couldn&apos;t load your tickets
              </div>
              <p className='mt-2 text-[12.5px] text-white/55 max-w-md mx-auto'>
                {tickets.error}
              </p>
            </GlassCard>
          ) : !tickets.loading && !tickets.email ? (
            <GlassCard depth='sm' radius='lg' className='p-8 text-center'>
              <div className='font-display text-base font-semibold text-white'>
                Sign in to see your tickets
              </div>
              <p className='mt-2 text-[12.5px] text-white/55 max-w-md mx-auto'>
                Your purchased tickets live in your account.
              </p>
            </GlassCard>
          ) : (
            <Outlet context={tickets satisfies MyTicketsContext} />
          )}
        </section>
      </main>
    </LayoutV2>
  )
}

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
