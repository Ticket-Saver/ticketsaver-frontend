import { useState } from 'react'
import LayoutV2 from '../../../layouts/LayoutV2'
import { GlassCard } from '../../ui'
import TableOfContents from './TableOfContents'
import LegalSection, { type LegalSectionData } from './LegalSection'
import MiniSurvey from './MiniSurvey'
import { cn } from '../../../types/ui'
import gradients from '../../../styles/effects/gradients.module.css'

interface LegalShellProps {
  /** id para el feedbackService (ej "terms", "privacy", "pci"). */
  context: string
  eyebrow: string
  title: string
  updated: string
  readTime?: string
  intro: string
  sections: LegalSectionData[]
  meshSeed?: number
}

/**
 * Shell compartido para Terms / Privacy / PCI. Muestra una sección a la
 * vez con un ToC lateral (sticky en desktop), intro "the short version",
 * micro-encuesta por sección y navegación prev/next.
 */
export default function LegalShell({
  context,
  eyebrow,
  title,
  updated,
  readTime = '4 min read',
  intro,
  sections,
  meshSeed = 7
}: LegalShellProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const active = sections[activeIdx]

  const selectById = (id: string) => {
    const idx = sections.findIndex((s) => s.id === id)
    if (idx >= 0) setActiveIdx(idx)
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <LayoutV2 meshSeed={meshSeed}>
      <main className='mx-auto max-w-5xl px-5 lg:px-10 py-6 lg:py-10'>
        <header>
          <p className='text-[11px] uppercase tracking-[0.18em] text-brand-hi font-display font-bold'>
            {eyebrow}
          </p>
          <h1
            className={cn(
              'mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight leading-[1.05]',
              gradients.textBrandSoft
            )}
          >
            {title}
          </h1>
          <div className='mt-3 flex flex-wrap items-center gap-2'>
            <MetaPill>Last updated · {updated}</MetaPill>
            <MetaPill>
              <ClockIcon /> {readTime}
            </MetaPill>
          </div>
        </header>

        <GlassCard depth='md' radius='lg' className='mt-5 p-5'>
          <div className='text-[9.5px] uppercase tracking-[0.18em] text-brand-hi font-display font-bold'>
            The short version
          </div>
          <p className='mt-2 text-[13.5px] text-white/85 leading-[1.55]'>{intro}</p>
        </GlassCard>

        <div className='mt-6 grid gap-6 lg:grid-cols-[240px_1fr] lg:items-start'>
          <div className='lg:sticky lg:top-24'>
            <GlassCard depth='sm' radius='md' className='p-3'>
              <TableOfContents
                items={sections.map((s) => ({ id: s.id, title: s.title }))}
                activeId={active.id}
                onSelect={selectById}
              />
            </GlassCard>
          </div>

          <div className='min-w-0'>
            <GlassCard depth='md' radius='lg' className='p-5 lg:p-6'>
              <LegalSection section={active} index={activeIdx} />
              <MiniSurvey context={context} sectionId={active.id} />
            </GlassCard>

            <div className='mt-4 flex gap-2'>
              {activeIdx > 0 && (
                <button
                  type='button'
                  onClick={() => selectById(sections[activeIdx - 1].id)}
                  className='flex-1 text-left rounded-glass-md bg-white/[0.05] border border-white/[0.10] px-4 py-3 hover:bg-white/[0.08] transition'
                >
                  <div className='text-[9.5px] uppercase tracking-[0.14em] text-white/45 font-display font-bold'>
                    ← Previous
                  </div>
                  <div className='text-[12px] text-white font-semibold mt-1 truncate'>
                    {sections[activeIdx - 1].title}
                  </div>
                </button>
              )}
              {activeIdx < sections.length - 1 && (
                <button
                  type='button'
                  onClick={() => selectById(sections[activeIdx + 1].id)}
                  className='flex-1 text-right rounded-glass-md bg-white/[0.05] border border-white/[0.10] px-4 py-3 hover:bg-white/[0.08] transition'
                >
                  <div className='text-[9.5px] uppercase tracking-[0.14em] text-white/45 font-display font-bold'>
                    Next →
                  </div>
                  <div className='text-[12px] text-white font-semibold mt-1 truncate'>
                    {sections[activeIdx + 1].title}
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </LayoutV2>
  )
}

const MetaPill = ({ children }: { children: React.ReactNode }) => (
  <span className='inline-flex items-center gap-1.5 rounded-pill bg-white/[0.06] border border-white/[0.12] px-2.5 py-1 text-[10.5px] text-white/75 font-display font-semibold'>
    {children}
  </span>
)

const ClockIcon = () => (
  <svg width='10' height='10' viewBox='0 0 12 12' fill='none' aria-hidden>
    <circle cx='6' cy='6' r='4.5' stroke='currentColor' strokeWidth='1.2' />
    <path d='M6 3.5V6l1.6 1' stroke='currentColor' strokeWidth='1.2' strokeLinecap='round' />
  </svg>
)
