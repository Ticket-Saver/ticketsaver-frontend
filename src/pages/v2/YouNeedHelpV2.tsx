import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import HelpCategories, { type HelpCategory } from '../../components/v2/help/HelpCategories'
import { Button, GlassCard } from '../../components/ui'
import { cn } from '../../types/ui'
import gradients from '../../styles/effects/gradients.module.css'

const CATEGORIES: HelpCategory[] = [
  {
    id: 'tickets',
    title: 'Tickets',
    description: 'Refunds, transfers, lost tickets and seat changes.',
    icon: (
      <svg width='18' height='18' viewBox='0 0 18 18' fill='none' aria-hidden>
        <path
          d='M2 6.5a1.5 1.5 0 0 0 0 3v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5a1.5 1.5 0 0 0 0-3V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2.5Z'
          stroke='currentColor'
          strokeWidth='1.4'
        />
      </svg>
    )
  },
  {
    id: 'account',
    title: 'Account',
    description: 'Login issues, profile data and two-factor auth.',
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
  },
  {
    id: 'payments',
    title: 'Payments',
    description: 'Cards, billing receipts and currency conversion.',
    icon: (
      <svg width='18' height='18' viewBox='0 0 18 18' fill='none' aria-hidden>
        <rect x='2' y='4.5' width='14' height='10' rx='2' stroke='currentColor' strokeWidth='1.4' />
        <path d='M2 8h14' stroke='currentColor' strokeWidth='1.4' />
      </svg>
    )
  },
  {
    id: 'wallet',
    title: 'Wallet & NFTs',
    description: 'Connect Base, claim collectibles, transfer NFTs.',
    icon: (
      <svg width='18' height='18' viewBox='0 0 18 18' fill='none' aria-hidden>
        <rect x='2' y='4' width='14' height='11' rx='2' stroke='currentColor' strokeWidth='1.4' />
        <circle cx='12.5' cy='9.5' r='1.2' fill='currentColor' />
      </svg>
    )
  },
  {
    id: 'venue',
    title: 'At the venue',
    description: 'Doors, bag policy, accessibility and parking.',
    icon: (
      <svg width='18' height='18' viewBox='0 0 18 18' fill='none' aria-hidden>
        <path
          d='M3 14V8l6-4 6 4v6M7 14v-4h4v4'
          stroke='currentColor'
          strokeWidth='1.4'
          strokeLinejoin='round'
        />
      </svg>
    )
  },
  {
    id: 'safety',
    title: 'Safety & trust',
    description: 'PCI compliance, scam reports and ticket validation.',
    icon: (
      <svg width='18' height='18' viewBox='0 0 18 18' fill='none' aria-hidden>
        <path
          d='M9 1.5 3 4v4c0 4 6 8 6 8s6-4 6-8V4l-6-2.5z'
          stroke='currentColor'
          strokeWidth='1.4'
          strokeLinejoin='round'
        />
        <path
          d='m6 9 2.2 2.2L13 7'
          stroke='currentColor'
          strokeWidth='1.4'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    )
  }
]

export default function YouNeedHelpV2() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return CATEGORIES
    return CATEGORIES.filter(
      (c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    )
  }, [query])

  return (
    <div className='space-y-6'>
      <header>
        <p className='text-[11px] text-white/55 uppercase tracking-[0.16em] font-display font-bold'>
          Help center
        </p>
        <h1
          className={`mt-1 font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${gradients.textBrandSoft}`}
        >
          How can we help?
        </h1>
        <p className='mt-2 text-sm text-white/55 max-w-xl'>
          Search the knowledge base or contact us directly — average response time under 4 hours.
        </p>
      </header>

      <SearchBox value={query} onChange={setQuery} />

      <HelpCategories categories={filtered} />

      {filtered.length === 0 && (
        <GlassCard depth='sm' radius='lg' className='p-6 text-center'>
          <div className='font-display text-base font-semibold text-white'>
            No matches for &quot;{query}&quot;
          </div>
          <p className='mt-2 text-[12.5px] text-white/55'>
            Try a different keyword or contact support below.
          </p>
        </GlassCard>
      )}

      <ContactCTA />
    </div>
  )
}

const SearchBox = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <label
    className={cn(
      'flex items-center gap-2.5 rounded-pill bg-white/[0.06] border border-white/10 px-4 h-12 text-sm text-white/85',
      'focus-within:border-brand-mid/60 transition'
    )}
  >
    <svg width='15' height='15' viewBox='0 0 16 16' fill='none' aria-hidden>
      <circle cx='7' cy='7' r='5' stroke='currentColor' strokeWidth='1.6' />
      <path d='m11 11 3 3' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
    </svg>
    <input
      type='search'
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder='Search help articles…'
      className='flex-1 bg-transparent outline-none placeholder:text-white/40 font-body'
      aria-label='Search help'
    />
    {value && (
      <button
        type='button'
        aria-label='Clear search'
        onClick={() => onChange('')}
        className='text-white/55 hover:text-white transition text-base'
      >
        ×
      </button>
    )}
  </label>
)

const ContactCTA = () => (
  <GlassCard depth='md' radius='lg' className='p-5 lg:p-6'>
    <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
      <div className='min-w-0'>
        <div className='text-[10.5px] uppercase tracking-[0.16em] font-display font-bold text-brand-hi'>
          Still stuck?
        </div>
        <h2 className='mt-1 font-display text-lg lg:text-xl font-semibold text-white tracking-tight'>
          Talk to our team
        </h2>
        <p className='mt-1 text-[12.5px] text-white/65 max-w-md'>
          We&apos;re humans in 3 time zones. Average response under 4 hours.
        </p>
      </div>
      <div className='flex gap-2 shrink-0'>
        <Button
          variant='ghost'
          size='md'
          onClick={() => {
            window.location.href = 'mailto:ticketing@ticketsaver.net'
          }}
        >
          Email us
        </Button>
        <Link to='/footer/contact'>
          <Button variant='primary' size='md'>
            Open ticket
          </Button>
        </Link>
      </div>
    </div>
  </GlassCard>
)
