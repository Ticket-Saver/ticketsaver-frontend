import { useMemo } from 'react'

export interface SeatCoord {
  row: number
  col: number
}

export interface ContiguityWarning {
  /** "row:col" para usar como key. */
  id: string
  row: number
  col: number
  /** Mensaje listo para mostrar como toast/banner. */
  message: string
}

export interface UseSeatContiguityArgs {
  /** Asientos que el usuario tiene seleccionados (en su cart). */
  selected: SeatCoord[]
  /** Asientos ya reservados/ocupados según fetchTakenSeats. */
  reserved: SeatCoord[]
  /** Asientos deshabilitados estructuralmente (pasillos, etc.). Opcional. */
  disabled?: SeatCoord[]
  /** Cantidad total de columnas — usado para validar bordes. */
  columns?: number
}

export interface UseSeatContiguityResult {
  warnings: ContiguityWarning[]
  hasIsolation: boolean
  /** Mapa rápido `row:col` → true para que la UI marque el seat aislado. */
  isolatedKeys: Set<string>
}

const key = (row: number, col: number) => `${row}:${col}`

/**
 * Detecta "huecos huérfanos" — un único asiento vacío encerrado entre dos
 * vendibles (vendidos, reservados o seleccionados). Reportar esto le da
 * al usuario la oportunidad de incluirlo o reorganizar antes del lock.
 *
 * Reglas:
 * - Sólo analizamos contigüidad horizontal (misma row, columnas
 *   consecutivas). La contigüidad vertical/diagonal NO se considera.
 * - Un asiento "aislado" es uno cuyo vecino izquierdo y derecho son
 *   no-disponibles. El propio asiento sigue disponible.
 * - El borde de la sección NO crea aislamiento (no hay vecino).
 */
export function useSeatContiguity(
  args: UseSeatContiguityArgs
): UseSeatContiguityResult {
  const { selected, reserved, disabled = [], columns } = args

  return useMemo(() => {
    // Set de asientos NO disponibles (vendido, seleccionado, reservado, deshabilitado).
    const taken = new Set<string>()
    for (const s of selected) taken.add(key(s.row, s.col))
    for (const r of reserved) taken.add(key(r.row, r.col))
    for (const d of disabled) taken.add(key(d.row, d.col))

    // Agrupamos por fila para escanear gaps.
    const byRow = new Map<number, number[]>()
    for (const k of taken) {
      const [r, c] = k.split(':').map(Number)
      if (!byRow.has(r)) byRow.set(r, [])
      byRow.get(r)!.push(c)
    }

    const warnings: ContiguityWarning[] = []
    const isolatedKeys = new Set<string>()

    byRow.forEach((cols, row) => {
      const sorted = [...cols].sort((a, b) => a - b)
      for (let i = 0; i < sorted.length - 1; i++) {
        const gap = sorted[i + 1] - sorted[i]
        if (gap === 2) {
          const col = sorted[i] + 1
          // Validamos columna dentro del rango (si nos lo dieron)
          if (columns !== undefined && (col < 0 || col >= columns)) continue
          // Excluimos cuando el asiento intermedio está deshabilitado.
          if (taken.has(key(row, col))) continue
          const k = key(row, col)
          if (isolatedKeys.has(k)) continue
          isolatedKeys.add(k)
          warnings.push({
            id: k,
            row,
            col,
            message: `Row ${row + 1}, seat ${col + 1} would be left alone — consider adding it or shifting your selection.`
          })
        }
      }
    })

    return {
      warnings,
      hasIsolation: warnings.length > 0,
      isolatedKeys
    }
  }, [selected, reserved, disabled, columns])
}
