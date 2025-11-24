// seatLayoutHelper.ts
import { SeatIndex } from 'seatchart'

export type DisabledSeat = { row: number; col: number }

export type SeatRowLayout = {
  /** Texto de la fila: 'E', 'F', 'VIP', etc. */
  rowLabel: string
  /**
   * Arreglo por columnas.
   * - Si es un número > 0, se usa como número de asiento (rowLabel + número).
   * - Si es 0, null o undefined, simplemente NO se muestra label (pero NO implica disabled).
   *   El disabled solo se toma de section.disabledSeats.
   */
  seats: (number | null | undefined)[]
}

export type SeatSectionConfig = {
  id: string
  title: string
  name: string
  shape: 'poly'
  coords: number[]
  polygon: [number, number][]
  seatTypeLabel: string
  seatCssClass: string
  fillColor?: string
  strokeColor?: string
  /** Lista explícita de asientos deshabilitados (única fuente de truth). */
  disabledSeats: DisabledSeat[]
  /** Descripción fila por fila de la matriz de asientos. */
  layout: SeatRowLayout[]
}

/**
 * Recibe la descripción declarativa de secciones
 * y devuelve las `areas` listas para usarse en el mapa.
 *
 * No infiere asientos deshabilitados: solo usa section.disabledSeats.
 */
export function buildAreasFromSections(sections: SeatSectionConfig[]) {
  return sections.map((section) => {
    const rowLabels = section.layout.map((r) => r.rowLabel)
    const rows = section.layout.length
    const columns = Math.max(...section.layout.map((r) => r.seats.length))

    // Precalculamos las etiquetas de cada asiento [row][col]
    const seatLabels: (string | undefined)[][] = []

    // Set para lookup rápido de deshabilitados
    const disabledSet = new Set(section.disabledSeats.map((s) => `${s.row}-${s.col}`))

    section.layout.forEach((rowDef, rowIdx) => {
      seatLabels[rowIdx] = []

      for (let col = 0; col < columns; col++) {
        const isDisabled = disabledSet.has(`${rowIdx}-${col}`)
        const seatNumber = rowDef.seats[col]

        if (isDisabled) {
          // Deshabilitado: no label
          seatLabels[rowIdx][col] = undefined
          continue
        }

        if (seatNumber && seatNumber > 0) {
          seatLabels[rowIdx][col] = `${rowDef.rowLabel}${seatNumber}`
        } else {
          // No hay número para este asiento → no label
          seatLabels[rowIdx][col] = undefined
        }
      }
    })

    const indexerRows = {
      visible: true,
      label: (row: number) => rowLabels[row] ?? ''
    }

    const indexerColumns = {
      visible: true,
      label: (col: number) => String(col + 1) // 1..N
    }

    return {
      id: section.id,
      title: section.title,
      shape: section.shape,
      name: section.name,
      fillColor: section.fillColor,
      strokeColor: section.strokeColor,
      coords: section.coords,
      polygon: section.polygon,
      Options: {
        reservedSeats: [],
        cart: { visible: false },
        legendVisible: false,
        map: {
          frontVisible: false,
          rows,
          columns,
          seatTypes: {
            default: {
              label: section.seatTypeLabel,
              cssClass: section.seatCssClass
            }
          },
          disabledSeats: section.disabledSeats,
          indexerRows,
          indexerColumns,
          seatLabel: (index: SeatIndex) => seatLabels[index.row]?.[index.col]
        }
      }
    }
  })
}
