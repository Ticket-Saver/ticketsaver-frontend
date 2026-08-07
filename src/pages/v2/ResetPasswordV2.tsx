import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AuthShell, { Field, inputClass } from '../../components/v2/auth/AuthShell'
import { Button, useToast } from '../../components/ui'

export default function ResetPasswordV2() {
  const { resetPassword, status } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

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
      await resetPassword(password, passwordConfirmation)
      toast.show({
        variant: 'success',
        title: 'Password updated',
        message: 'You can now log in with your new password.'
      })
      // Cambio forzado (usuario migrado ya autenticado) -> home; recovery sin sesion -> login.
      navigate(status === 'authenticated' ? '/' : '/login')
    } catch (err) {
      toast.show({
        variant: 'error',
        message: err instanceof Error ? err.message : 'This reset link is invalid or has expired.'
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      title='Set a new password'
      footer={
        <Link to='/login' className='text-brand-hi font-semibold hover:text-white transition'>
          Back to login
        </Link>
      }
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
          {submitting ? 'Saving…' : 'Save new password'}
        </Button>
      </form>
    </AuthShell>
  )
}
