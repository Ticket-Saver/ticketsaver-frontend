import { SHA256, enc } from 'crypto-js'
import { cacheService } from '../services/cacheService'

export function getToken(text: string, length: number = 16): string {
  const hash = SHA256(enc.Latin1.parse(text)).toString()
  return hash.slice(0, length)
}

export function ticketId(
  eventLabel: string,
  venueZone: string,
  ticketNum: number,
  issuedAt: number
): string {
  const zone = venueZone.toLowerCase().replace(' ', '_')
  const dataFmt = `${eventLabel}:${zone}:${ticketNum.toString().padStart(2, '0')}:${issuedAt}`
  return getToken(dataFmt, 4).toUpperCase()
}

export async function fetchDataFromGitHub(data: string) {
  const githubApiUrl = `${import.meta.env.VITE_GITHUB_API_URL as string}/${data}.json`
  const token = import.meta.env.VITE_GITHUB_TOKEN
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3.raw'
    }
  }
  try {
    // Usar caché con TTL de 10 minutos
    const result = await cacheService.fetchWithCache<any>(githubApiUrl, options, {
      ttl: 10 * 60 * 1000,
      useLocalStorage: true
    })
    return result
  } catch (error) {
    console.error('Error al obtener los eventos:', error)
    throw error
  }
}
