import { API_URLS } from '../config/api'

interface UserTicket {
  ticketId: string
  zone: string
  section: string
  price: string
  status: 'ACTIVE' | 'USED' | 'CANCELLED'
}

interface UserEvent {
  eventId: string
  eventName: string
  venue: string | null
  venueId: string | null
  /**
   * Fecha/hora del evento en formato ISO (normalmente UTC, e.g. 2026-03-17T01:00:00.000000Z)
   */
  date: string
  /**
   * Fecha/hora de fin del evento en ISO, si está disponible.
   */
  endDate?: string
  /**
   * Timezone oficial del evento (por ejemplo "America/Chicago").
   * Se usa para formatear la fecha/hora mostrada al usuario.
   */
  timezone?: string
  location: string | null
  description?: string
  imageUrl?: string
  publicId?: string
  eventIdNumber?: number
  tickets: UserTicket[]
}

interface UserTicketsResponse {
  success: boolean
  data: UserEvent[]
  totalEvents: number
  totalTickets: number
}

interface UserTicketsFilters {
  status?: 'ACTIVE' | 'USED' | 'CANCELLED'
  from?: string
  to?: string
  venueId?: string
  page?: number
  per_page?: number
  sort_by?: string
  sort_direction?: 'asc' | 'desc'
}

export class UserTicketsService {
  static async getUserTickets(
    userEmail: string,
    filters: UserTicketsFilters = {}
  ): Promise<UserTicketsResponse> {
    try {
      const params = new URLSearchParams({
        email: userEmail
      })

      // Add filter parameters only if they have values
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })

      const response = await fetch(`${API_URLS.USER_TICKETS}?${params}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_TOKEN_HIEVENTS || ''}`
        }
      })

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} ${response.statusText}`)
      }

      const data: UserTicketsResponse = await response.json()

      if (!data.success) {
        throw new Error('Error en la respuesta del servidor')
      }

      return data
    } catch (error) {
      console.error('Error fetching user tickets:', error)
      throw error
    }
  }

  static async getUpcomingTickets(userEmail: string): Promise<UserEvent[]> {
    const currentDate = new Date()
    const response = await this.getUserTickets(userEmail, {
      from: currentDate.toISOString(),
      status: 'ACTIVE'
    })

    return response.data.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate > currentDate
    })
  }

  static async getPastTickets(userEmail: string): Promise<UserEvent[]> {
    const currentDate = new Date()
    const response = await this.getUserTickets(userEmail, {
      to: currentDate.toISOString()
    })

    return response.data.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate < currentDate
    })
  }

  static async getActiveTickets(userEmail: string): Promise<UserEvent[]> {
    const response = await this.getUserTickets(userEmail, {
      status: 'ACTIVE'
    })
    return response.data
  }

  static async getUsedTickets(userEmail: string): Promise<UserEvent[]> {
    const response = await this.getUserTickets(userEmail, {
      status: 'USED'
    })
    return response.data
  }

  static async getCancelledTickets(userEmail: string): Promise<UserEvent[]> {
    const response = await this.getUserTickets(userEmail, {
      status: 'CANCELLED'
    })
    return response.data
  }
}

export type { UserTicket, UserEvent, UserTicketsResponse, UserTicketsFilters }
