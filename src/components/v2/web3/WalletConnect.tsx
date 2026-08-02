import { useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button, GlassCard } from '../../ui'
import { cn } from '../../../types/ui'

const shorten = (addr?: string) => {
  if (!addr) return ''
  return addr.length > 12 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr
}

export default function WalletConnect() {
  const { address, isConnected, chain } = useAccount()
  const { connectors, connect, isPending, error } = useConnect()
  const { disconnect } = useDisconnect()
  const [open, setOpen] = useState(false)

  if (isConnected) {
    return (
      <GlassCard depth='md' radius='lg' className='p-5'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div className='flex items-center gap-3 min-w-0'>
            <div
              aria-hidden
              className='h-11 w-11 shrink-0 rounded-pill grid place-items-center font-display text-sm font-bold text-white border border-white/20'
              style={{ background: 'linear-gradient(135deg, #0052FF, #6E8FFF)' }}
            >
              B
            </div>
            <div className='min-w-0'>
              <div className='text-[10.5px] uppercase tracking-[0.16em] text-accent-mint font-display font-bold'>
                Connected
              </div>
              <div className='font-display text-base font-semibold text-white truncate tabular-nums'>
                {shorten(address)}
              </div>
              {chain && <div className='text-[11px] text-white/55 truncate'>on {chain.name}</div>}
            </div>
          </div>
          <Button variant='ghost' size='sm' onClick={() => disconnect()} className='shrink-0'>
            Disconnect
          </Button>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard depth='md' radius='lg' className='p-5'>
      <div className='flex items-start gap-3 mb-4'>
        <div
          aria-hidden
          className='h-10 w-10 shrink-0 rounded-glass-sm grid place-items-center'
          style={{ background: 'linear-gradient(135deg, #0052FF, #6E8FFF)' }}
        >
          <svg width='18' height='18' viewBox='0 0 18 18' fill='none' aria-hidden>
            <rect x='2' y='4.5' width='14' height='10' rx='2' stroke='#fff' strokeWidth='1.4' />
            <path d='M12 9.5h2.5' stroke='#fff' strokeWidth='1.4' strokeLinecap='round' />
          </svg>
        </div>
        <div className='min-w-0 flex-1'>
          <h2 className='font-display text-base lg:text-lg font-semibold text-white tracking-tight'>
            Connect your wallet
          </h2>
          <p className='mt-1 text-[12.5px] text-white/55'>
            Hold your tickets as NFTs on Base. Yours forever — no platform lock-in.
          </p>
        </div>
      </div>

      <Button variant='primary' size='md' fullWidth onClick={() => setOpen((s) => !s)}>
        {open ? 'Close options' : 'Connect wallet'}
      </Button>

      {open && (
        <div className='mt-4 space-y-2'>
          {connectors.length === 0 && (
            <p className='text-[12px] text-white/55 text-center'>
              No connectors available — install MetaMask or use Coinbase Smart Wallet.
            </p>
          )}
          {connectors.map((connector) => (
            <button
              key={connector.id}
              type='button'
              disabled={isPending}
              onClick={() => connect({ connector })}
              className={cn(
                'w-full flex items-center justify-between gap-3 rounded-glass-md px-4 py-3 transition',
                'bg-white/[0.05] border border-white/[0.10] text-white text-[13px] font-display font-semibold',
                'hover:bg-white/[0.10] disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <span>{connector.name}</span>
              <span className='text-[10.5px] text-white/45 font-medium uppercase tracking-[0.12em]'>
                {connector.type}
              </span>
            </button>
          ))}
          {error && <p className='text-[12px] text-red-300 mt-2 text-center'>{error.message}</p>}
        </div>
      )}
    </GlassCard>
  )
}
