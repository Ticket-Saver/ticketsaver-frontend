import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import ProfileHeader from '../../components/v2/profile/ProfileHeader'
import { Button, GlassCard, useToast } from '../../components/ui'
import { Field, inputClass } from '../../components/v2/auth/AuthShell'
import { hiEventsService } from '../../services/hiEventsService'

export default function MyProfileV2() {
  const { user, logout, refresh } = useAuth()
  const toast = useToast()

  const [editing, setEditing] = useState(false)
  const [firstName, setFirstName] = useState(user?.firstName ?? '')
  const [lastName, setLastName] = useState(user?.lastName ?? '')
  const [saving, setSaving] = useState(false)

  const startEdit = () => {
    setFirstName(user?.firstName ?? '')
    setLastName(user?.lastName ?? '')
    setEditing(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await hiEventsService.updateMyProfile({ first_name: firstName, last_name: lastName })
      await refresh()
      setEditing(false)
      toast.show({ variant: 'success', message: 'Profile updated.' })
    } catch (err) {
      toast.show({
        variant: 'error',
        message: err instanceof Error ? err.message : 'Could not update your profile.'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => logout()

  const fullName = user ? `${user.firstName} ${user.lastName ?? ''}`.trim() : undefined

  return (
    <div className='space-y-6'>
      <ProfileHeader name={fullName} email={user?.email} />

      <GlassCard depth='md' radius='lg' className='p-5 lg:p-6'>
        <div className='flex items-baseline justify-between mb-4'>
          <h2 className='font-display text-base lg:text-lg font-semibold text-white tracking-tight'>
            Personal info
          </h2>
          {!editing && (
            <button
              type='button'
              onClick={startEdit}
              className='shrink-0 text-[11px] text-brand-hi font-display font-semibold hover:text-white transition'
            >
              Edit
            </button>
          )}
        </div>

        {editing ? (
          <div className='space-y-3'>
            <div className='grid grid-cols-2 gap-3'>
              <Field label='First name'>
                <input
                  type='text'
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClass}
                />
              </Field>
              <Field label='Last name'>
                <input
                  type='text'
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
            <div className='flex gap-2 justify-end pt-1'>
              <Button variant='ghost' size='sm' onClick={() => setEditing(false)} disabled={saving}>
                Cancel
              </Button>
              <Button variant='primary' size='sm' onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </div>
        ) : (
          <ul className='divide-y divide-white/[0.06]'>
            <ProfileRow label='Full name' value={fullName ?? '—'} />
            <ProfileRow label='Email' value={user?.email ?? '—'} badge={user?.emailVerified ? 'Verified' : 'Unverified'} />
            <ProfileRow label='Phone' value={user?.phone ?? '—'} badge={user?.phoneVerified ? 'Verified' : 'Unverified'} />
          </ul>
        )}
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

const ProfileRow = ({ label, value, badge }: { label: string; value: string; badge?: string }) => (
  <li className='flex items-center justify-between gap-3 py-3'>
    <div className='min-w-0 flex-1'>
      <div className='text-[10.5px] uppercase tracking-[0.14em] text-white/45 font-display font-bold'>
        {label}
      </div>
      <div className='mt-0.5 text-[13px] text-white font-medium truncate'>{value}</div>
    </div>
    {badge && (
      <span
        className={`shrink-0 text-[10px] font-display font-bold uppercase tracking-[0.1em] px-2 py-1 rounded-pill ${
          badge === 'Verified' ? 'bg-accent-mint/15 text-accent-mint' : 'bg-white/[0.08] text-white/55'
        }`}
      >
        {badge}
      </span>
    )}
  </li>
)
