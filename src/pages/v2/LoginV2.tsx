import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AuthShell, { Field, inputClass } from '../../components/v2/auth/AuthShell'
import SocialAuthButtons from '../../components/v2/auth/SocialAuthButtons'
import { Button, useToast } from '../../components/ui'

export default function LoginV2() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo ?? '/'

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await login(email, password)
      navigate(returnTo, { replace: true })
    } catch (err) {
      if (err instanceof Error && /not confirmed/i.test(err.message)) {
        toast.show({
          variant: 'warn',
          title: 'Verify your account',
          message: 'Confirm your email and phone before logging in.'
        })
        navigate('/verify-email', { state: { email } })
        return
      }
      toast.show({
        variant: 'error',
        title: 'Could not log in',
        message: err instanceof Error ? err.message : 'Check your email and password.'
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      title='Log in'
      subtitle='Welcome back — sign in to buy tickets and see your account.'
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to='/register' className='text-brand-hi font-semibold hover:text-white transition'>
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className='space-y-4'>
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
        <Field label='Password'>
          <input
            type='password'
            required
            autoComplete='current-password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='••••••••'
            className={inputClass}
          />
        </Field>
        <div className='text-right'>
          <Link to='/forgot-password' className='text-[12px] text-brand-hi font-semibold hover:text-white transition'>
            Forgot password?
          </Link>
        </div>
        <Button type='submit' variant='primary' size='lg' fullWidth disabled={submitting}>
          {submitting ? 'Logging in…' : 'Log in'}
        </Button>
      </form>
      <div className='mt-4'>
        <SocialAuthButtons />
      </div>
    </AuthShell>
  )
}
