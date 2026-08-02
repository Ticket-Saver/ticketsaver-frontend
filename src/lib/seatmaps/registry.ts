/**
 * Registry de mapas de asientos (C3a).
 *
 * El SVG (selector de secciones) y el `ranges.json` (delimitación de secciones →
 * números de asiento) son ESTÁTICOS y viven en el front como assets — son la misma
 * estructura desde la que el equipo extrapola el auto-generador de HiEvents, así que
 * no cambian por evento. Lo dinámico (asientos, disponibilidad, precio con tax/fee)
 * se consume en vivo de `GET /public/events/{id}/seats`.
 *
 * Un evento es ENUMERADO cuando tiene `event.map` ('map1'|'map2'|'chicago_alucines'|
 * 'san_jose'); ahí se resuelve su SVG + ranges desde acá. Mapa nuevo = se agrega su
 * entrada (+ su SVG/ranges). Los assets se sincronizan con HiEvents
 * (`backend/public/venue-maps/`), que es la fuente canónica.
 *
 * Formatos (los entiende el parser del SeatingMap):
 *  - map1 (Ritz):            ranges `position-color-rows`, SVG con el grupo en el `id`
 *                            (ej. id="center-cyan-W").
 *  - map2 (California):      ranges `row-color`, SVG con el grupo en el `id`.
 *  - chicago_alucines:       ranges `position-color-rows` (+ balcony), SVG con el grupo
 *                            en la `class` (ej. class="W-cyan-center"). Formato más nuevo.
 *  - san_jose:               ranges `seccion-color-rows` (numeradas), SVG class-based.
 */

import map1Svg from '../../assets/venue-maps/map1.svg?raw'
import map2Svg from '../../assets/venue-maps/map2.svg?raw'
import chicagoSvg from '../../assets/venue-maps/chicago_alucines.svg?raw'
import sanJoseSvg from '../../assets/venue-maps/san_jose.svg?raw'
import map1Ranges from '../../assets/venue-maps/map1.ranges.json'
import map2Ranges from '../../assets/venue-maps/map2.ranges.json'
import chicagoRanges from '../../assets/venue-maps/chicago_alucines.ranges.json'
import sanJoseRanges from '../../assets/venue-maps/san_jose.ranges.json'

/** Valores del ranges.json: string ("301-304", "1-16 | 101-122") o metadata (objeto). */
export type RangesRaw = Record<string, unknown>

export interface SeatMapAsset {
  /** Contenido raw del SVG (selector de secciones). */
  svg: string
  /** ranges.json crudo — lo parsea el SeatingMap. */
  ranges: RangesRaw
}

const REGISTRY: Record<string, SeatMapAsset> = {
  map1: { svg: map1Svg, ranges: map1Ranges as RangesRaw },
  map2: { svg: map2Svg, ranges: map2Ranges as RangesRaw },
  // chicago_alucines = Copernicus Center (Chicago) — platea + balcony (SVG class-based)
  chicago_alucines: { svg: chicagoSvg, ranges: chicagoRanges as RangesRaw },
  // san_jose = California Theatre (San José) — secciones numeradas (SVG class-based)
  san_jose: { svg: sanJoseSvg, ranges: sanJoseRanges as RangesRaw }
}

/** Devuelve el SVG + ranges del mapa, o null si el evento no es enumerado / el mapa no existe. */
export const getSeatMapAsset = (map?: string | null): SeatMapAsset | null =>
  map && REGISTRY[map] ? REGISTRY[map] : null

/** True si el evento es enumerado (tiene un mapa conocido). */
export const isSeatedMap = (map?: string | null): boolean => !!getSeatMapAsset(map)

/**
 * Molde de asientos por sección (groupId → fila → columnas con seat_number o null).
 * Permitiría renderizar el paso 2 con la forma REAL de la sección, pero HiEvents NO
 * expone la geometría de los asientos (solo row+seat_number+section), así que hoy
 * ningún mapa lo tiene → el paso 2 (SeatPickerV2) renderiza por filas para todos.
 */
export type SeatMapLayout = Record<string, Record<string, (number | null)[]>>

const LAYOUTS: Record<string, SeatMapLayout> = {}

/** Devuelve el molde del mapa, o null si ese mapa no tiene geometría cargada. */
export const getSeatMapLayout = (map?: string | null): SeatMapLayout | null =>
  map && LAYOUTS[map] ? LAYOUTS[map] : null
