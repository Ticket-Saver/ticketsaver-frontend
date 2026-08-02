import { useNavigate } from 'react-router-dom'
import LayoutV2 from '../../layouts/LayoutV2'
import StatsRow from '../../components/v2/info/StatsRow'
import PrinciplesList from '../../components/v2/info/PrinciplesList'
import TeamGrid from '../../components/v2/info/TeamGrid'
import { Button } from '../../components/ui'
import gradients from '../../styles/effects/gradients.module.css'

const STATS = [
  { label: 'Events', value: '1.2K' },
  { label: 'Fans', value: '84K' },
  { label: 'Saved in fees', value: '$2.1M' }
]

const PRINCIPLES = [
  {
    title: 'Face value, always',
    body: 'No dynamic pricing. No mystery fees. The price you see is what artists asked for.'
  },
  {
    title: 'Tickets are yours',
    body: 'Every ticket is an NFT in your wallet. You own it, control it, and keep it after the show.'
  },
  {
    title: 'Resales without scalpers',
    body: 'Resell at face value or below. We cap markups so bots can’t profit at your expense.'
  },
  {
    title: 'Built for the night',
    body: 'Wallet QR at the door, Apple Wallet for the train, a collectible after — designed for real life.'
  }
]

const TEAM = [
  { name: 'Dani', role: 'Founder', color: '#FFB1C8' },
  { name: 'Luca', role: 'Engineering', color: '#D4A8F0' },
  { name: 'Mara', role: 'Design', color: '#7C5BC4' },
  { name: 'Theo', role: 'Growth', color: '#7DFFB0' },
  { name: 'Inés', role: 'Support', color: '#FFE0A0' },
  { name: 'Bruno', role: 'Partnerships', color: '#B0F0FF' }
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
            Live music, without the gatekeepers.
          </h1>
          <p className='mt-5 text-[15px] lg:text-base text-white/72 leading-relaxed'>
            TicketSaver is a ticketing platform built by fans, for fans. We sell tickets at face
            value, mint them as NFTs on Base so they can’t be faked, and let resales happen only at
            fair prices.
          </p>
        </header>

        <StatsRow stats={STATS} />

        <section>
          <h2 className='font-display text-xl lg:text-2xl font-semibold text-white tracking-tight mb-4'>
            What we believe
          </h2>
          <PrinciplesList principles={PRINCIPLES} />
        </section>

        <section>
          <h2 className='font-display text-xl lg:text-2xl font-semibold text-white tracking-tight mb-4'>
            The team
          </h2>
          <TeamGrid members={TEAM} />
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
