import LayoutV2 from '../../layouts/LayoutV2'
import ContactForm from '../../components/v2/info/ContactForm'
import { GlassCard } from '../../components/ui'
import gradients from '../../styles/effects/gradients.module.css'

const CHANNELS = [
  {
    icon: <MailIcon />,
    title: 'support@ticketsaver.net',
    sub: 'Buyers — refunds, wallet, access',
    href: 'mailto:support@ticketsaver.net'
  },
  {
    icon: <MailIcon />,
    title: 'ticketing@ticketsaver.net',
    sub: 'Organizers — promote a show',
    href: 'mailto:ticketing@ticketsaver.net'
  },
  {
    icon: <PhoneIcon />,
    title: '+1-956-445-9793',
    sub: 'Call or text · faster on text',
    href: 'tel:+19564459793'
  }
]

export default function ContactV2() {
  return (
    <LayoutV2 meshSeed={2}>
      <main className='mx-auto max-w-5xl px-5 lg:px-10 py-8 lg:py-14'>
        <header className='max-w-2xl'>
          <p className='text-[11px] uppercase tracking-[0.18em] text-brand-hi font-display font-bold'>
            Get in touch
          </p>
          <h1
            className={`mt-3 font-display text-4xl sm:text-5xl font-bold tracking-tight leading-[1.02] ${gradients.textBrandSoft}`}
          >
            How can we help?
          </h1>
          <p className='mt-4 text-[15px] text-white/72 leading-relaxed'>
            We answer within a few hours — usually in minutes during business hours.
          </p>
        </header>

        <div className='mt-8 grid gap-6 lg:grid-cols-[1fr_minmax(0,420px)] lg:items-start'>
          {/* Channels */}
          <div className='space-y-3 order-2 lg:order-1'>
            <h2 className='font-display text-base font-semibold text-white tracking-tight'>
              Quick channels
            </h2>
            {CHANNELS.map((c) => (
              <a key={c.title} href={c.href} className='block focus-visible:outline-none'>
                <GlassCard depth='sm' radius='md' hoverable className='p-4 flex items-center gap-3'>
                  <div
                    aria-hidden
                    className='h-10 w-10 shrink-0 rounded-glass-sm grid place-items-center text-brand-hi'
                    style={{
                      background: 'rgba(212,168,240,0.18)',
                      border: '0.5px solid rgba(212,168,240,0.30)'
                    }}
                  >
                    {c.icon}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <div className='font-display text-[13.5px] font-semibold text-white truncate'>
                      {c.title}
                    </div>
                    <div className='text-[11px] text-white/55 mt-0.5'>{c.sub}</div>
                  </div>
                </GlassCard>
              </a>
            ))}

            <GlassCard depth='sm' radius='md' className='p-4 mt-2'>
              <div className='text-[10px] uppercase tracking-[0.14em] text-white/45 font-display font-bold'>
                Corporate office
              </div>
              <p className='mt-2 text-[12.5px] text-white/72 leading-relaxed'>
                Ticket Saver LLC
                <br />
                7500 W IH 2
                <br />
                Mission, TX 78572
              </p>
            </GlassCard>
          </div>

          {/* Form */}
          <div className='order-1 lg:order-2'>
            <GlassCard depth='md' radius='lg' className='p-5 lg:p-6'>
              <h2 className='font-display text-base lg:text-lg font-semibold text-white tracking-tight mb-4'>
                Write us
              </h2>
              <ContactForm />
            </GlassCard>
          </div>
        </div>
      </main>
    </LayoutV2>
  )
}

function MailIcon() {
  return (
    <svg width='16' height='16' viewBox='0 0 16 16' fill='none' aria-hidden>
      <rect x='2' y='3' width='12' height='10' rx='1.5' stroke='currentColor' strokeWidth='1.4' />
      <path d='M2 5l6 4 6-4' stroke='currentColor' strokeWidth='1.4' strokeLinejoin='round' />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width='16' height='16' viewBox='0 0 16 16' fill='none' aria-hidden>
      <path
        d='M3 3.5c0 5 4.5 9.5 9.5 9.5l.5-2.5-3-1-1 1.2c-1.4-.7-2.7-2-3.4-3.4L6.5 6 5.5 3 3 3.5z'
        stroke='currentColor'
        strokeWidth='1.4'
        strokeLinejoin='round'
      />
    </svg>
  )
}
