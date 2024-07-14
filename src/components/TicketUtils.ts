import { SHA256, enc } from 'crypto-js'

export function getToken(text: string, length: number = 16): string {
  const hash = SHA256(enc.Latin1.parse(text)).toString()
  return hash.slice(0, length)
}

export function ticketId(
  eventLabel: string,
  venueZone: string,
  ticketNum: number,
  issuedAt: number
): string {
  const zone = venueZone.toLowerCase().replace(' ', '_')
  const dataFmt = `${eventLabel}:${zone}:${ticketNum.toString().padStart(2, '0')}:${issuedAt}`
  return getToken(dataFmt, 4).toUpperCase()
}

