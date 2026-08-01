import { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { Button, useToast } from '../../ui'

/**
 * Botones "Continue with Google / Apple". Disparan el OAuth redirect de Supabase;
 * el email queda verificado por el proveedor y el teléfono se pide después vía el
 * gate de Router (/verify-phone). No navega acá: Supabase redirige el navegador.
 */
export default function SocialAuthButtons() {
  const { loginWithProvider } = useAuth()
  const toast = useToast()
  const [busy, setBusy] = useState<'google' | 'apple' | null>(null)

  const go = async (provider: 'google' | 'apple') => {
    setBusy(provider)
    try {
      await loginWithProvider(provider)
      // El navegador se va al proveedor; si vuelve sin redirigir, liberamos el botón.
    } catch (err) {
      toast.show({
        variant: 'error',
        title: 'Sign-in failed',
        message: err instanceof Error ? err.message : 'Could not start social sign-in.'
      })
      setBusy(null)
    }
  }

  return (
    <div className='space-y-3'>
      <div className='flex items-center gap-3 text-[12px] text-white/40'>
        <span className='h-px flex-1 bg-white/10' />
        or
        <span className='h-px flex-1 bg-white/10' />
      </div>
      <Button
        type='button'
        variant='ghost'
        size='lg'
        fullWidth
        disabled={busy !== null}
        onClick={() => go('google')}
        leadingIcon={<GoogleIcon />}
      >
        {busy === 'google' ? 'Redirecting…' : 'Continue with Google'}
      </Button>
      <Button
        type='button'
        variant='ghost'
        size='lg'
        fullWidth
        disabled={busy !== null}
        onClick={() => go('apple')}
        leadingIcon={<AppleIcon />}
      >
        {busy === 'apple' ? 'Redirecting…' : 'Continue with Apple'}
      </Button>
    </div>
  )
}

const GoogleIcon = () => (
  <svg width='18' height='18' viewBox='0 0 18 18' aria-hidden='true'>
    <path fill='#4285F4' d='M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z' />
    <path fill='#34A853' d='M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z' />
    <path fill='#FBBC05' d='M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z' />
    <path fill='#EA4335' d='M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z' />
  </svg>
)

const AppleIcon = () => (
  <svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor' aria-hidden='true'>
    <path d='M16.36 12.78c.03 3.06 2.68 4.08 2.71 4.09-.02.07-.42 1.45-1.4 2.87-.84 1.23-1.72 2.45-3.1 2.48-1.36.03-1.8-.8-3.35-.8-1.56 0-2.04.78-3.32.83-1.34.05-2.36-1.33-3.21-2.55-1.74-2.5-3.06-7.08-1.28-10.17.88-1.53 2.46-2.5 4.18-2.53 1.3-.02 2.54.88 3.35.88.8 0 2.3-1.09 3.88-.93.66.03 2.5.27 3.69 2-.1.06-2.2 1.28-2.18 3.83M13.9 3.5c.72-.87 1.2-2.08 1.07-3.28-1.03.04-2.28.69-3.02 1.56-.66.77-1.24 2-1.08 3.18 1.15.09 2.32-.59 3.03-1.46' />
  </svg>
)
