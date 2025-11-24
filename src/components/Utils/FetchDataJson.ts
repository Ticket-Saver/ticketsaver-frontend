import { useState, useEffect } from 'react'
import { cacheService } from '../../services/cacheService'

const useFetchJson = (url: string, options?: RequestInit) => {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Usar caché con TTL de 10 minutos
        const eventData = await cacheService.fetchWithCache<any[]>(url, options, {
          ttl: 10 * 60 * 1000,
          useLocalStorage: true
        })
        setData(eventData)
      } catch (error) {
        setError(error as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  // Only return data if it's not empty
  return { data: Object.keys(data).length > 0 ? data : null, loading, error }
}

const findData = (data: any[], id: string) => {
  return data.find((item) => item.id === id)
}

const fetchGitHubImage = async (label: string): Promise<string> => {
  const token = import.meta.env.VITE_GITHUB_TOKEN //
  const Url = `${import.meta.env.VITE_GITHUB_API_URL as string}/events/${label}/banner.png`

  // Usar caché con TTL de 30 minutos (las imágenes no cambian frecuentemente)
  const imageUrl = await cacheService.fetchImageWithCache(
    Url,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3.raw'
      }
    },
    {
      ttl: 30 * 60 * 1000, // 30 minutos
      useLocalStorage: false // Imágenes solo en memoria
    }
  )

  return imageUrl
}
const fetchDescription = async (label: string, options: any): Promise<any> => {
  const Url = `${import.meta.env.VITE_GITHUB_API_URL as string}/events/${label}/description.txt`
  try {
    // Usar caché con TTL de 15 minutos
    const description = await cacheService.fetchTextWithCache(Url, options, {
      ttl: 15 * 60 * 1000,
      useLocalStorage: true
    })
    return description
  } catch (error) {
    console.error('Error obteniendo los datos', error)
    throw error
  }
}
export { useFetchJson, findData, fetchGitHubImage, fetchDescription }
