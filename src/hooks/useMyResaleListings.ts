import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { hiEventsService } from '../services/hiEventsService'
import type { HiResaleListing } from '../types/hievents'

export interface UseMyResaleListingsResult {
  loading: boolean
  error: string | null
  listings: HiResaleListing[]
  /** Set de attendee public_ids listados (para marcar tickets como "en reventa" en la UI). */
  refresh: () => void
}

export function useMyResaleListings(): UseMyResaleListingsResult {
  const { status } = useAuth()
  const authenticated = status === 'authenticated'

  const [listings, setListings] = useState<HiResaleListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nonce, setNonce] = useState(0)

  const refresh = useCallback(() => setNonce((n) => n + 1), [])

  useEffect(() => {
    if (status === 'loading') return
    if (!authenticated) {
      setListings([])
      setLoading(false)
      setError(null)
      return
    }
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    hiEventsService
      .getMyResaleListings(controller.signal)
      .then((res) => setListings(res.data ?? []))
      .catch((e) => {
        if (controller.signal.aborted) return
        setError(e instanceof Error ? e.message : 'No pudimos cargar tus reventas.')
        setListings([])
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [authenticated, status, nonce])

  return { loading, error, listings, refresh }
}
