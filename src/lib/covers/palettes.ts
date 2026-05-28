export interface CoverPalette {
  a: string
  b: string
  c: string
  accent: string
}

export const COVER_PALETTES = {
  nebula: { a: '#7B3FE4', b: '#FF3FA4', c: '#1A0F33', accent: '#FFD0F0' },
  inferno: { a: '#FF5E3A', b: '#8B1E3F', c: '#1B0708', accent: '#FFE0A0' },
  aqua: { a: '#1FB6FF', b: '#7B3FE4', c: '#0A1430', accent: '#B0F0FF' },
  citrus: { a: '#FFC847', b: '#FF6B3D', c: '#2A1505', accent: '#FFF1B5' },
  forest: { a: '#27D17C', b: '#0F8FA1', c: '#03251E', accent: '#C5F8DD' },
  rose: { a: '#FFB1C8', b: '#9B2D5E', c: '#270914', accent: '#FFE0EC' },
  midnight: { a: '#3F3FE4', b: '#1A0F33', c: '#06061A', accent: '#9090FF' },
  sunset: { a: '#FF8847', b: '#D63384', c: '#2A0B22', accent: '#FFD08A' },
  mono: { a: '#E0DCD3', b: '#8A8780', c: '#16140F', accent: '#FFFFFF' },
  electric: { a: '#A0FF1F', b: '#1FFFC8', c: '#0A220A', accent: '#FFFFFF' }
} as const satisfies Record<string, CoverPalette>

export type CoverKey = keyof typeof COVER_PALETTES

export const COVER_KEYS: readonly CoverKey[] = Object.keys(
  COVER_PALETTES
) as CoverKey[]

export const getCoverPalette = (key: CoverKey): CoverPalette =>
  COVER_PALETTES[key]
