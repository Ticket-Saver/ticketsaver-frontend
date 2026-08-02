import { useState } from 'react'
import { Button, Pill, GlassCard, Chip, IconButton, MeshBackground } from '../../components/ui'
import gradients from '../../styles/effects/gradients.module.css'
import { COVER_KEYS, getCoverPalette } from '../../lib/covers/palettes'
import { coverHash } from '../../lib/covers/coverHash'

const SAMPLE_LABELS = [
  'arca-niteglow',
  'mitski-laurel',
  'fkj-blue-room',
  'cobra-clubnight',
  'hamilton',
  'rhcp-stadium',
  'sofi-tukker',
  'phoebe',
  'kraftwerk',
  'comedy-night'
]

const IconCart = () => (
  <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
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

const IconSearch = () => (
  <svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
    <circle cx='11' cy='11' r='6' stroke='currentColor' strokeWidth='1.6' />
    <path d='M16 16l4 4' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
  </svg>
)

const SectionTitle = ({ children }: { children: string }) => (
  <h2 className='font-display text-sm uppercase tracking-[0.18em] text-white/55 mb-4'>
    {children}
  </h2>
)

export default function DesignCheck() {
  const [paused, setPaused] = useState(false)
  const [selectedChip, setSelectedChip] = useState('Electronic')

  return (
    <div className='relative min-h-screen text-white font-body'>
      <MeshBackground paused={paused} />

      <div className='relative z-10 mx-auto max-w-5xl px-6 py-12 space-y-12'>
        <header className='space-y-3'>
          <p className='font-display text-xs uppercase tracking-[0.22em] text-brand-hi'>
            TicketSaver v2 · Block 0
          </p>
          <h1 className={`font-display text-5xl font-bold tracking-tight ${gradients.textBrand}`}>
            Design system check
          </h1>
          <p className='text-white/65 max-w-xl text-sm leading-relaxed'>
            Página temporal para verificar que los tokens, primitives y el MeshBackground se
            renderizan correctamente. Eliminar antes de producción.
          </p>
          <Button variant='ghost' size='sm' onClick={() => setPaused((p) => !p)}>
            {paused ? 'Resume mesh' : 'Pause mesh'}
          </Button>
        </header>

        <section>
          <SectionTitle>Brand colors</SectionTitle>
          <div className='grid grid-cols-4 gap-3'>
            {(
              [
                ['ink', 'bg-brand-ink'],
                ['lo', 'bg-brand-lo'],
                ['mid', 'bg-brand-mid'],
                ['hi', 'bg-brand-hi']
              ] as const
            ).map(([name, cls]) => (
              <GlassCard key={name} depth='md' radius='md' className='p-3'>
                <div className={`h-16 w-full rounded-glass-sm ${cls}`} />
                <div className='mt-2 text-xs text-white/70'>brand-{name}</div>
              </GlassCard>
            ))}
          </div>
          <div className='mt-3 grid grid-cols-5 gap-3'>
            {(
              [
                ['pink', 'bg-accent-pink'],
                ['mint', 'bg-accent-mint'],
                ['coral', 'bg-accent-coral'],
                ['amber', 'bg-accent-amber'],
                ['aqua', 'bg-accent-aqua']
              ] as const
            ).map(([name, cls]) => (
              <GlassCard key={name} depth='sm' radius='sm' className='p-2'>
                <div className={`h-10 w-full rounded ${cls}`} />
                <div className='mt-1.5 text-[10.5px] text-white/65'>{name}</div>
              </GlassCard>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle>Buttons</SectionTitle>
          <div className='flex flex-wrap gap-3'>
            <Button variant='primary' size='sm'>
              Primary sm
            </Button>
            <Button variant='primary' size='md'>
              Primary md
            </Button>
            <Button variant='primary' size='lg'>
              Primary lg
            </Button>
            <Button variant='ghost'>Ghost</Button>
            <Button variant='glass'>Glass</Button>
            <Button variant='danger'>Danger</Button>
            <Button variant='primary' leadingIcon={<IconCart />}>
              Add to cart
            </Button>
            <Button variant='primary' disabled>
              Disabled
            </Button>
          </div>
        </section>

        <section>
          <SectionTitle>Pills · countdown states</SectionTitle>
          <div className='flex flex-wrap items-center gap-3'>
            <Pill state='normal' leadingDot>
              09:42
            </Pill>
            <Pill state='warn' leadingDot dotPulse>
              01:58
            </Pill>
            <Pill state='critical' leadingDot dotPulse>
              00:42
            </Pill>
            <Pill state='expired'>00:00</Pill>
            <Pill state='normal' size='sm'>
              SM
            </Pill>
            <Pill state='normal' size='lg'>
              LG pill
            </Pill>
          </div>
        </section>

        <section>
          <SectionTitle>Glass cards</SectionTitle>
          <div className='grid grid-cols-3 gap-3'>
            <GlassCard depth='sm' radius='md' className='p-5'>
              <div className='font-display text-base font-semibold'>Glass sm</div>
              <p className='mt-1 text-xs text-white/65'>14px blur, soft border</p>
            </GlassCard>
            <GlassCard depth='md' radius='md' className='p-5' hoverable>
              <div className='font-display text-base font-semibold'>Glass md · hoverable</div>
              <p className='mt-1 text-xs text-white/65'>20px blur, shadow</p>
            </GlassCard>
            <GlassCard depth='lg' radius='lg' className='p-5'>
              <div className='font-display text-base font-semibold'>Glass lg</div>
              <p className='mt-1 text-xs text-white/65'>24px blur, deep shadow</p>
            </GlassCard>
          </div>
        </section>

        <section>
          <SectionTitle>Chips · category filter</SectionTitle>
          <div className='flex flex-wrap gap-2'>
            {['Tonight', 'Electronic', 'Indie', 'Rock', 'Theatre', 'Comedy'].map((cat) => (
              <Chip
                key={cat}
                selected={selectedChip === cat}
                onClick={() => setSelectedChip(cat)}
                role='button'
              >
                {cat}
              </Chip>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle>Icon buttons</SectionTitle>
          <div className='flex flex-wrap gap-3'>
            <IconButton label='Cart' size='sm'>
              <IconCart />
            </IconButton>
            <IconButton label='Cart' size='md'>
              <IconCart />
            </IconButton>
            <IconButton label='Cart' size='lg'>
              <IconCart />
            </IconButton>
            <IconButton label='Search' variant='ghost'>
              <IconSearch />
            </IconButton>
            <IconButton label='Search' variant='solid'>
              <IconSearch />
            </IconButton>
          </div>
        </section>

        <section>
          <SectionTitle>Gradient text & effects</SectionTitle>
          <div className='space-y-3'>
            <div className={`font-display text-3xl font-bold ${gradients.textBrand}`}>
              Gradient brand text
            </div>
            <div className={`font-display text-3xl font-bold ${gradients.textPink}`}>
              Gradient pink → brand
            </div>
            <div className={`h-12 w-full rounded-glass-md ${gradients.bgBrand}`} />
            <div className={`h-12 w-full rounded-glass-md ${gradients.bgPinkBrand}`} />
          </div>
        </section>

        <section>
          <SectionTitle>Cover palette mapping (10 events)</SectionTitle>
          <div className='grid grid-cols-5 gap-3'>
            {SAMPLE_LABELS.map((label) => {
              const key = coverHash(label)
              const p = getCoverPalette(key)
              return (
                <GlassCard key={label} depth='sm' radius='md' className='overflow-hidden'>
                  <div
                    className='h-20 w-full'
                    style={{
                      background: `linear-gradient(135deg, ${p.a} 0%, ${p.b} 60%, ${p.c} 100%)`
                    }}
                  />
                  <div className='p-2'>
                    <div className='text-[10px] uppercase tracking-[0.14em] text-white/55'>
                      {key}
                    </div>
                    <div className='mt-0.5 text-xs text-white truncate'>{label}</div>
                  </div>
                </GlassCard>
              )
            })}
          </div>
          <div className='mt-2 text-[10.5px] text-white/45'>
            Same label → same palette (determinista, {COVER_KEYS.length} paletas disponibles).
          </div>
        </section>

        <section className='pt-4'>
          <SectionTitle>Mesh modes</SectionTitle>
          <p className='text-xs text-white/55 mb-3 max-w-xl'>
            Por default el mesh es dark-first: brand.ink (#0E0820) domina y el violeta aparece como
            ambient lighting. <code>vivid</code> es la paleta original brillante — usar solo para
            hero/auth screens.
          </p>
          <div className='grid grid-cols-3 gap-3'>
            <GlassCard depth='md' className='relative h-48 overflow-hidden p-0'>
              <MeshBackground seed={3} />
              <div className='absolute bottom-3 left-3 z-10 font-display text-xs uppercase tracking-[0.18em] text-white/70'>
                Violet (default · dark)
              </div>
            </GlassCard>
            <GlassCard depth='md' className='relative h-48 overflow-hidden p-0'>
              <MeshBackground seed={3} palette='vivid' />
              <div className='absolute bottom-3 left-3 z-10 font-display text-xs uppercase tracking-[0.18em] text-white/70'>
                Vivid (hero only)
              </div>
            </GlassCard>
            <GlassCard depth='md' className='relative h-48 overflow-hidden p-0'>
              <MeshBackground seed={7} palette='charcoal' />
              <div className='absolute bottom-3 left-3 z-10 font-display text-xs uppercase tracking-[0.18em] text-white/70'>
                Charcoal
              </div>
            </GlassCard>
          </div>
        </section>
      </div>
    </div>
  )
}
