import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

// Define la interfaz para la ubicación de un venue
export interface Location {
  address: string
  city: string
  country: string
  maps_url: string
  zip_code: string
}

// Define la interfaz para un venue
export interface Venue {
  capacity: number
  venue_label: string
  location: Location
  venue_name: string
  seatmap: boolean
}

// Define el tipo para los venues: un objeto en el que cada llave corresponde a un venue
interface VenuesData {
  [key: string]: Venue
}

interface VenuesContextValue {
  venues: VenuesData | null
}

const VenuesContext = createContext<VenuesContextValue>({ venues: null })

export const VenuesProvider = ({ children }: { children: ReactNode }) => {
  const [venues, setVenues] = useState<VenuesData | null>(null)
  const token = import.meta.env.VITE_GITHUB_TOKEN
  const githubApiUrl = `${import.meta.env.VITE_GITHUB_API_URL as string}/venues.json`
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3.raw'
    }
  }

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await fetch(githubApiUrl, options)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: VenuesData = await response.json()
        setVenues(data)
      } catch (error) {
        console.error('Error fetching venues: ', error)
      }
    }
    fetchVenues()
  }, [githubApiUrl, token])

  return <VenuesContext.Provider value={{ venues }}>{children}</VenuesContext.Provider>
}

export const useVenues = () => {
  return useContext(VenuesContext)
}
