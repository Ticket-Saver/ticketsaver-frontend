import { useNavigate } from 'react-router-dom'
import LayoutV2 from '../../layouts/LayoutV2'
import StatsRow from '../../components/v2/info/StatsRow'
import PrinciplesList from '../../components/v2/info/PrinciplesList'
import { Button } from '../../components/ui'
import gradients from '../../styles/effects/gradients.module.css'

const STATS = [
  { label: 'Events', value: '250+' },
  { label: 'Fans', value: '35,000+' }
]

const PRINCIPLES = [
  {
    title: 'Lower fees, always.',
    body: "We believe clients shouldn't pay abusive fees"
  },
  {
    title: 'Easy to use site',
    body: 'Our platform is user friendly, less hassle.'
  },
  {
    title: 'No third party resellers.',
    body: 'If reselling tickets it must be done through our platform. No scams.'
  },
  {
    title: 'Built for the night',
    body: "Wallet QR at the door, easy to use and add to your phone's wallet"
  }
]

export default function AboutV2() {
  const navigate = useNavigate()
  return (
    <LayoutV2 meshSeed={6}>
      <main className='mx-auto max-w-5xl px-5 lg:px-10 py-8 lg:py-14 space-y-10 lg:space-y-14'>
        <header className='max-w-2xl'>
          <p className='text-[11px] uppercase tracking-[0.18em] text-brand-hi font-display font-bold'>
            Our story
          </p>
          <h1
            className={`mt-3 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.02] ${gradients.textBrandSoft}`}
          >
            Live events, smooth experience
          </h1>
          <p className='mt-5 text-[15px] lg:text-base text-white/72 leading-relaxed'>
            TicketSaver is a ticketing platform built by promoters who understand better than anyone
            that ticketing fees should not be excessive for customers
          </p>
        </header>

        <StatsRow stats={STATS} />

        <section>
          <h2 className='font-display text-xl lg:text-2xl font-semibold text-white tracking-tight mb-4'>
            What we believe
          </h2>
          <PrinciplesList principles={PRINCIPLES} />
        </section>

        <section className='rounded-glass-lg overflow-hidden relative'>
          <div
            aria-hidden
            className='absolute inset-0'
            style={{
              background: 'linear-gradient(135deg, rgba(124,91,196,0.30), rgba(255,177,200,0.12))'
            }}
          />
          <div className='relative p-6 lg:p-10 text-center'>
            <h2 className='font-display text-2xl lg:text-3xl font-bold text-white tracking-tight'>
              Ready for your next show?
            </h2>
            <p className='mt-2 text-sm text-white/70 max-w-md mx-auto'>
              Browse events near you — face value, tickets are yours.
            </p>
            <Button
              variant='primary'
              size='lg'
              onClick={() => navigate('/events')}
              className='mt-5'
            >
              Browse events
            </Button>
          </div>
        </section>
      </main>
    </LayoutV2>
  )
}
