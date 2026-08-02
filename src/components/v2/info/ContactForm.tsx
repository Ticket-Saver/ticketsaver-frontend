import { useState, type FormEvent } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { Button, GlassCard, useToast } from '../../ui'
import { cn } from '../../../types/ui'
import { sendContactForm, validateContact } from '../../../services/contactFormService'

const TOPICS = ['Buying', 'Refunds', 'Wallet', 'Press', 'Promote a show', 'Other']

export default function ContactForm() {
  const { user } = useAuth()
  const toast = useToast()
  const [name, setName] = useState(user ? `${user.firstName} ${user.lastName ?? ''}`.trim() : '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [topic, setTopic] = useState(TOPICS[0])
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const error = validateContact({ name, email, message })
    if (error) {
      toast.show({ variant: 'warn', title: 'Check the form', message: error })
      return
    }
    setSubmitting(true)
    const result = await sendContactForm({ name, email, topic, message })
    setSubmitting(false)
    if (!result.ok) {
      toast.show({
        variant: 'error',
        title: 'Could not send',
        message: result.error ?? 'Try again in a moment.'
      })
      return
    }
    setSent(true)
    setMessage('')
    toast.show({
      variant: 'success',
      title: 'Message sent',
      message: "We'll reply to your email shortly."
    })
  }

  if (sent) {
    return (
      <GlassCard depth='md' radius='lg' className='p-6 text-center'>
        <div
          className='mx-auto h-12 w-12 rounded-pill grid place-items-center mb-3'
          style={{ background: 'radial-gradient(circle at 30% 30%, #E0C0FF, #7B3FE4)' }}
        >
          <svg width='20' height='20' viewBox='0 0 22 22' fill='none' aria-hidden>
            <path
              d='M5 11.5 9 15.5 17 7'
              stroke='#fff'
              strokeWidth='2.2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </div>
        <h3 className='font-display text-lg font-semibold text-white'>
          Thanks, {name.split(' ')[0] || 'friend'}!
        </h3>
        <p className='mt-2 text-[13px] text-white/65 max-w-sm mx-auto'>
          Your message is on its way. We usually reply within a few hours.
        </p>
        <Button variant='ghost' size='md' onClick={() => setSent(false)} className='mt-4'>
          Send another
        </Button>
      </GlassCard>
    )
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <div className='text-[10px] uppercase tracking-[0.14em] text-white/50 font-display font-bold mb-2'>
          Topic
        </div>
        <div className='flex flex-wrap gap-2'>
          {TOPICS.map((t) => (
            <button
              key={t}
              type='button'
              onClick={() => setTopic(t)}
              className={cn(
                'rounded-pill px-3 py-1.5 text-[11.5px] font-display font-semibold border transition',
                topic === t
                  ? 'bg-white text-brand-ink border-transparent'
                  : 'bg-white/[0.05] text-white border-white/10 hover:bg-white/[0.10]'
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <Field label='Your name'>
        <input
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Jane Doe'
          className='w-full bg-transparent outline-none text-[14px] text-white placeholder:text-white/35 font-body'
        />
      </Field>

      <Field label='Email'>
        <input
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='you@email.com'
          className='w-full bg-transparent outline-none text-[14px] text-white placeholder:text-white/35 font-body'
        />
      </Field>

      <Field label='Message'>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder='How can we help?'
          rows={5}
          className='w-full bg-transparent outline-none text-[14px] text-white placeholder:text-white/35 font-body resize-none leading-relaxed'
        />
      </Field>

      <Button type='submit' variant='primary' size='lg' fullWidth disabled={submitting}>
        {submitting ? 'Sending…' : 'Send message'}
      </Button>
    </form>
  )
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className='block rounded-glass-md bg-white/[0.04] border border-white/[0.10] px-4 py-3 focus-within:border-brand-mid/60 transition'>
    <span className='block text-[9.5px] uppercase tracking-[0.14em] text-white/50 font-display font-bold mb-1.5'>
      {label}
    </span>
    {children}
  </label>
)
