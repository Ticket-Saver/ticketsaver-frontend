import { useEffect, useState } from 'react'
import { Button, GlassCard } from '../ui'
import { useCookieConsent } from '../../hooks/useCookieConsent'
import {
  acceptAllConsent,
  rejectNonEssentialConsent,
  saveConsent,
  onReopenCookieSettings
} from '../../lib/consent/cookieConsent'

/**
 * Banner de cookies + panel de configuración por categoría. Bloquea de verdad
 * los pixeles de marketing (ver lib/tracking/pixels.ts, gateado por
 * hasMarketingConsent()) hasta que el usuario decide — no es solo un cartel
 * informativo. Se reabre desde el link "Cookies" del Footer.
 */
export default function CookieConsentBanner() {
  const consent = useCookieConsent()
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [draft, setDraft] = useState({ analytics: consent.analytics, marketing: consent.marketing })

  useEffect(() => {
    if (!consent.decided) setVisible(true)
  }, [consent.decided])

  useEffect(
    () =>
      onReopenCookieSettings(() => {
        setDraft({ analytics: consent.analytics, marketing: consent.marketing })
        setExpanded(true)
        setVisible(true)
      }),
    [consent.analytics, consent.marketing]
  )

  if (!visible) return null

  const close = () => {
    setVisible(false)
    setExpanded(false)
  }

  const handleAcceptAll = () => {
    acceptAllConsent()
    close()
  }

  const handleRejectAll = () => {
    rejectNonEssentialConsent()
    close()
  }

  const handleSaveDraft = () => {
    saveConsent(draft)
    close()
  }

  return (
    <div
      className='fixed inset-x-0 bottom-0 z-[70] p-3 sm:p-5'
      role='dialog'
      aria-modal='false'
      aria-label='Configuración de cookies'
    >
      <GlassCard
        depth='lg'
        radius='lg'
        className='mx-auto max-w-3xl p-5 sm:p-6 border border-white/15'
      >
        {!expanded ? (
          <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
            <div className='flex-1 min-w-0'>
              <p className='font-display text-sm font-semibold text-white'>Usamos cookies</p>
              <p className='mt-1 text-[12.5px] leading-relaxed text-white/65'>
                Las necesarias para que el sitio funcione (carrito, sesión de compra) siempre están
                activas. Con tu permiso, también usamos cookies de marketing para que los
                organizadores puedan medir sus campañas en cada evento.
              </p>
            </div>
            <div className='flex flex-wrap items-center gap-2 shrink-0'>
              <button
                type='button'
                onClick={() => setExpanded(true)}
                className='px-4 h-11 text-sm font-display font-medium text-white/70 hover:text-white transition'
              >
                Personalizar
              </button>
              <Button variant='ghost' size='md' onClick={handleRejectAll}>
                Rechazar
              </Button>
              <Button variant='primary' size='md' onClick={handleAcceptAll}>
                Aceptar todo
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <p className='font-display text-sm font-semibold text-white'>
                  Configuración de cookies
                </p>
                <p className='mt-1 text-[12.5px] text-white/60'>
                  Elegí qué categorías querés permitir. Podés cambiarlo cuando quieras desde
                  "Cookies" al pie de la página.
                </p>
              </div>
              <IconClose onClick={close} />
            </div>

            <div className='mt-4 space-y-2.5'>
              <ConsentRow
                title='Necesarias'
                description='Carrito, sesión de compra y seguridad. No se pueden desactivar.'
                checked
                locked
              />
              <ConsentRow
                title='Analíticas'
                description='Nos ayudan a entender cómo se usa el sitio para mejorarlo.'
                checked={draft.analytics}
                onToggle={() => setDraft((d) => ({ ...d, analytics: !d.analytics }))}
              />
              <ConsentRow
                title='Marketing'
                description='Pixeles de Facebook/YouTube que cada organizador usa para medir sus campañas en su evento.'
                checked={draft.marketing}
                onToggle={() => setDraft((d) => ({ ...d, marketing: !d.marketing }))}
              />
            </div>

            <div className='mt-5 flex flex-wrap justify-end gap-2'>
              <Button variant='ghost' size='md' onClick={handleRejectAll}>
                Rechazar no esenciales
              </Button>
              <Button variant='primary' size='md' onClick={handleSaveDraft}>
                Guardar preferencias
              </Button>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  )
}

interface ConsentRowProps {
  title: string
  description: string
  checked: boolean
  locked?: boolean
  onToggle?: () => void
}

const ConsentRow = ({ title, description, checked, locked, onToggle }: ConsentRowProps) => (
  <div className='flex items-start justify-between gap-4 rounded-glass-sm bg-white/[0.04] border border-white/[0.08] px-4 py-3'>
    <div className='min-w-0'>
      <p className='text-[13px] font-display font-semibold text-white'>{title}</p>
      <p className='mt-0.5 text-[12px] text-white/55'>{description}</p>
    </div>
    <button
      type='button'
      role='switch'
      aria-checked={checked}
      disabled={locked}
      onClick={onToggle}
      className={
        'shrink-0 mt-0.5 relative w-10 h-6 rounded-pill transition ' +
        (checked ? 'bg-brand-hi' : 'bg-white/15') +
        (locked ? ' opacity-60 cursor-not-allowed' : ' cursor-pointer')
      }
    >
      <span
        className={
          'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ' +
          (checked ? 'translate-x-[18px]' : 'translate-x-0.5')
        }
      />
    </button>
  </div>
)

const IconClose = ({ onClick }: { onClick: () => void }) => (
  <button
    type='button'
    onClick={onClick}
    aria-label='Cerrar'
    className='shrink-0 h-8 w-8 grid place-items-center rounded-pill text-white/50 hover:text-white hover:bg-white/10 transition'
  >
    <svg width='14' height='14' viewBox='0 0 14 14' fill='none' aria-hidden>
      <path
        d='M2 2 12 12M12 2 2 12'
        stroke='currentColor'
        strokeWidth='1.6'
        strokeLinecap='round'
      />
    </svg>
  </button>
)
