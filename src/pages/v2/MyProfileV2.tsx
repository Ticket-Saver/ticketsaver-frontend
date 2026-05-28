import { useAuth0 } from '@auth0/auth0-react'
import ProfileHeader from '../../components/v2/profile/ProfileHeader'
import { Button, GlassCard, useToast } from '../../components/ui'

interface FieldRow {
  label: string
  value: string
  editable?: boolean
  copy?: boolean
}

export default function MyProfileV2() {
  const { user, logout } = useAuth0()
  const toast = useToast()

  const fields: FieldRow[] = [
    { label: 'Full name', value: user?.name ?? '—', editable: true },
    { label: 'Email', value: user?.email ?? '—', editable: true },
    {
      label: 'Phone',
      value:
        (user as { phone_number?: string } | undefined)?.phone_number ?? '—',
      editable: true
    },
    {
      label: 'Auth ID',
      value: user?.sub ?? '—',
      copy: true
    }
  ]

  const handleEdit = (label: string) => {
    toast.show({
      variant: 'info',
      title: 'Edit coming soon',
      message: `Direct edit of ${label.toLowerCase()} will use the Auth0 management API once the cloud function is wired.`
    })
  }

  const handleCopy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      toast.show({
        variant: 'success',
        message: 'Copied to clipboard.'
      })
    } catch {
      toast.show({ variant: 'error', message: 'Could not copy.' })
    }
  }

  const handleLogout = () =>
    logout({ logoutParams: { returnTo: window.location.origin } })

  return (
    <div className='space-y-6'>
      <ProfileHeader
        name={user?.name}
        email={user?.email}
        picture={user?.picture}
      />

      <GlassCard depth='md' radius='lg' className='p-5 lg:p-6'>
        <div className='flex items-baseline justify-between mb-4'>
          <h2 className='font-display text-base lg:text-lg font-semibold text-white tracking-tight'>
            Personal info
          </h2>
          <span className='text-[10.5px] uppercase tracking-[0.16em] text-white/45 font-display font-bold'>
            Synced with Auth0
          </span>
        </div>
        <ul className='divide-y divide-white/[0.06]'>
          {fields.map((f) => (
            <li
              key={f.label}
              className='flex items-center justify-between gap-3 py-3'
            >
              <div className='min-w-0 flex-1'>
                <div className='text-[10.5px] uppercase tracking-[0.14em] text-white/45 font-display font-bold'>
                  {f.label}
                </div>
                <div className='mt-0.5 text-[13px] text-white font-medium truncate'>
                  {f.value}
                </div>
              </div>
              {f.editable && (
                <button
                  type='button'
                  onClick={() => handleEdit(f.label)}
                  className='shrink-0 text-[11px] text-brand-hi font-display font-semibold hover:text-white transition'
                >
                  Edit
                </button>
              )}
              {f.copy && (
                <button
                  type='button'
                  onClick={() => handleCopy(f.value)}
                  className='shrink-0 text-[11px] text-brand-hi font-display font-semibold hover:text-white transition'
                >
                  Copy
                </button>
              )}
            </li>
          ))}
        </ul>
      </GlassCard>

      <GlassCard depth='sm' radius='lg' className='p-5'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
          <div>
            <h3 className='font-display text-base font-semibold text-white'>
              Sign out
            </h3>
            <p className='text-[12px] text-white/55 mt-1'>
              You can come back any time — your tickets stay in your wallet.
            </p>
          </div>
          <Button variant='danger' size='md' onClick={handleLogout}>
            Log out
          </Button>
        </div>
      </GlassCard>
    </div>
  )
}
