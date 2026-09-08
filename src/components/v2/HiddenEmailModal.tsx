import { useState } from 'react'
import Drawer from '../ui/Drawer'
import { Field, inputClass } from './auth/AuthShell'
import { Button, useToast } from '../ui'
import { useAuth } from '../../context/AuthContext'
import { hiEventsService } from '../../services/hiEventsService'

const DISMISS_KEY = 'ts_hidden_email_dismissed'

/**
 * Sign in with Apple + Hide My Email genera un relay random como email de login,
 * que nunca matchea el email real de compra. Sin esto, esos customers no ven sus
 * tickets. Gateado en RequireAuth para que aparezca en cualquier página autenticada.
 */
export default function HiddenEmailModal() {
  const { user, refresh } = useAuth()
  const toast = useToast()

  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem(DISMISS_KEY) === '1')

  const isHiddenEmail = user?.email?.toLowerCase().endsWith('@privaterelay.appleid.com') ?? false
  const open = isHiddenEmail && !dismissed

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, '1')
    setDismissed(true)
  }

  const handleSave = async () => {
    if (!email) return
    setSaving(true)
    try {
      await hiEventsService.updateMyProfile({ email })
      await refresh()
      toast.show({ variant: 'success', message: 'Listo — ya deberías ver tus tickets.' })
      handleDismiss()
    } catch (err) {
      toast.show({
        variant: 'error',
        message: err instanceof Error ? err.message : 'No pudimos guardar tu email.'
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Drawer
      open={open}
      onClose={handleDismiss}
      side='bottom'
      ariaLabel='Encontrá tus tickets'
      closeOnBackdrop={false}
    >
      <div className='p-5 lg:p-6 space-y-4 bg-brand-ink'>
        <div>
          <h2 className='font-display text-base lg:text-lg font-semibold text-white'>
            Encontrá tus tickets
          </h2>
          <p className='text-[12px] text-white/55 mt-1'>
            Iniciaste sesión con un email oculto de Apple, así que no podemos relacionarlo con tu
            compra. Ingresá el email que usaste para comprar tus tickets.
          </p>
        </div>
        <Field label='Email de compra'>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='vos@ejemplo.com'
            className={inputClass}
          />
        </Field>
        <div className='flex gap-2 justify-end pt-1'>
          <Button variant='ghost' size='sm' onClick={handleDismiss} disabled={saving}>
            Ahora no
          </Button>
          <Button variant='primary' size='sm' onClick={handleSave} disabled={saving || !email}>
            {saving ? 'Guardando…' : 'Guardar'}
          </Button>
        </div>
      </div>
    </Drawer>
  )
}
