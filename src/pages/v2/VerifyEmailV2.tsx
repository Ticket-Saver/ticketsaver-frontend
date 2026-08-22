import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AuthShell, { Field, inputClass } from '../../components/v2/auth/AuthShell'
import OtpInput from '../../components/v2/auth/OtpInput'
import { Button, useToast } from '../../components/ui'

export default function VerifyEmailV2() {
  const { verifyEmail, resendOtp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()

  const state = location.state as { email?: string; phone?: string; returnTo?: string } | null
  const stateEmail = state?.email ?? ''
  const statePhone = state?.phone ?? ''
  const returnTo = state?.returnTo
  const [email, setEmail] = useState(stateEmail)
  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)

  const handleSubmit = async () => {
    if (code.length !== 6 || !email) return
    setSubmitting(true)
    try {
      await verifyEmail(email, code)
      toast.show({
        variant: 'success',
        title: 'Email verified',
        message: "Now let's confirm your phone number."
      })
      navigate('/verify-phone', { state: { phone: statePhone, returnTo } })
    } catch (err) {
      toast.show({
        variant: 'error',
        title: 'Invalid code',
        message: err instanceof Error ? err.message : 'That code is not valid or has expired.'
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleResend = async () => {
    if (!email) return
    setResending(true)
    try {
      await resendOtp(email, 'email')
      toast.show({ variant: 'success', message: 'We sent a new code to your email.' })
    } catch (err) {
      toast.show({
        variant: 'error',
        message: err instanceof Error ? err.message : 'Could not resend the code.'
      })
    } finally {
      setResending(false)
    }
  }

  return (
    <AuthShell
      title='Verify your email'
      subtitle='Enter the 6-digit code we sent to your email address.'
      footer={
        <Link to='/login' className='text-brand-hi font-semibold hover:text-white transition'>
          Back to login
        </Link>
      }
    >
      <div className='space-y-5'>
        {!stateEmail && (
          <Field label='Email'>
            <input
              type='email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='you@email.com'
              className={inputClass}
            />
          </Field>
        )}
        <OtpInput value={code} onChange={setCode} disabled={submitting} />
        <Button
          type='button'
          variant='primary'
          size='lg'
          fullWidth
          disabled={submitting || code.length !== 6 || !email}
          onClick={handleSubmit}
        >
          {submitting ? 'Verifying…' : 'Verify email'}
        </Button>
        <button
          type='button'
          onClick={handleResend}
          disabled={resending || !email}
          className='block mx-auto text-[12.5px] text-white/55 hover:text-white transition disabled:opacity-50'
        >
          {resending ? 'Resending…' : "Didn't get a code? Resend"}
        </button>
      </div>
    </AuthShell>
  )
}
