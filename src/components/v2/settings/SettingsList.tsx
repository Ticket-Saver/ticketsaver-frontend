import { useState } from 'react'
import { useToast } from '../../ui'
import { cn } from '../../../types/ui'

export interface SettingItem {
  id: string
  label: string
  description?: string
  control: 'toggle' | 'select' | 'link'
  /** Para toggle. */
  defaultValue?: boolean
  /** Para select. */
  options?: { value: string; label: string }[]
  defaultSelect?: string
  /** Para link. */
  href?: string
}

export interface SettingsSection {
  title: string
  items: SettingItem[]
}

interface SettingsListProps {
  sections: SettingsSection[]
}

/**
 * Render genérico de secciones de settings con controles toggle/select/link.
 * Hoy todos los controles son no-op (con toast feedback) hasta que el
 * cliente conecte el backend de preferencias.
 */
export default function SettingsList({ sections }: SettingsListProps) {
  return (
    <div className='space-y-6'>
      {sections.map((section) => (
        <SectionCard key={section.title} section={section} />
      ))}
    </div>
  )
}

const SectionCard = ({ section }: { section: SettingsSection }) => (
  <div className='rounded-glass-lg border border-white/[0.10] backdrop-blur-glass bg-white/[0.04]'>
    <h2 className='font-display text-[11px] uppercase tracking-[0.16em] font-bold text-white/55 px-5 pt-4 pb-2'>
      {section.title}
    </h2>
    <ul className='divide-y divide-white/[0.06]'>
      {section.items.map((item) => (
        <SettingRow key={item.id} item={item} />
      ))}
    </ul>
  </div>
)

const SettingRow = ({ item }: { item: SettingItem }) => (
  <li className='flex items-center justify-between gap-3 px-5 py-3.5'>
    <div className='min-w-0 flex-1'>
      <div className='font-display text-[13.5px] font-semibold text-white tracking-tight'>
        {item.label}
      </div>
      {item.description && <p className='text-[11.5px] text-white/55 mt-0.5'>{item.description}</p>}
    </div>
    <div className='shrink-0'>
      {item.control === 'toggle' && (
        <Toggle defaultChecked={item.defaultValue ?? false} label={item.label} />
      )}
      {item.control === 'select' && item.options && (
        <Select
          options={item.options}
          defaultValue={item.defaultSelect ?? item.options[0].value}
          label={item.label}
        />
      )}
      {item.control === 'link' && <LinkButton href={item.href} label={item.label} />}
    </div>
  </li>
)

const Toggle = ({ defaultChecked, label }: { defaultChecked: boolean; label: string }) => {
  const [on, setOn] = useState(defaultChecked)
  const toast = useToast()
  return (
    <button
      type='button'
      role='switch'
      aria-checked={on}
      aria-label={label}
      onClick={() => {
        const next = !on
        setOn(next)
        toast.show({
          variant: 'info',
          title: 'Saved locally',
          message: `${label} preference will sync when the API is ready.`,
          duration: 2500
        })
      }}
      className={cn(
        'h-6 w-11 rounded-pill relative transition border border-white/15',
        on ? 'bg-brand-mid' : 'bg-white/[0.08]'
      )}
    >
      <span
        aria-hidden
        className={cn(
          'absolute top-[1px] h-5 w-5 rounded-pill bg-white transition-transform shadow',
          on ? 'translate-x-[22px]' : 'translate-x-[1px]'
        )}
      />
    </button>
  )
}

const Select = ({
  options,
  defaultValue,
  label
}: {
  options: { value: string; label: string }[]
  defaultValue: string
  label: string
}) => {
  const [value, setValue] = useState(defaultValue)
  const toast = useToast()
  return (
    <label className='inline-flex items-center gap-2 rounded-pill bg-white/[0.06] border border-white/10 px-3 py-1.5 cursor-pointer hover:bg-white/[0.10] transition'>
      <select
        value={value}
        aria-label={label}
        onChange={(e) => {
          setValue(e.target.value)
          toast.show({
            variant: 'info',
            message: `${label}: ${e.target.value} (saved locally).`,
            duration: 2000
          })
        }}
        className='appearance-none bg-transparent outline-none text-[12px] text-white font-display font-medium pr-4'
        style={{
          backgroundImage:
            'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 12 12"><path d="m3 5 3 3 3-3" stroke="white" stroke-opacity="0.7" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>\')',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right center',
          backgroundSize: '8px 8px'
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className='bg-[#15151A]'>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

const LinkButton = ({ href, label }: { href?: string; label: string }) => {
  const toast = useToast()
  if (href) {
    return (
      <a
        href={href}
        target='_blank'
        rel='noopener noreferrer'
        className='inline-flex items-center gap-1 text-[12px] font-display font-semibold text-brand-hi hover:text-white transition'
        aria-label={label}
      >
        Open
        <svg width='9' height='9' viewBox='0 0 10 10' fill='none' aria-hidden>
          <path
            d='M3 7 7 3M7 3H4M7 3v3'
            stroke='currentColor'
            strokeWidth='1.4'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </a>
    )
  }
  return (
    <button
      type='button'
      aria-label={label}
      onClick={() =>
        toast.show({
          variant: 'info',
          title: 'Coming soon',
          message: `${label} is on the roadmap.`
        })
      }
      className='text-[12px] font-display font-semibold text-brand-hi hover:text-white transition'
    >
      Manage →
    </button>
  )
}
