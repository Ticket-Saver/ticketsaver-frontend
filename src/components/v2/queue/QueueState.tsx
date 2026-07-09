import { cn } from '../../../types/ui'
import type { QueueStateKind } from '../../../services/queueService'

const COLOR: Record<QueueStateKind, string> = {
  far: '#D4A8F0',
  close: '#FFB1C8',
  next: '#7DFFB0',
  released: '#7DFFB0'
}

const LABEL: Record<QueueStateKind, string> = {
  far: 'In line',
  close: 'Almost there',
  next: "You're next",
  released: "You're in"
}

interface QueueStatePillProps {
  state: QueueStateKind
  size?: 'sm' | 'md'
  className?: string
}

export default function QueueStatePill({
  state,
  size = 'md',
  className
}: QueueStatePillProps) {
  const color = COLOR[state]
  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-pill backdrop-blur-glass font-display',
        size === 'sm' ? 'px-2.5 py-1 text-[10.5px]' : 'px-3.5 py-1.5 text-[12px]',
        className
      )}
      style={{
        background: 'rgba(0,0,0,0.5)',
        border: `0.5px solid ${color}55`,
        color
      }}
    >
      <span
        aria-hidden
        className='inline-block rounded-pill animate-pulse-you'
        style={{
          width: size === 'sm' ? 6 : 8,
          height: size === 'sm' ? 6 : 8,
          background: color,
          boxShadow: `0 0 10px ${color}`,
          animationDuration: '1.2s'
        }}
      />
      <span className='font-semibold tracking-[0.04em]'>{LABEL[state]}</span>
    </div>
  )
}

export { COLOR as QUEUE_STATE_COLOR, LABEL as QUEUE_STATE_LABEL }
