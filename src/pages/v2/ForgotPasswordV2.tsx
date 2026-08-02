import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AuthShell, { Field, inputClass } from '../../components/v2/auth/AuthShell'
import { Button, useToast } from '../../components/ui'

export default function ForgotPasswordV2() {
  const { forgotPassword } = useAuth()
  const toast = useToast()

  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      // El backend siempre responde 200 (no filtra si el email existe).
      await forgotPassword(email)
      setSent(true)
    } catch (err) {
      toast.show({
        variant: 'error',
        message: err instanceof Error ? err.message : 'Try again in a moment.'
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      title='Reset your password'
      subtitle="Enter your email and we'll send you a link to reset it."
      footer={
        <Link to='/login' className='text-brand-hi font-semibold hover:text-white transition'>
          Back to login
        </Link>
      }
    >
      {sent ? (
        <p className='text-center text-[13.5px] text-white/70'>
          If that email is registered, we sent instructions to reset your password.
        </p>
      ) : (
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
          <Button type='submit' variant='primary' size='lg' fullWidth disabled={submitting}>
            {submitting ? 'Sending…' : 'Send reset link'}
          </Button>
        </form>
      )}
    </AuthShell>
  )
}
