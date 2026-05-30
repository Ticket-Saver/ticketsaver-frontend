import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui'

interface FooterLink {
  label: string
  to?: string
  href?: string
}

const COLS: { title: string; items: FooterLink[] }[] = [
  {
    title: 'Discover',
    items: [
      { label: 'Events', to: '/events' },
      { label: 'Artists' },
      { label: 'Venues' },
      { label: 'Categories' }
    ]
  },
  {
    title: 'Account',
    items: [
      { label: 'My tickets', to: '/dashboard/tickets/upcomingevent' },
      { label: 'Wallet', to: '/dashboard/web3' },
      { label: 'Profile', to: '/dashboard/profile' }
    ]
  },
  {
    title: 'Company',
    items: [
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/footer/contact' },
      { label: 'FAQs', to: '/faqs' }
    ]
  },
  {
    title: 'Legal',
    items: [
      { label: 'Terms', to: '/footer/terms&conditions' },
      { label: 'Privacy', to: '/footer/PrivayPolicy' },
      { label: 'PCI', to: '/footer/PCICompliance' }
    ]
  }
]

const SOCIALS: { label: string; href: string; icon: JSX.Element }[] = [
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/ticketsaver1?mibextid=LQQJ4d',
    icon: (
      <svg width='14' height='14' viewBox='0 0 24 24' fill='currentColor'>
        <path d='M22 12a10 10 0 1 0-11.6 9.9v-7H8v-2.9h2.4V9.7c0-2.4 1.4-3.8 3.6-3.8 1 0 2.1.2 2.1.2v2.3h-1.2c-1.2 0-1.5.7-1.5 1.5v1.8h2.6l-.4 2.9h-2.2v7A10 10 0 0 0 22 12z' />
      </svg>
    )
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/ticket.saver?igsh=MWdtdXF0b2VudGk5',
    icon: (
      <svg width='14' height='14' viewBox='0 0 24 24' fill='none'>
        <rect
          x='3'
          y='3'
          width='18'
          height='18'
          rx='5'
          stroke='currentColor'
          strokeWidth='1.5'
        />
        <circle cx='12' cy='12' r='4' stroke='currentColor' strokeWidth='1.5' />
        <circle cx='17.5' cy='6.5' r='1' fill='currentColor' />
      </svg>
    )
  },
  {
    label: 'X / Twitter',
    href: 'https://x.com/ticket_saver?s=08',
    icon: (
      <svg width='13' height='13' viewBox='0 0 24 24' fill='currentColor'>
        <path d='M18.244 2H21l-6.52 7.45L22 22h-6.83l-4.74-6.2L4.8 22H2.04l6.97-7.97L1.5 2h7.02l4.28 5.66L18.24 2zm-1.2 18h1.66L7.06 4H5.3l11.74 16z' />
      </svg>
    )
  }
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!email) return
    // El B9 conecta a un servicio real (newsletterService / netlify function).
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer className='relative mt-16 lg:mt-24 border-t border-white/[0.08] bg-black/30 backdrop-blur-glass'>
      <div className='mx-auto max-w-7xl px-6 lg:px-10 py-12 lg:py-16'>
        <div className='grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_repeat(4,1fr)] lg:gap-12'>
          <div className='sm:col-span-2 lg:col-span-1'>
            <div className='flex items-center gap-2.5 mb-3'>
              <img
                src='/logos/ticketsaver-icon.png'
                alt=''
                className='h-8 w-8'
              />
              <span className='font-display text-base font-semibold'>
                ticketsaver
              </span>
            </div>
            <p className='text-xs text-white/55 leading-relaxed max-w-xs font-body'>
              Face-value tickets, NFTs on Base, no scalpers. Made with care.
            </p>
            <div className='mt-3 inline-block rounded-pill bg-[rgba(0,82,255,0.18)] border border-[rgba(0,82,255,0.32)] text-[#9CBBFF] text-[10px] font-bold tracking-[0.10em] px-2.5 py-1 font-display'>
              BUILT ON BASE
            </div>

            <form onSubmit={onSubmit} className='mt-6 max-w-xs'>
              <label
                htmlFor='ts-newsletter'
                className='block text-[10px] uppercase tracking-[0.18em] text-white/45 font-bold font-display'
              >
                Stay in tune
              </label>
              <div className='mt-2 flex items-center gap-2'>
                <input
                  id='ts-newsletter'
                  type='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='you@email.com'
                  className='flex-1 rounded-pill bg-white/[0.06] border border-white/10 px-4 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-brand-mid focus:bg-white/[0.08] transition font-body'
                />
                <Button variant='primary' size='sm' type='submit'>
                  Join
                </Button>
              </div>
              {subscribed && (
                <p className='mt-2 text-[11px] text-accent-mint font-medium'>
                  Thanks — check your inbox soon.
                </p>
              )}
            </form>

            <div className='mt-6 flex gap-2.5'>
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={s.label}
                  className='grid h-8 w-8 place-items-center rounded-glass-sm bg-white/[0.06] border border-white/10 text-white/70 hover:bg-white/[0.10] hover:text-white transition'
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {COLS.map((col) => (
            <FooterColumn key={col.title} title={col.title} items={col.items} />
          ))}
        </div>

        <div className='mt-12 pt-6 border-t border-white/[0.08] flex flex-col-reverse sm:flex-row items-center justify-between gap-4 text-[11px] text-white/45 font-body'>
          <div className='flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-2'>
            <span>© {new Date().getFullYear()} TicketSaver, Inc.</span>
            <TrustBadge>PCI DSS</TrustBadge>
            <TrustBadge>Powered by Stripe</TrustBadge>
            <TrustBadge>SSL secured</TrustBadge>
          </div>
          <div className='flex gap-4 font-display tracking-[0.12em] uppercase'>
            <span>EN</span>
            <span className='text-white/30'>ES</span>
            <span className='text-white/30'>USD</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

const FooterColumn = ({
  title,
  items
}: {
  title: string
  items: FooterLink[]
}) => (
  <div>
    <div className='text-[10px] uppercase tracking-[0.18em] text-white/40 font-bold font-display'>
      {title}
    </div>
    <ul className='mt-3 flex flex-col gap-2'>
      {items.map((item) => (
        <li key={item.label}>
          {item.to ? (
            <Link
              to={item.to}
              className='text-[13px] text-white/75 hover:text-white transition font-body'
            >
              {item.label}
            </Link>
          ) : item.href ? (
            <a
              href={item.href}
              target='_blank'
              rel='noopener noreferrer'
              className='text-[13px] text-white/75 hover:text-white transition font-body'
            >
              {item.label}
            </a>
          ) : (
            <span className='text-[13px] text-white/35 cursor-default font-body'>
              {item.label}
            </span>
          )}
        </li>
      ))}
    </ul>
  </div>
)

const TrustBadge = ({ children }: { children: string }) => (
  <span className='inline-flex items-center gap-1.5 rounded-pill bg-white/[0.05] border border-white/10 px-2.5 py-1 text-[10px] font-medium text-white/65 font-display tracking-[0.04em]'>
    <span className='h-1.5 w-1.5 rounded-full bg-accent-mint' />
    {children}
  </span>
)
