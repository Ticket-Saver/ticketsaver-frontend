/**
 * feedbackService — registra micro-feedback (¿esta sección fue clara?)
 * de las páginas legales / FAQs.
 *
 * Por ahora persiste en localStorage para no perder votos y loguea en
 * DEV. Cuando exista un endpoint de analytics, hacemos POST acá.
 */

export type FeedbackVote = 'clear' | 'confusing' | 'helpful' | 'not-helpful'

export interface FeedbackEntry {
  context: string
  sectionId: string
  vote: FeedbackVote
  at: number
}

const STORAGE_KEY = 'ts_feedback_votes'

const read = (): FeedbackEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as FeedbackEntry[]) : []
  } catch {
    return []
  }
}

export const recordFeedback = (
  context: string,
  sectionId: string,
  vote: FeedbackVote
): void => {
  const entry: FeedbackEntry = { context, sectionId, vote, at: Date.now() }
  try {
    const all = read()
    // Reemplazamos el voto previo de la misma sección.
    const filtered = all.filter(
      (e) => !(e.context === context && e.sectionId === sectionId)
    )
    filtered.push(entry)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch {
    /* noop */
  }
  if (import.meta.env.DEV) {
    console.log('[feedbackService]', entry)
  }
}

export const getFeedbackFor = (
  context: string,
  sectionId: string
): FeedbackVote | null => {
  const match = read().find(
    (e) => e.context === context && e.sectionId === sectionId
  )
  return match?.vote ?? null
}
