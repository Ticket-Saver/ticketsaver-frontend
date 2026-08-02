import { useEffect, useState } from 'react'
import { hiEventsService } from '../services/hiEventsService'
import type { HiHomeConfig } from '../types/hievents'

/**
 * Curaduría de la Home (GET /public/home-config): eventos destacados (hero) y
 * carruseles que el admin armó. Si no hay config, devuelve null y la Home cae
 * a su comportamiento automático.
 */
export function useHomeConfig() {
  const [config, setConfig] = useState<HiHomeConfig | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    hiEventsService
      .getHomeConfig(controller.signal)
      .then((c) => setConfig(c))
      .catch(() => setConfig(null))
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [])

  return { config, loading }
}
