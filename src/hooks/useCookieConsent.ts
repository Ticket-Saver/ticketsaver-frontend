import { useEffect, useState } from 'react'
import { getConsent, subscribeConsent, type ConsentState } from '../lib/consent/cookieConsent'

/** Estado de consentimiento reactivo — se actualiza cuando el usuario decide en el banner. */
export const useCookieConsent = (): ConsentState => {
  const [state, setState] = useState<ConsentState>(getConsent())
  useEffect(() => subscribeConsent(setState), [])
  return state
}
