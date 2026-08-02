import SettingsList, { type SettingsSection } from '../../components/v2/settings/SettingsList'
import gradients from '../../styles/effects/gradients.module.css'

const SECTIONS: SettingsSection[] = [
  {
    title: 'Notifications',
    items: [
      {
        id: 'email-receipts',
        label: 'Email receipts',
        description: 'Get a copy of every successful purchase.',
        control: 'toggle',
        defaultValue: true
      },
      {
        id: 'event-reminders',
        label: 'Event reminders',
        description: '24h and 1h before showtime.',
        control: 'toggle',
        defaultValue: true
      },
      {
        id: 'newsletter',
        label: 'Weekly newsletter',
        description: 'Curated picks for your city.',
        control: 'toggle',
        defaultValue: false
      }
    ]
  },
  {
    title: 'Privacy',
    items: [
      {
        id: 'data-sharing',
        label: 'Share usage data',
        description: 'Helps us improve discovery and venue recommendations.',
        control: 'toggle',
        defaultValue: false
      },
      {
        id: 'public-profile',
        label: 'Public profile',
        description: 'Allow other fans to see your collected events.',
        control: 'toggle',
        defaultValue: false
      }
    ]
  },
  {
    title: 'Region & language',
    items: [
      {
        id: 'language',
        label: 'Language',
        control: 'select',
        defaultSelect: 'en',
        options: [
          { value: 'en', label: 'English' },
          { value: 'es', label: 'Español' },
          { value: 'pt', label: 'Português' }
        ]
      },
      {
        id: 'currency',
        label: 'Currency',
        control: 'select',
        defaultSelect: 'USD',
        options: [
          { value: 'USD', label: 'US Dollar (USD)' },
          { value: 'ARS', label: 'Peso (ARS)' },
          { value: 'MXN', label: 'Peso (MXN)' }
        ]
      },
      {
        id: 'time-format',
        label: 'Time format',
        control: 'select',
        defaultSelect: '12h',
        options: [
          { value: '12h', label: '12-hour' },
          { value: '24h', label: '24-hour' }
        ]
      }
    ]
  },
  {
    title: 'Payments',
    items: [
      {
        id: 'saved-cards',
        label: 'Saved cards',
        description: 'Stripe manages your card vault.',
        control: 'link'
      },
      {
        id: 'billing-history',
        label: 'Billing history',
        description: 'Past receipts in PDF.',
        control: 'link'
      }
    ]
  }
]

export default function MySettingsV2() {
  return (
    <div className='space-y-6'>
      <header>
        <p className='text-[11px] text-white/55 uppercase tracking-[0.16em] font-display font-bold'>
          Preferences
        </p>
        <h1
          className={`mt-1 font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${gradients.textBrandSoft}`}
        >
          Settings
        </h1>
        <p className='mt-2 text-sm text-white/55 max-w-xl'>
          Tweak notifications, privacy and regional defaults. Changes save locally until the backend
          is wired.
        </p>
      </header>

      <SettingsList sections={SECTIONS} />
    </div>
  )
}
