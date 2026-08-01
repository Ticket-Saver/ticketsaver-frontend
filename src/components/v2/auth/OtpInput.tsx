import { useRef, type ClipboardEvent, type KeyboardEvent } from 'react'
import { cn } from '../../../types/ui'

interface OtpInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

/** Input de código OTP de N dígitos (6 por defecto) — una caja por dígito, auto-advance, soporta paste. */
export default function OtpInput({ length = 6, value, onChange, disabled }: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([])

  const digits = Array.from({ length }, (_, i) => value[i] ?? '')

  const setDigit = (index: number, digit: string) => {
    const next = digits.slice()
    next[index] = digit
    onChange(next.join('').slice(0, length))
  }

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1)
    setDigit(index, digit)
    if (digit && index < length - 1) refs.current[index + 1]?.focus()
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0) refs.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < length - 1) refs.current[index + 1]?.focus()
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) return
    e.preventDefault()
    onChange(pasted.padEnd(length, '').slice(0, length).trimEnd())
    refs.current[Math.min(pasted.length, length - 1)]?.focus()
  }

  return (
    <div className='flex justify-center gap-2 sm:gap-3' onPaste={handlePaste}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type='text'
          inputMode='numeric'
          autoComplete='one-time-code'
          maxLength={1}
          value={d}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className={cn(
            'h-12 w-10 sm:h-14 sm:w-12 rounded-glass-md bg-white/[0.04] border border-white/[0.10]',
            'text-center text-lg sm:text-xl font-display font-bold text-white',
            'outline-none focus:border-brand-mid/60 transition disabled:opacity-50'
          )}
        />
      ))}
    </div>
  )
}
