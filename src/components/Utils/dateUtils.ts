// Util para parsear fechas recibidas desde el backend interpretando
// cadenas "YYYY-MM-DD" como fecha local (evita desplazamientos por UTC)
export function parseLocalDate(dateStr: string | undefined | null): Date | null {
  if (!dateStr) return null

  // Extrae la parte YYYY-MM-DD incluso si viene con tiempo: YYYY-MM-DDTHH:MM:SS
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (match) {
    const [, y, m, d] = match
    const year = Number(y)
    const month = Number(m) - 1
    const day = Number(d)
    const localDate = new Date(year, month, day)
    return isNaN(localDate.getTime()) ? null : localDate
  }

  const parsed = new Date(dateStr)
  return isNaN(parsed.getTime()) ? null : parsed
}

export default parseLocalDate
