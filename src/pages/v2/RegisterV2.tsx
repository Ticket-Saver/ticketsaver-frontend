import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AuthShell, { Field, inputClass } from '../../components/v2/auth/AuthShell'
import SocialAuthButtons from '../../components/v2/auth/SocialAuthButtons'
import { Button, useToast } from '../../components/ui'

export default function RegisterV2() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Debe coincidir con Authentication → Providers → Email → Password Requirements en Supabase.
  const passwordRules = [
    { label: 'Al menos 8 caracteres', ok: password.length >= 8 },
    { label: 'Una minúscula', ok: /[a-z]/.test(password) },
    { label: 'Una mayúscula', ok: /[A-Z]/.test(password) },
    { label: 'Un número', ok: /\d/.test(password) },
    { label: 'Un símbolo', ok: /[^a-zA-Z0-9]/.test(password) }
  ]
  const passwordValid = passwordRules.every((r) => r.ok)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!passwordValid) {
      toast.show({
        variant: 'warn',
        title: 'Check the form',
        message: 'La contraseña no cumple los requisitos.'
      })
      return
    }
    if (password !== passwordConfirmation) {
      toast.show({ variant: 'warn', title: 'Check the form', message: 'Passwords do not match.' })
      return
    }
    setSubmitting(true)
    try {
      await register({ firstName, lastName, email, phone, password, passwordConfirmation })
      toast.show({
        variant: 'success',
        title: 'Account created',
        message: 'We sent you a verification code by email and SMS.'
      })
      navigate('/verify-email', { state: { email, phone } })
    } catch (err) {
      toast.show({
        variant: 'error',
        title: 'Could not sign up',
        message: err instanceof Error ? err.message : 'Try again in a moment.'
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      title='Create your account'
      subtitle="You'll need to verify your email and phone before you can log in."
      footer={
        <>
          Already have an account?{' '}
          <Link to='/login' className='text-brand-hi font-semibold hover:text-white transition'>
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='grid grid-cols-2 gap-3'>
          <Field label='First name'>
            <input
              type='text'
              required
              autoComplete='given-name'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder='Jane'
              className={inputClass}
            />
          </Field>
          <Field label='Last name'>
            <input
              type='text'
              autoComplete='family-name'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder='Doe'
              className={inputClass}
            />
          </Field>
        </div>
        <Field label='Email'>
          <input
            type='email'
            required
            autoComplete='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='you@email.com'
            className={inputClass}
          />
        </Field>
        <Field label='Phone'>
          <input
            type='tel'
            required
            autoComplete='tel'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder='+1 555 123 4567'
            className={inputClass}
          />
        </Field>
        <Field label='Password'>
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
          {password.length > 0 && (
            <ul
              style={{ listStyle: 'none', margin: '8px 0 0', padding: 0, display: 'grid', gap: 4 }}
            >
              {passwordRules.map((r) => (
                <li
                  key={r.label}
                  style={{
                    fontSize: 12,
                    color: r.ok
                      ? 'var(--accent-mint, #7DFFB0)'
                      : 'var(--text-tertiary, rgba(255,255,255,0.55))'
                  }}
                >
                  {r.ok ? '✓' : '○'} {r.label}
                </li>
              ))}
            </ul>
          )}
        </Field>
        <Field label='Confirm password'>
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
          {submitting ? 'Creating account…' : 'Sign up'}
        </Button>
      </form>
      <div className='mt-4'>
        <SocialAuthButtons />
      </div>
    </AuthShell>
  )
}
