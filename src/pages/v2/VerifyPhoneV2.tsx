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
  // Teléfono ya conocido: viene del registro por email (pending_phone). En el
  // alta con Google/Apple no hay teléfono, así que primero lo pedimos.
  const forcedPhone = navState?.phone ?? user?.pendingPhone ?? ''
  const returnTo = navState?.returnTo ?? '/'
  const [phone, setPhone] = useState(forcedPhone)
  // 'phone' = pedir número y enviar SMS; 'code' = ingresar el OTP recibido.
  const [step, setStep] = useState<'phone' | 'code'>(forcedPhone ? 'code' : 'phone')
  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sending, setSending] = useState(false)
  const sentOnMount = useRef(false)

  // El user llega async (Supabase getSession) — si forcedPhone recién aparece,
  // sincronizamos el estado local y saltamos directo al paso del código.
  useEffect(() => {
    if (forcedPhone && !phone) {
      setPhone(forcedPhone)
      setStep('code')
    }
  }, [forcedPhone, phone])

  // Registro por email: el teléfono ya se conoce pero Supabase aún no lo asoció.
  // Lo asociamos al montar, lo que dispara el SMS (Send SMS Hook -> AWS SNS).
  // En OAuth (sin forcedPhone) NO auto-enviamos: el usuario ingresa el número
  // y recién ahí mandamos el código.
  useEffect(() => {
    if (forcedPhone && !sentOnMount.current) {
      sentOnMount.current = true
      resendOtp(forcedPhone, 'sms').catch(() => {
        /* si falla el envío automático, el usuario puede tocar "Resend" */
      })
    }
  }, [forcedPhone, resendOtp])

  // Paso 1 (OAuth): el usuario confirma su teléfono -> asociamos y enviamos OTP.
  const handleSendCode = async () => {
    if (!phone) return
    setSending(true)
    try {
      await resendOtp(phone, 'sms')
      setStep('code')
      toast.show({ variant: 'success', message: `We sent a code by SMS to ${phone}.` })
    } catch (err) {
      toast.show({
        variant: 'error',
        title: 'Could not send code',
        message: err instanceof Error ? err.message : 'Check the number and try again.'
      })
    } finally {
      setSending(false)
    }
  }

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
    setSending(true)
    try {
      await resendOtp(phone, 'sms')
      toast.show({ variant: 'success', message: 'We sent a new code by SMS.' })
    } catch (err) {
      toast.show({
        variant: 'error',
        message: err instanceof Error ? err.message : 'Could not resend the code.'
      })
    } finally {
      setSending(false)
    }
  }

  return (
    <AuthShell
      title='Verify your phone'
      subtitle={
        step === 'phone'
          ? 'Enter your phone number and we’ll send you a 6-digit code by SMS.'
          : 'Enter the 6-digit code we sent to your phone by SMS.'
      }
      footer={
        <Link to='/login' className='text-brand-hi font-semibold hover:text-white transition'>
          Back to login
        </Link>
      }
    >
      {step === 'phone' ? (
        <div className='space-y-5'>
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
          <Button
            type='button'
            variant='primary'
            size='lg'
            fullWidth
            disabled={sending || !phone}
            onClick={handleSendCode}
          >
            {sending ? 'Sending…' : 'Send code'}
          </Button>
        </div>
      ) : (
        <div className='space-y-5'>
          <p className='text-center text-sm text-white/60'>Code sent to {phone}</p>
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
          <div className='flex items-center justify-center gap-3 text-[12.5px]'>
            <button
              type='button'
              onClick={handleResend}
              disabled={sending || !phone}
              className='text-white/55 hover:text-white transition disabled:opacity-50'
            >
              {sending ? 'Resending…' : "Didn't get a code? Resend"}
            </button>
            {!forcedPhone && (
              <>
                <span className='text-white/25'>·</span>
                <button
                  type='button'
                  onClick={() => {
                    setCode('')
                    setStep('phone')
                  }}
                  className='text-white/55 hover:text-white transition'
                >
                  Change number
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </AuthShell>
  )
}
