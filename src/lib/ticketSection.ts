const SIDE_LABEL: Record<string, string> = {
  left: 'Left',
  right: 'Right',
  center: 'Center',
  leftcenter: 'Left Center',
  rightcenter: 'Right Center'
}

/** Sección para mostrar. El backend guarda `section` como la zona sola ("Balcony")
 *  y el detalle vive en el position crudo, con dos formatos según el venue:
 *  - Miami: sección + lado concatenados ("balconyright") → "Balcony Right".
 *  - San Jose: número de zona aparte ("205") → "Balcony 205".
 *  Si position no agrega nada (igual a la sección), queda la sección sola. */
export const sectionWithSide = (
  section?: string | null,
  position?: string | null
): string | undefined => {
  const sec = section?.trim() || undefined
  const posRaw = (position || '').trim()
  const pos = posRaw.toLowerCase()
  if (!posRaw) return sec
  if (!sec) return posRaw
  const secKey = sec.toLowerCase().replace(/\s+/g, '')
  if (pos.startsWith(secKey)) {
    const side = SIDE_LABEL[pos.slice(secKey.length)]
    return side ? `${sec} ${side}` : sec
  }
  return `${sec} ${posRaw}`
}

/** Sección de un ticket de HiEvents (TicketMinimalResourcePublic). Ojo: la API
 *  pisa `position` con `seat_number` cuando existe; el position crudo viaja en
 *  `subZone`, así que se prueba primero. */
export const ticketSection = (
  t?: { section?: string | null; position?: string | null; subZone?: string | null } | null
): string | undefined => sectionWithSide(t?.section, t?.subZone ?? t?.position)
