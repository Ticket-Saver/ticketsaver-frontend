import { SHA256, enc } from 'crypto-js'

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


export async function fetchDataFromGitHub(data :string) {
  const githubApiUrl = `${import.meta.env.VITE_GITHUB_API_URL as string}/${data}.json`
  const token = import.meta.env.VITE_GITHUB_TOKEN
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3.raw'
    }
  }
  try {
    const response = await fetch(githubApiUrl,options);
    if (!response.ok) {
      throw new Error('Error en la respuesta de la API');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener los eventos:', error);
    throw error;
  }
};