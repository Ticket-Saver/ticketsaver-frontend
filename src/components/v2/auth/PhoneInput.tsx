import RPNInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

interface PhoneInputProps {
  /** E.164, ej: "+15551234567". */
  value: string
  onChange: (e164: string) => void
  disabled?: boolean
}

/**
 * Selector de país + número sobre react-phone-number-input (libphonenumber-js).
 * Emite E.164. Default USA (+1). Todos los países/banderas/formato vienen de la lib.
 */
export default function PhoneInput({ value, onChange, disabled }: PhoneInputProps) {
  return (
    <RPNInput
      international
      defaultCountry='US'
      value={value || undefined}
      onChange={(v) => onChange(v ?? '')}
      disabled={disabled}
      placeholder='555 123 4567'
      // Skin dark/glass: la lib trae su DOM (.PhoneInput*), lo pintamos acá.
      className={
        'flex items-center gap-2 ' +
        '[&_.PhoneInputCountrySelect]:text-white ' +
        '[&_.PhoneInputCountryIcon]:shadow-none ' +
        '[&_.PhoneInputCountrySelectArrow]:text-white/60 [&_.PhoneInputCountrySelectArrow]:opacity-100 ' +
        '[&_.PhoneInputInput]:bg-transparent [&_.PhoneInputInput]:outline-none ' +
        '[&_.PhoneInputInput]:text-[14px] [&_.PhoneInputInput]:text-white ' +
        '[&_.PhoneInputInput]:placeholder:text-white/35 [&_.PhoneInputInput]:font-body ' +
        '[&_.PhoneInputCountrySelect>option]:bg-brand-ink [&_.PhoneInputCountrySelect>option]:text-white'
      }
    />
  )
}
