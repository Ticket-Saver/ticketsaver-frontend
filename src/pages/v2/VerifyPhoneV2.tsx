import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import AuthShell, { Field } from '../../components/v2/auth/AuthShell'
import PhoneInput from '../../components/v2/auth/PhoneInput'
import OtpInput from '../../components/v2/auth/OtpInput'
import { Button, useToast } from '../../components/ui'

// Traduce el error crudo de Supabase a un mensaje accionable para el usuario.
const describeSendError = (err: unknown): string => {
  const msg = err instanceof Error ? err.message : ''
  const code = (err as { code?: string } | null)?.code
  if (code === 'phone_exists' || /already been registered/i.test(msg)) {
    return 'That phone number is already registered to another account. Use a different number.'
  }
  return msg || 'Could not send the code. Check the number and try again.'
}

export default function VerifyPhoneV2() {
  const { verifyPhone, resendOtp, refresh, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()

  const navState = location.state as { phone?: string; returnTo?: string } | null
  // Teléfono conocido: registro por email (pending_phone) o navState. En OAuth no
  // hay teléfono. En ambos casos el usuario confirma el número y envía el código
  // EXPLÍCITAMENTE: así el error (número inválido, phone_exists) siempre se ve.
  const knownPhone = navState?.phone ?? user?.pendingPhone ?? ''
  const returnTo = navState?.returnTo ?? '/'
  const [phone, setPhone] = useState(knownPhone)
  // 'phone' = confirmar número y enviar SMS; 'code' = ingresar el OTP recibido.
  const [step, setStep] = useState<'phone' | 'code'>('phone')
  const [code, setCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sending, setSending] = useState(false)
  const seeded = useRef(false)

  // El user llega async (Supabase getSession): precargamos pending_phone UNA sola
  // vez cuando aparece. No reaccionar a `phone` vacío: si no, borrar todo el número
  // lo volvería a rellenar solo.
  useEffect(() => {
    if (!seeded.current && knownPhone) {
      seeded.current = true
      setPhone(knownPhone)
    }
  }, [knownPhone])

  // updateUser({phone}) asocia el teléfono y dispara el SMS (Send SMS Hook -> SNS).
  const sendCode = async () => {
    if (!phone) return
    setSending(true)
    try {
      await resendOtp(phone, 'sms')
      setStep('code')
      toast.show({ variant: 'success', message: `We sent a code by SMS to ${phone}.` })
    } catch (err) {
      toast.show({ variant: 'error', title: 'Could not send code', message: describeSendError(err) })
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
      toast.show({ variant: 'success', title: 'Phone verified', message: 'Your account is ready.' })
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

  return (
    <AuthShell
      title='Verify your phone'
      subtitle={
        step === 'phone'
          ? 'Confirm your phone number and we’ll send you a 6-digit code by SMS.'
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
            <PhoneInput value={phone} onChange={setPhone} />
          </Field>
          <Button
            type='button'
            variant='primary'
            size='lg'
            fullWidth
            disabled={sending || !phone}
            onClick={sendCode}
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
              onClick={sendCode}
              disabled={sending || !phone}
              className='text-white/55 hover:text-white transition disabled:opacity-50'
            >
              {sending ? 'Resending…' : "Didn't get a code? Resend"}
            </button>
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
          </div>
        </div>
      )}
    </AuthShell>
  )
}
