import { useNavigate } from 'react-router-dom'
import CountdownPill from '../../ui/CountdownPill'
import { cn } from '../../../types/ui'
import glass from '../../../styles/effects/glass.module.css'

export type SaleStep = 'venue' | 'seats' | 'pay'

interface StepHeaderProps {
  step: SaleStep
  title: string
  /** "Sat, Jun 22 · Greek Theatre" — texto descriptivo bajo el title. */
  subtitle?: string
  /** Override del onBack — sin esto, vuelve al step anterior o nav back. */
  onBack?: () => void
  /** Si se pasa, alimenta el CountdownPill del header. */
  eventLabel?: string
}

export default function StepHeader({ step, title, subtitle, onBack, eventLabel }: StepHeaderProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) onBack()
    else navigate(-1)
  }

  return (
    <header className={cn(glass.glassNav, 'sticky top-0 z-30 w-full border-b border-white/[0.08]')}>
      <div className='mx-auto max-w-5xl px-4 lg:px-10 h-16 lg:h-20 flex items-center gap-3'>
        <button
          type='button'
          aria-label='Go back'
          onClick={handleBack}
          className='grid h-10 w-10 shrink-0 place-items-center rounded-glass-sm border border-white/15 text-white bg-white/[0.06] hover:bg-white/[0.10] transition'
        >
          <BackIcon />
        </button>

        <div className='flex-1 min-w-0 text-center'>
          <div className='flex items-center justify-center gap-2 text-[10px] font-display font-bold uppercase tracking-[0.16em] text-white/55'>
            <StepDot active />
            <span className={cn(step === 'venue' ? 'text-brand-hi' : '')}>Section</span>
            <span className='text-white/30'>·</span>
            <StepDot active={step === 'seats' || step === 'pay'} />
            <span className={cn(step === 'seats' || step === 'pay' ? 'text-brand-hi' : '')}>
              Seats
            </span>
            <span className='text-white/30'>·</span>
            <StepDot active={step === 'pay'} />
            <span className={cn(step === 'pay' ? 'text-brand-hi' : '')}>Pay</span>
          </div>
          <div className='mt-1 font-display text-sm font-semibold text-white tracking-tight truncate'>
            {title}
          </div>
          {subtitle && (
            <div className='text-[10.5px] text-white/55 mt-0.5 truncate'>{subtitle}</div>
          )}
        </div>

        <div className='shrink-0'>
          <CountdownPill eventLabel={eventLabel} size='sm' />
        </div>
      </div>
    </header>
  )
}

const StepDot = ({ active }: { active: boolean }) => (
  <span
    aria-hidden
    className={cn('inline-block h-1.5 w-1.5 rounded-full', active ? 'bg-brand-hi' : 'bg-white/25')}
  />
)

const BackIcon = () => (
  <svg width='14' height='14' viewBox='0 0 14 14' fill='none' aria-hidden>
    <path
      d='M9 2 4 7l5 5'
      stroke='currentColor'
      strokeWidth='1.6'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
)
