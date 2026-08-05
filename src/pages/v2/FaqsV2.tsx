import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import LayoutV2 from '../../layouts/LayoutV2'
import { GlassCard } from '../../components/ui'
import { cn } from '../../types/ui'
import gradients from '../../styles/effects/gradients.module.css'

interface Faq {
  cat: string
  q: string
  a: string
}

const CATEGORIES = ['All', 'Buying', 'Refunds', 'At the door', 'Selling']

const FAQS: Faq[] = [
  {
    cat: 'Buying',
    q: 'How do I buy a ticket?',
    a: 'Create an account, pick an event, choose a section and seats, pay with card or Apple Pay. Your tickets will show instantly in "My tickets".'
  },
  {
    cat: 'Buying',
    q: 'How long do I have to complete a purchase?',
    a: 'We hold your seats for 10 minutes from when you enter the seat picker. If the timer expires, the seats return to the pool for everyone.'
  },
  {
    cat: 'Refunds',
    q: 'Do you offer refunds?',
    a: 'No, all sales are final. If an event is cancelled or rescheduled we will refund 100% to the original method of payment. For rescheduled events some policies might apply.'
  },
  {
    cat: 'At the door',
    q: 'Do I need to print my ticket?',
    a: 'No. At the door we scan the QR from your app or Apple Wallet. We recommend saving the ticket to Apple Wallet in case you have no signal.'
  },
  {
    cat: 'Selling',
    q: 'Can I resell my ticket?',
    a: 'Yes. From "My tickets" click on "Sell ticket". Set the resale price. When someone buys it we will transfer the ticket to the purchaser and provide you payment for the ticket minus applicable fees.'
  },
  {
    cat: 'At the door',
    q: 'I forgot my phone, what do I do?',
    a: 'Come to the door with your ID. We verify your identity and let you in. We can also email your tickets again if needed.'
  }
]

export default function FaqsV2() {
  const [cat, setCat] = useState('All')
  const [query, setQuery] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return FAQS.filter((f) => {
      const catMatch = cat === 'All' || f.cat === cat
      const searchMatch = !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
      return catMatch && searchMatch
    })
  }, [cat, query])

  return (
    <LayoutV2 meshSeed={5}>
      <main className='mx-auto max-w-3xl px-5 lg:px-10 py-8 lg:py-14'>
        <header>
          <p className='text-[11px] uppercase tracking-[0.18em] text-brand-hi font-display font-bold'>
            FAQs
          </p>
          <h1
            className={`mt-3 font-display text-4xl sm:text-5xl font-bold tracking-tight leading-[1.02] ${gradients.textBrandSoft}`}
          >
            Answers, fast.
          </h1>
        </header>

        <label className='mt-6 flex items-center gap-2.5 rounded-pill bg-white/[0.06] border border-white/10 px-4 h-12 text-sm text-white/85 focus-within:border-brand-mid/60 transition'>
          <svg width='15' height='15' viewBox='0 0 16 16' fill='none' aria-hidden>
            <circle cx='7' cy='7' r='5' stroke='currentColor' strokeWidth='1.6' />
            <path d='m11 11 3 3' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
          </svg>
          <input
            type='search'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search "refund", "Apple Wallet"…'
            className='flex-1 bg-transparent outline-none placeholder:text-white/40 font-body'
            aria-label='Search FAQs'
          />
        </label>

        <div className='mt-4 flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1'>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type='button'
              onClick={() => setCat(c)}
              className={cn(
                'shrink-0 rounded-pill px-3.5 py-2 text-[11.5px] font-display font-semibold border transition',
                cat === c
                  ? 'bg-white text-brand-ink border-transparent'
                  : 'bg-white/[0.05] text-white border-white/10 hover:bg-white/[0.10]'
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className='mt-5 space-y-2'>
          {visible.map((f) => {
            const isOpen = openId === f.q
            return (
              <GlassCard
                key={f.q}
                depth='sm'
                radius='md'
                className={cn('overflow-hidden transition', isOpen && 'border-brand-hi/30')}
              >
                <button
                  type='button'
                  onClick={() => setOpenId(isOpen ? null : f.q)}
                  aria-expanded={isOpen}
                  className='w-full flex items-center gap-3 px-4 py-3.5 text-left'
                >
                  <span className='flex-1 font-display text-[13.5px] font-semibold text-white tracking-tight'>
                    {f.q}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      'grid h-6 w-6 shrink-0 place-items-center rounded-pill border border-white/12 transition',
                      isOpen ? 'bg-brand-hi text-brand-ink' : 'bg-white/[0.06] text-white'
                    )}
                  >
                    <svg
                      width='10'
                      height='10'
                      viewBox='0 0 10 10'
                      fill='none'
                      style={{
                        transform: isOpen ? 'rotate(45deg)' : 'none',
                        transition: 'transform 0.2s'
                      }}
                    >
                      <path
                        d='M5 1v8M1 5h8'
                        stroke='currentColor'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                      />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div className='px-4 pb-4 text-[12.5px] text-white/70 leading-[1.55]'>{f.a}</div>
                )}
              </GlassCard>
            )
          })}
          {visible.length === 0 && (
            <GlassCard depth='sm' radius='md' className='p-6 text-center'>
              <p className='text-[13px] text-white/55'>
                No answers match your search. Try another keyword or contact us.
              </p>
            </GlassCard>
          )}
        </div>

        <GlassCard
          depth='md'
          radius='lg'
          className='mt-6 p-5 flex items-center gap-3'
          style={{
            background: 'linear-gradient(135deg, rgba(124,91,196,0.22), rgba(255,177,200,0.10))'
          }}
        >
          <div className='flex-1'>
            <div className='font-display text-[13.5px] font-semibold text-white'>
              Can’t find what you need?
            </div>
            <div className='text-[11.5px] text-white/60 mt-0.5'>
              Our team replies in under 4 hours.
            </div>
          </div>
          <Link
            to='/footer/contact'
            className='shrink-0 rounded-pill bg-white text-brand-ink px-4 py-2 text-[12px] font-display font-semibold hover:brightness-95 transition'
          >
            Contact us
          </Link>
        </GlassCard>
      </main>
    </LayoutV2>
  )
}
