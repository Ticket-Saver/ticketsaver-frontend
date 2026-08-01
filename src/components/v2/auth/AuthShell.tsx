import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import LayoutV2 from '../../../layouts/LayoutV2'
import { GlassCard } from '../../ui'
import gradients from '../../../styles/effects/gradients.module.css'

interface AuthShellProps {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}

/** Shell compartido por las pantallas de login/registro/verificación: LayoutV2 sin header/footer + card centrada. */
export default function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <LayoutV2 hideHeader hideFooter meshSeed={5}>
      <main className='min-h-screen flex items-center justify-center px-4 py-12'>
        <div className='w-full max-w-md'>
          <Link to='/' className='flex items-center justify-center gap-2 mb-8'>
            <img src='/logos/ticketsaver-icon.png' alt='' className='h-9 w-9' />
            <span className='font-display text-lg font-semibold tracking-tight text-white'>
              ticketsaver
            </span>
          </Link>

          <GlassCard depth='md' radius='lg' className='p-6 sm:p-8'>
            <h1 className={`font-display text-2xl font-bold tracking-tight text-center ${gradients.textBrandSoft}`}>
              {title}
            </h1>
            {subtitle && (
              <p className='mt-2 text-[13px] text-white/60 text-center'>{subtitle}</p>
            )}
            <div className='mt-6'>{children}</div>
          </GlassCard>

          {footer && <div className='mt-5 text-center text-[13px] text-white/55'>{footer}</div>}
        </div>
      </main>
    </LayoutV2>
  )
}

export const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className='block rounded-glass-md bg-white/[0.04] border border-white/[0.10] px-4 py-3 focus-within:border-brand-mid/60 transition'>
    <span className='block text-[9.5px] uppercase tracking-[0.14em] text-white/50 font-display font-bold mb-1.5'>
      {label}
    </span>
    {children}
  </label>
)

export const inputClass =
  'w-full bg-transparent outline-none text-[14px] text-white placeholder:text-white/35 font-body'
