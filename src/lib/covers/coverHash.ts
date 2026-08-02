import { COVER_KEYS, type CoverKey } from './palettes'

const djb2 = (input: string): number => {
  let h = 5381
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h + input.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

export const coverHash = (label: string | undefined | null): CoverKey => {
  const key = (label ?? '').trim().toLowerCase()
  if (!key) return COVER_KEYS[0]
  const i = djb2(key) % COVER_KEYS.length
  return COVER_KEYS[i]
}

export const coverSeed = (label: string | undefined | null): number => {
  const key = (label ?? '').trim().toLowerCase()
  return key ? djb2(key) % 100 : 0
}
