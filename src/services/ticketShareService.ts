import { getCoverPalette, type CoverKey } from '../lib/covers/palettes'

/**
 * ticketShareService — render del ticket en canvas + Web Share API con
 * fallback a clipboard.
 *
 * El canvas dibuja una composición simple del ticket (gradient + título
 * + fecha) que se exporta a PNG. La intención: que el usuario pueda
 * compartir una imagen "shareable" de su entrada (Instagram stories,
 * mensajes) sin depender de un screenshot a mano.
 */

export interface ShareTicketInput {
  ticketId: string
  eventTitle: string
  eventSubtitle?: string
  venueName?: string
  city?: string
  date: number
  month: string
  day: string
  time?: string
  coverKey: CoverKey
}

export interface ShareTicketResult {
  ok: boolean
  shared?: boolean
  copied?: boolean
  downloaded?: boolean
  error?: string
}

const CANVAS_WIDTH = 1080
const CANVAS_HEIGHT = 1920

const drawTicket = (
  ctx: CanvasRenderingContext2D,
  input: ShareTicketInput
): void => {
  const palette = getCoverPalette(input.coverKey)
  const W = CANVAS_WIDTH
  const H = CANVAS_HEIGHT

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, W, H)
  grad.addColorStop(0, palette.a)
  grad.addColorStop(0.6, palette.b)
  grad.addColorStop(1, palette.c)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)

  // Accent radial blob
  const radial = ctx.createRadialGradient(
    W * 0.75,
    H * 0.2,
    0,
    W * 0.75,
    H * 0.2,
    W * 0.7
  )
  radial.addColorStop(0, `${palette.accent}66`)
  radial.addColorStop(1, 'transparent')
  ctx.fillStyle = radial
  ctx.fillRect(0, 0, W, H)

  // Dark overlay bottom for legibility
  const bottomGrad = ctx.createLinearGradient(0, H * 0.6, 0, H)
  bottomGrad.addColorStop(0, 'rgba(10,4,24,0)')
  bottomGrad.addColorStop(1, 'rgba(10,4,24,0.85)')
  ctx.fillStyle = bottomGrad
  ctx.fillRect(0, H * 0.5, W, H * 0.5)

  // Brand top
  ctx.font = 'bold 36px "Space Grotesk", system-ui, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.78)'
  ctx.textAlign = 'left'
  ctx.fillText('TICKETSAVER', 80, 130)

  ctx.font = 'bold 28px "Space Grotesk", system-ui, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.fillText(`#${input.ticketId}`, 80, 175)

  // Big date
  ctx.textAlign = 'center'
  ctx.font =
    '700 56px "Space Grotesk", system-ui, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  ctx.fillText(`${input.day} · ${input.month}`, W / 2, H * 0.42)

  ctx.font = '900 400px "Space Grotesk", system-ui, sans-serif'
  ctx.fillStyle = '#ffffff'
  ctx.fillText(String(input.date).padStart(2, '0'), W / 2, H * 0.6)

  // Title
  ctx.font = '700 78px "Space Grotesk", system-ui, sans-serif'
  ctx.fillStyle = '#ffffff'
  const titleY = H * 0.78
  // simple wrap
  const maxWidth = W - 160
  const words = input.eventTitle.split(' ')
  let line = ''
  const lines: string[] = []
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = w
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  const lineHeight = 92
  lines.slice(0, 3).forEach((ln, i) => {
    ctx.fillText(ln, W / 2, titleY + i * lineHeight)
  })

  // Subtitle (venue)
  ctx.font = '500 38px Inter, system-ui, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  const subtitleParts = [input.venueName, input.city].filter(Boolean)
  if (subtitleParts.length > 0) {
    ctx.fillText(subtitleParts.join(', '), W / 2, titleY + lines.length * lineHeight + 60)
  }
  if (input.time) {
    ctx.font = '500 32px Inter, system-ui, sans-serif'
    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ctx.fillText(input.time, W / 2, titleY + lines.length * lineHeight + 110)
  }

  // Footer
  ctx.font = 'bold 26px "Space Grotesk", system-ui, sans-serif'
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.fillText('TICKETSAVER.NET', W / 2, H - 80)
}

export async function shareTicket(
  input: ShareTicketInput
): Promise<ShareTicketResult> {
  if (typeof document === 'undefined') {
    return { ok: false, error: 'Document not available' }
  }
  try {
    const canvas = document.createElement('canvas')
    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT
    const ctx = canvas.getContext('2d')
    if (!ctx) return { ok: false, error: 'Canvas context unavailable' }

    drawTicket(ctx, input)

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), 'image/png', 0.92)
    )
    if (!blob) return { ok: false, error: 'Failed to render PNG' }

    const fileName = `ticketsaver-${input.ticketId}.png`
    const file = new File([blob], fileName, { type: 'image/png' })

    const nav = navigator as Navigator & {
      canShare?: (data: { files?: File[] }) => boolean
    }

    if (nav.canShare && nav.canShare({ files: [file] })) {
      try {
        await nav.share({
          files: [file],
          title: input.eventTitle,
          text: `I'm going to ${input.eventTitle} 🎟️`
        })
        return { ok: true, shared: true }
      } catch (err) {
        // El usuario canceló — no es un error fatal.
        if (
          err instanceof Error &&
          /abort|cancel/i.test(err.name + err.message)
        ) {
          return { ok: true, shared: false }
        }
        // Cae al fallback de descarga.
      }
    }

    // Fallback: descarga directa.
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => URL.revokeObjectURL(url), 1500)

    return { ok: true, downloaded: true }
  } catch (err) {
    if (import.meta.env.DEV) console.error('[ticketShareService]', err)
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err)
    }
  }
}
