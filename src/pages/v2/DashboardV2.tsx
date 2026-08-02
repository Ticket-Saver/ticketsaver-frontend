import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import LayoutV2 from '../../layouts/LayoutV2'
import { config as wagmiConfig } from '../../components/mintWagmi/wagmi'
import { cn } from '../../types/ui'
import glass from '../../styles/effects/glass.module.css'

const queryClient = new QueryClient()

const UserIcon = () => (
  <svg width='15' height='15' viewBox='0 0 18 18' fill='none' aria-hidden>
    <circle cx='9' cy='6.5' r='3' stroke='currentColor' strokeWidth='1.4' />
    <path
      d='M3 15c1-3 3.5-4 6-4s5 1 6 4'
      stroke='currentColor'
      strokeWidth='1.4'
      strokeLinecap='round'
    />
  </svg>
)

const TicketIcon = () => (
  <svg width='15' height='15' viewBox='0 0 18 18' fill='none' aria-hidden>
    <path
      d='M2 6.5a1.5 1.5 0 0 0 0 3v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5a1.5 1.5 0 0 0 0-3V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2.5Z'
      stroke='currentColor'
      strokeWidth='1.4'
    />
    <path d='M9 4v9' stroke='currentColor' strokeWidth='1.4' strokeDasharray='1.5 1.5' />
  </svg>
)

const WalletIcon = () => (
  <svg width='15' height='15' viewBox='0 0 18 18' fill='none' aria-hidden>
    <rect x='2' y='4.5' width='14' height='10' rx='2' stroke='currentColor' strokeWidth='1.4' />
    <path d='M12 9.5h2.5' stroke='currentColor' strokeWidth='1.4' strokeLinecap='round' />
  </svg>
)

const CogIcon = () => (
  <svg width='15' height='15' viewBox='0 0 18 18' fill='none' aria-hidden>
    <circle cx='9' cy='9' r='2.4' stroke='currentColor' strokeWidth='1.4' />
    <path
      d='M9 1.5v2M9 14.5v2M15.5 9h-2M4.5 9h-2M13.6 4.4l-1.4 1.4M5.8 12.2l-1.4 1.4M13.6 13.6l-1.4-1.4M5.8 5.8 4.4 4.4'
      stroke='currentColor'
      strokeWidth='1.4'
      strokeLinecap='round'
    />
  </svg>
)

const HelpIcon = () => (
  <svg width='15' height='15' viewBox='0 0 18 18' fill='none' aria-hidden>
    <circle cx='9' cy='9' r='6.5' stroke='currentColor' strokeWidth='1.4' />
    <path
      d='M7 7c0-1.1.9-2 2-2s2 .9 2 2c0 1-2 1.5-2 2.7M9 12.5h.01'
      stroke='currentColor'
      strokeWidth='1.4'
      strokeLinecap='round'
    />
  </svg>
)

const NAV_ITEMS = [
  { to: '/dashboard/profile', label: 'Profile', icon: <UserIcon /> },
  {
    to: '/dashboard/tickets/upcomingevent',
    label: 'Tickets',
    icon: <TicketIcon />,
    matchPrefix: '/dashboard/tickets'
  },
  { to: '/dashboard/web3', label: 'Wallet', icon: <WalletIcon /> },
  { to: '/dashboard/settings', label: 'Settings', icon: <CogIcon /> },
  { to: '/dashboard/help', label: 'Help', icon: <HelpIcon /> }
]

/**
 * DashboardV2 — shell para /dashboard/*.
 *
 * Monta el `WagmiProvider` + `QueryClientProvider` (necesarios para
 * `Web3V2`) y un sidebar lateral con navegación entre secciones.
 *
 * `/dashboard/tickets/*` queda excluido — esa vista tiene su propio
 * shell (`MyTicketsV2`) ya en B6.
 */
export default function DashboardV2() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <LayoutV2 hideFooter meshSeed={7}>
          <div className='mx-auto max-w-7xl px-5 lg:px-10 pt-6 lg:pt-10 pb-16'>
            <div className='grid gap-6 lg:grid-cols-[240px_1fr] lg:items-start'>
              <DashboardSidebar />
              <main className='min-w-0'>
                <Outlet />
              </main>
            </div>
          </div>
        </LayoutV2>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

const DashboardSidebar = () => {
  const { pathname } = useLocation()
  return (
    <aside
      className={cn(glass.glassMd, 'rounded-glass-lg p-3 lg:sticky lg:top-24 self-start')}
      aria-label='Dashboard navigation'
    >
      <nav className='flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible no-scrollbar'>
        {NAV_ITEMS.map((item) => {
          const matchesPrefix = item.matchPrefix ? pathname.startsWith(item.matchPrefix) : false
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={!item.matchPrefix}
              className={({ isActive }) => {
                const active = isActive || matchesPrefix
                return cn(
                  'flex items-center gap-2.5 rounded-glass-sm px-3 py-2.5 text-[13px] font-display font-medium tracking-tight transition shrink-0',
                  active
                    ? 'bg-white text-brand-ink shadow-cover-glow'
                    : 'text-white/75 hover:bg-white/[0.06] hover:text-white'
                )
              }}
            >
              <span aria-hidden className='shrink-0'>
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
