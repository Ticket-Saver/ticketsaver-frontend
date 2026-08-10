const SIDE_LABEL: Record<string, string> = {
  left: 'Left',
  right: 'Right',
  center: 'Center',
  leftcenter: 'Left Center',
  rightcenter: 'Right Center'
}

/** Sección para mostrar. En zonas (balcony/loge) el backend guarda `section` como la
 *  zona sola ("Balcony") y el lado vive en el position crudo ("balconyright") → "Balcony Right".
 *  Fuera de esas zonas, deja la sección tal cual. */
export const sectionWithSide = (
  section?: string | null,
  position?: string | null
): string | undefined => {
  const sec = section?.trim() || undefined
  const pos = (position || '').toLowerCase()
  if (!sec || !pos) return sec
  const zone = ['balcony', 'loge'].find((z) => pos.startsWith(z))
  if (!zone) return sec
  const side = SIDE_LABEL[pos.slice(zone.length)]
  return side ? `${sec} ${side}` : sec
}

/** Sección de un ticket de HiEvents (TicketMinimalResourcePublic). Ojo: la API
 *  pisa `position` con `seat_number` cuando existe; el position crudo viaja en
 *  `subZone`, así que se prueba primero. */
export const ticketSection = (
  t?: { section?: string | null; position?: string | null; subZone?: string | null } | null
): string | undefined => sectionWithSide(t?.section, t?.subZone ?? t?.position)
