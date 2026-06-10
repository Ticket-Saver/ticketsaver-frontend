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

export interface ValidateAddResult {
  ok: boolean
  reason?: string
}

/**
 * Valida — ANTES de confirmar — si agregar `candidate` produciría una
 * selección inválida en su fila. Reglas (bloqueo duro):
 *
 * 1. Contigüidad: los asientos del comprador en esa fila no pueden tener
 *    un lugar LIBRE entre medio (deben quedar pegados, salvo que los
 *    separe un asiento ya vendido/pasillo).
 * 2. Sin huérfanos: la acción no puede dejar un asiento libre suelto
 *    (un hueco de exactamente 1), ni encerrado ni pegado al borde/pasillo.
 *
 * Sólo evalúa la fila del candidato: su click sólo afecta esa fila.
 */
export function validateSeatAdd(
  candidate: SeatCoord,
  args: {
    selected: SeatCoord[]
    reserved: SeatCoord[]
    disabled?: SeatCoord[]
    columns?: number
  }
): ValidateAddResult {
  const { selected, reserved, disabled = [], columns } = args
  const row = candidate.row
  const colsInRow = (arr: SeatCoord[]) =>
    arr.filter((s) => s.row === row).map((s) => s.col)

  const disabledCols = new Set(colsInRow(disabled))
  const reservedCols = new Set(colsInRow(reserved))
  const selectedBefore = new Set(colsInRow(selected))
  const selectedAfter = new Set(selectedBefore)
  selectedAfter.add(candidate.col)

  const width =
    columns ??
    Math.max(
      candidate.col,
      ...colsInRow(reserved),
      ...colsInRow(disabled),
      ...colsInRow(selected)
    ) + 1

  const isWall = (c: number) => c < 0 || c >= width || disabledCols.has(c)
  const isFree = (c: number, sel: Set<number>) =>
    !isWall(c) && !sel.has(c) && !reservedCols.has(c)

  // Regla 1 — contigüidad de la selección del comprador.
  const myCols = [...selectedAfter].sort((a, b) => a - b)
  if (myCols.length >= 2) {
    for (let c = myCols[0]; c <= myCols[myCols.length - 1]; c++) {
      if (isFree(c, selectedAfter)) {
        return {
          ok: false,
          reason:
            "Your seats have to be next to each other — you can't leave an empty seat between the ones you pick. Choose adjacent seats."
        }
      }
    }
  }

  // Regla 2 — no dejar un asiento suelto (run de libres de longitud 1).
  const findOrphans = (sel: Set<number>): number[] => {
    const orphans: number[] = []
    let c = 0
    while (c < width) {
      if (isFree(c, sel)) {
        const start = c
        while (c < width && isFree(c, sel)) c++
        if (c - start === 1) orphans.push(start)
      } else {
        c++
      }
    }
    return orphans
  }
  const before = new Set(findOrphans(selectedBefore))
  const createsOrphan = findOrphans(selectedAfter).some((c) => !before.has(c))
  if (createsOrphan) {
    return {
      ok: false,
      reason:
        'That selection would leave a single seat stranded on its own. Pick your seats so none are left alone — not in the middle and not at the edge of the row.'
    }
  }

  return { ok: true }
}

/** Un asiento de una fila para validar contigüidad por número de asiento. */
export interface RowSeatInfo {
  /** seat_number numérico. */
  num: number
  /** true si está libre/comprable (is_available && !is_sold_out). */
  available: boolean
}

/**
 * Variante de `validateSeatAdd` para el mapa de HiEvents, donde los asientos se
 * identifican por FILA (letra) + número, no por coordenadas. Es genérica: vale
 * para cualquier mapa (map1 fila+número, map2 número+fila) porque opera sobre los
 * `seat_number` de los asientos REALES de la fila. Los números inexistentes (saltos
 * de numeración → pasillos) y los asientos vendidos se tratan como pared.
 *
 * Regla de bloqueo duro: CONTIGÜIDAD — los asientos elegidos no pueden tener un
 * asiento LIBRE entre medio. NO se bloquea dejar asientos sueltos en la punta: el
 * comprador puede querer menos asientos de los que hay en la fila (comprar 3 de 4),
 * o llegar a comprar los 4 pasando por estados intermedios.
 *
 * @param candidateNum  seat_number que se quiere AGREGAR.
 * @param rowSeats      todos los asientos de esa fila visibles en la sección.
 * @param selectedNums  seat_number ya seleccionados en esa fila (antes de agregar).
 */
export function validateSeatAddByNumber(
  candidateNum: number,
  rowSeats: RowSeatInfo[],
  selectedNums: number[]
): ValidateAddResult {
  if (rowSeats.length === 0) return { ok: true }

  const availableByNum = new Map<number, boolean>()
  for (const s of rowSeats) availableByNum.set(s.num, s.available)

  const selAfter = new Set(selectedNums)
  selAfter.add(candidateNum)

  // Libre = existe, está disponible y no está seleccionado.
  const isFree = (n: number, sel: Set<number>) =>
    availableByNum.get(n) === true && !sel.has(n)

  // Única regla (bloqueo duro): CONTIGÜIDAD — no dejar un asiento LIBRE entre los
  // asientos que el comprador eligió. NO bloqueamos dejar asientos sueltos (en la
  // punta o donde sea): el comprador puede querer menos asientos de los que hay en
  // la fila, y forzarlo a llenarla impediría compras legítimas (comprar 3 de 4, o
  // llegar a comprar los 4 pasando por estados intermedios).
  const sel = [...selAfter].sort((a, b) => a - b)
  if (sel.length >= 2) {
    for (let n = sel[0]; n <= sel[sel.length - 1]; n++) {
      if (isFree(n, selAfter)) {
        return {
          ok: false,
          reason:
            "Your seats have to be next to each other — you can't leave an empty seat between the ones you pick. Choose adjacent seats."
        }
      }
    }
  }

  return { ok: true }
}
