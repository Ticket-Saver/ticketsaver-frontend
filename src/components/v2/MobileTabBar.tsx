import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../types/ui'

interface Tab {
  id: string
  label: string
  to: string
  /** Cuando la URL empieza con uno de estos prefijos, el tab queda activo */
  match: string[]
  icon: JSX.Element
}

const TABS: Tab[] = [
  {
    id: 'home',
    label: 'Home',
    to: '/',
    match: ['/'],
    icon: (
      <svg width='18' height='18' viewBox='0 0 18 18' fill='none' aria-hidden>
        <path
          d='M3 8 9 3l6 5v6.5a1 1 0 0 1-1 1h-3.5v-4h-3v4H4a1 1 0 0 1-1-1V8Z'
          stroke='currentColor'
          strokeWidth='1.5'
          strokeLinejoin='round'
        />
      </svg>
    )
  },
  {
    id: 'discover',
    label: 'Discover',
    to: '/events',
    match: ['/events', '/event/'],
    icon: (
      <svg width='18' height='18' viewBox='0 0 18 18' fill='none' aria-hidden>
        <circle cx='8' cy='8' r='5' stroke='currentColor' strokeWidth='1.5' />
        <path
          d='m12 12 3.5 3.5'
          stroke='currentColor'
          strokeWidth='1.5'
          strokeLinecap='round'
        />
      </svg>
    )
  },
  {
    id: 'tickets',
    label: 'Tickets',
    to: '/dashboard/tickets/upcomingevent',
    match: ['/dashboard/tickets'],
    icon: (
      <svg width='18' height='18' viewBox='0 0 18 18' fill='none' aria-hidden>
        <path
          d='M2 6.5a1.5 1.5 0 0 0 0 3v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5a1.5 1.5 0 0 0 0-3V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2.5Z'
          stroke='currentColor'
          strokeWidth='1.4'
        />
        <path
          d='M9 4v9'
          stroke='currentColor'
          strokeWidth='1.4'
          strokeDasharray='1.5 1.5'
        />
      </svg>
    )
  },
  {
    id: 'profile',
    label: 'Profile',
    to: '/dashboard/profile',
    match: ['/dashboard/profile', '/dashboard/settings', '/dashboard/help', '/dashboard/web3'],
    icon: (
      <svg width='18' height='18' viewBox='0 0 18 18' fill='none' aria-hidden>
        <circle cx='9' cy='6.5' r='3' stroke='currentColor' strokeWidth='1.4' />
        <path
          d='M3 15c1-3 3.5-4 6-4s5 1 6 4'
          stroke='currentColor'
          strokeWidth='1.4'
          strokeLinecap='round'
        />
      </svg>
    )
  }
]

const isActive = (pathname: string, tab: Tab) => {
  for (const prefix of tab.match) {
    if (prefix === '/' && pathname === '/') return true
    if (prefix !== '/' && pathname.startsWith(prefix)) return true
  }
  return false
}

export default function MobileTabBar() {
  const { pathname } = useLocation()

  return (
    <nav
      aria-label='Primary mobile navigation'
      className='md:hidden fixed inset-x-3 bottom-3 z-nav p-1.5 rounded-[22px] bg-brand-ink/55 backdrop-blur-glass-hero border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.4)]'
      style={{
        paddingBottom: 'calc(0.375rem + env(safe-area-inset-bottom, 0px))'
      }}
    >
      <ul className='flex'>
        {TABS.map((tab) => {
          const active = isActive(pathname, tab)
          return (
            <li key={tab.id} className='flex-1'>
              <Link
                to={tab.to}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center gap-0.5 rounded-2xl py-2 px-1 transition',
                  active
                    ? 'bg-brand-hi/15 text-white'
                    : 'text-white/55 hover:text-white/85'
                )}
              >
                {tab.icon}
                <span className='text-[9.5px] font-semibold tracking-[0.02em] font-display'>
                  {tab.label}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
