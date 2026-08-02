import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AuthShell, { Field, inputClass } from '../../components/v2/auth/AuthShell'
import OtpInput from '../../components/v2/auth/OtpInput'
import { Button, useToast } from '../../components/ui'

export default function VerifyPhoneV2() {
  const { verifyPhone, resendOtp, refresh, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()

  const navState = location.state as { phone?: string; returnTo?: string } | null
  const forcedPhone = navState?.phone ?? user?.pendingPhone ?? ''
  const returnTo = navState?.returnTo ?? '/'
  const [phone, setPhone] = useState(forcedPhone)
  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)
  const sentOnMount = useRef(false)

  // El user llega async (Supabase getSession) — si forcedPhone recién aparece,
  // sincronizamos el estado local con él.
  useEffect(() => {
    if (forcedPhone && !phone) {
      setPhone(forcedPhone)
    }
  }, [forcedPhone, phone])

  // Al llegar con un teléfono ya conocido (viene del registro), Supabase todavía
  // no lo asoció a la cuenta — lo hacemos acá, lo que dispara el envío del SMS
  // (Send SMS Hook -> AWS SNS) automáticamente.
  useEffect(() => {
    if (forcedPhone && !sentOnMount.current) {
      sentOnMount.current = true
      resendOtp(forcedPhone, 'sms').catch(() => {
        /* si falla el envío automático, el usuario puede tocar "Resend" */
      })
    }
  }, [forcedPhone, resendOtp])

  const handleSubmit = async () => {
    if (code.length !== 6 || !phone) return
    setSubmitting(true)
    try {
      await verifyPhone(phone, code)
      // Refrescamos el user para que phoneVerified quede en true antes de salir;
      // si no, el gate del Router rebota de nuevo a esta pantalla.
      await refresh()
      toast.show({
        variant: 'success',
        title: 'Phone verified',
        message: 'Your account is ready.'
      })
      navigate(returnTo, { replace: true })
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
    if (!phone) return
    setResending(true)
    try {
      await resendOtp(phone, 'sms')
      toast.show({ variant: 'success', message: 'We sent a new code by SMS.' })
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
      title='Verify your phone'
      subtitle='Enter the 6-digit code we sent to your phone by SMS.'
      footer={
        <Link to='/login' className='text-brand-hi font-semibold hover:text-white transition'>
          Back to login
        </Link>
      }
    >
      <div className='space-y-5'>
        {!forcedPhone && (
          <Field label='Phone'>
            <input
              type='tel'
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder='+1 555 123 4567'
              className={inputClass}
            />
          </Field>
        )}
        {forcedPhone && (
          <p className='text-center text-sm text-white/60'>Code sent to {forcedPhone}</p>
        )}
        <OtpInput value={code} onChange={setCode} disabled={submitting} />
        <Button
          type='button'
          variant='primary'
          size='lg'
          fullWidth
          disabled={submitting || code.length !== 6 || !phone}
          onClick={handleSubmit}
        >
          {submitting ? 'Verifying…' : 'Verify phone'}
        </Button>
        <button
          type='button'
          onClick={handleResend}
          disabled={resending || !phone}
          className='block mx-auto text-[12.5px] text-white/55 hover:text-white transition disabled:opacity-50'
        >
          {resending ? 'Resending…' : "Didn't get a code? Resend"}
        </button>
      </div>
    </AuthShell>
  )
}
