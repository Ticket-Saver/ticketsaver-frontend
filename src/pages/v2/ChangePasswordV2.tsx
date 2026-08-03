import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AuthShell, { Field, inputClass } from '../../components/v2/auth/AuthShell'
import { Button, useToast } from '../../components/ui'

/**
 * Cambio de contraseña forzado para usuarios migrados (evento 24). Entraron con una
 * pass temporal enviada por mail; el gate de Router los trae acá hasta que definan
 * una nueva. Al guardar se limpia must_change_password y siguen a su destino.
 */
export default function ChangePasswordV2() {
  const { changePassword, refresh } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()

  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo ?? '/'
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (password !== passwordConfirmation) {
      toast.show({ variant: 'warn', title: 'Check the form', message: 'Passwords do not match.' })
      return
    }
    setSubmitting(true)
    try {
      await changePassword(password)
      // Refrescamos el user para que mustChangePassword quede en false antes de salir;
      // si no, el gate del Router rebota de nuevo a esta pantalla.
      await refresh()
      toast.show({
        variant: 'success',
        title: 'Password updated',
        message: 'Your account is ready.'
      })
      navigate(returnTo, { replace: true })
    } catch (err) {
      toast.show({
        variant: 'error',
        message: err instanceof Error ? err.message : 'Could not update the password. Try again.'
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      title='Set your password'
      subtitle='You logged in with a temporary password. Choose a new one to finish setting up your account.'
    >
      <form onSubmit={handleSubmit} className='space-y-4'>
        <Field label='New password'>
          <input
            type='password'
            required
            minLength={8}
            autoComplete='new-password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='At least 8 characters'
            className={inputClass}
          />
        </Field>
        <Field label='Confirm new password'>
          <input
            type='password'
            required
            minLength={8}
            autoComplete='new-password'
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            placeholder='Repeat your password'
            className={inputClass}
          />
        </Field>
        <Button type='submit' variant='primary' size='lg' fullWidth disabled={submitting}>
          {submitting ? 'Saving…' : 'Save and continue'}
        </Button>
      </form>
    </AuthShell>
  )
}
