import { useState, useRef, useEffect, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { Button, CountdownPill } from '../ui'
import { useCart } from '../../router/cartContext'
import { cn } from '../../types/ui'
import glass from '../../styles/effects/glass.module.css'

interface NavLink {
  to: string
  label: string
  /** Para resaltar como "activo" cuando la URL empieza con este prefijo */
  matchPrefix?: string
}

const NAV_LINKS: NavLink[] = [
  { to: '/', label: 'Home' },
  { to: '/events', label: 'Events', matchPrefix: '/events' },
  { to: '/about', label: 'About', matchPrefix: '/about' },
  { to: '/faqs', label: 'FAQs', matchPrefix: '/faqs' }
]

interface HeaderProps {
  /** Override del eventLabel para CountdownPill (sólo para /_layout-check). */
  forcedSessionLabel?: string
  /** Mock del CountdownPill para verificación. */
  mockCountdown?: { state: 'normal' | 'warn' | 'critical' | 'expired'; label: string }
}

export default function Header({ forcedSessionLabel, mockCountdown }: HeaderProps) {
  const location = useLocation()
  const { count: cartCount, openDrawer: openCart } = useCart()
  const { loginWithRedirect, isAuthenticated, user, logout } = useAuth0()

  const handleLogin = () =>
    loginWithRedirect({
      appState: { returnTo: location.pathname + location.search },
      authorizationParams: { screen_hint: 'signup' }
    })

  const handleLogout = () =>
    logout({ logoutParams: { returnTo: window.location.origin } })

  return (
    <header
      className={cn(
        glass.glassNav,
        'sticky top-0 z-nav w-full'
      )}
    >
      <div className='mx-auto flex max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-10 h-16 lg:h-20'>
        <Brand />

        <nav className='hidden lg:flex items-center gap-1 ml-2'>
          {NAV_LINKS.map((link) => {
            const isActive =
              link.to === '/'
                ? location.pathname === '/'
                : location.pathname === link.to ||
                  (link.matchPrefix &&
                    location.pathname.startsWith(link.matchPrefix))
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'rounded-pill px-3.5 py-2 text-xs font-medium font-display transition',
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-white/65 hover:text-white hover:bg-white/[0.06]'
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className='flex-1' />

        <SearchTrigger />

        <CountdownPill
          eventLabel={forcedSessionLabel}
          mock={mockCountdown}
          size='sm'
          className='hidden sm:inline-flex'
        />

        <CartTrigger count={cartCount} onClick={openCart} />

        {isAuthenticated ? (
          <UserMenu
            name={user?.name}
            email={user?.email}
            picture={user?.picture}
            onLogout={handleLogout}
          />
        ) : (
          <>
            <Button
              variant='glass'
              size='sm'
              onClick={handleLogin}
              className='hidden sm:inline-flex'
            >
              Log in
            </Button>
            <Button
              variant='glass'
              size='sm'
              onClick={handleLogin}
              className='sm:hidden'
              aria-label='Log in'
            >
              <UserIcon />
            </Button>
          </>
        )}
      </div>
    </header>
  )
}

const Brand = () => (
  <Link to='/' className='flex items-center gap-2.5 shrink-0'>
    <div className='grid h-9 w-9 place-items-center rounded-glass-sm bg-gradient-to-br from-brand-hi to-brand-mid shadow-brand-glow'>
      <svg width='16' height='16' viewBox='0 0 14 14' fill='none'>
        <path
          d='M3 4 L7 2 L11 4 L11 10 L7 12 L3 10 Z'
          stroke='#0E0820'
          strokeWidth='1.6'
          strokeLinejoin='round'
        />
        <circle cx='7' cy='7' r='1.5' fill='#0E0820' />
      </svg>
    </div>
    <span className='font-display text-lg font-semibold tracking-tight text-white'>
      ticketsaver
    </span>
  </Link>
)

const SearchTrigger = () => (
  <button
    type='button'
    aria-label='Search'
    className='hidden md:flex items-center gap-2.5 rounded-pill bg-white/[0.06] hover:bg-white/[0.10] border border-white/10 px-3.5 h-10 w-[220px] lg:w-[260px] text-xs text-white/55 transition'
  >
    <SearchIcon />
    <span className='font-body'>Search artists, venues…</span>
    <kbd className='ml-auto rounded-md bg-white/[0.08] px-1.5 py-0.5 text-[10px] text-white/55 font-display'>
      ⌘K
    </kbd>
  </button>
)

const CartTrigger = ({ count, onClick }: { count: number; onClick: () => void }) => (
  <button
    type='button'
    aria-label={count > 0 ? `Cart with ${count} items` : 'Cart'}
    onClick={onClick}
    className='relative grid h-10 w-10 place-items-center rounded-glass-sm bg-white/[0.06] border border-white/10 hover:bg-white/[0.10] text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-mid/60'
  >
    <CartIcon />
    {count > 0 && (
      <span className='absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-pill bg-gradient-to-br from-accent-pink to-brand-mid text-white text-[10px] font-bold grid place-items-center border-2 border-brand-ink font-display'>
        {count}
      </span>
    )}
  </button>
)

interface UserMenuProps {
  name?: string
  email?: string
  picture?: string
  onLogout: () => void
}

const UserMenu = ({ name, email, picture, onLogout }: UserMenuProps) => {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'U'

  return (
    <div ref={wrapRef} className='relative'>
      <button
        type='button'
        aria-label='Open user menu'
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        className='grid h-10 w-10 place-items-center rounded-pill border border-white/20 bg-gradient-to-br from-brand-hi to-brand-mid font-display text-[12px] font-bold text-brand-ink shadow-brand-glow overflow-hidden'
      >
        {picture ? (
          <img
            src={picture}
            alt={name ?? 'User avatar'}
            className='h-full w-full object-cover'
          />
        ) : (
          initials
        )}
      </button>
      {open && (
        <div
          role='menu'
          className={cn(
            'absolute right-0 mt-2 w-60 rounded-glass-md p-2 shadow-glass-deep',
            glass.glassLg
          )}
        >
          <div className='px-3 py-2'>
            <div className='font-display text-sm font-semibold text-white truncate'>
              {name ?? 'Account'}
            </div>
            {email && (
              <div className='text-[11px] text-white/55 truncate'>{email}</div>
            )}
          </div>
          <div className='my-1 h-px bg-white/10' />
          <MenuLink to='/dashboard/tickets/upcomingevent' onSelect={() => setOpen(false)}>
            My tickets
          </MenuLink>
          <MenuLink to='/dashboard/profile' onSelect={() => setOpen(false)}>
            Profile
          </MenuLink>
          <MenuLink to='/dashboard/web3' onSelect={() => setOpen(false)}>
            Wallet
          </MenuLink>
          <MenuLink to='/dashboard/settings' onSelect={() => setOpen(false)}>
            Settings
          </MenuLink>
          <MenuLink to='/dashboard/help' onSelect={() => setOpen(false)}>
            Help
          </MenuLink>
          <div className='my-1 h-px bg-white/10' />
          <button
            type='button'
            role='menuitem'
            onClick={() => {
              setOpen(false)
              onLogout()
            }}
            className='block w-full rounded-glass-sm px-3 py-2 text-left text-xs font-medium text-white/80 hover:bg-white/[0.08] transition'
          >
            Log out
          </button>
        </div>
      )}
    </div>
  )
}

const MenuLink = ({
  to,
  onSelect,
  children
}: {
  to: string
  onSelect: () => void
  children: ReactNode
}) => (
  <Link
    to={to}
    role='menuitem'
    onClick={onSelect}
    className='block rounded-glass-sm px-3 py-2 text-xs font-medium text-white/80 hover:bg-white/[0.08] hover:text-white transition'
  >
    {children}
  </Link>
)

const SearchIcon = () => (
  <svg width='14' height='14' viewBox='0 0 16 16' fill='none' aria-hidden>
    <circle cx='7' cy='7' r='5' stroke='currentColor' strokeWidth='1.6' />
    <path d='m11 11 3 3' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
  </svg>
)

const CartIcon = () => (
  <svg width='17' height='17' viewBox='0 0 24 24' fill='none' aria-hidden>
    <path
      d='M3 5h2l2 12h11l2-9H7'
      stroke='currentColor'
      strokeWidth='1.6'
      strokeLinejoin='round'
      strokeLinecap='round'
    />
    <circle cx='10' cy='20' r='1.4' fill='currentColor' />
    <circle cx='17' cy='20' r='1.4' fill='currentColor' />
  </svg>
)

const UserIcon = () => (
  <svg width='16' height='16' viewBox='0 0 18 18' fill='none' aria-hidden>
    <circle cx='9' cy='6.5' r='3' stroke='currentColor' strokeWidth='1.4' />
    <path
      d='M3 15c1-3 3.5-4 6-4s5 1 6 4'
      stroke='currentColor'
      strokeWidth='1.4'
      strokeLinecap='round'
    />
  </svg>
)
