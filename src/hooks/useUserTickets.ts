import { useState, useEffect } from 'react'
import { UserTicketsService, UserEvent, UserTicketsFilters } from '../services/userTicketsService'

interface UseUserTicketsReturn {
  tickets: UserEvent[] | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useUserTickets(
  email: string,
  filters: UserTicketsFilters = {}
): UseUserTicketsReturn {
  const [tickets, setTickets] = useState<UserEvent[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTickets = async () => {
    if (!email) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await UserTicketsService.getUserTickets(email, filters)
      setTickets(response.data)
    } catch (err) {
      console.error('Error fetching user tickets:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [email, JSON.stringify(filters)])

  return { tickets, loading, error, refetch: fetchTickets }
}

export function useUpcomingTickets(email: string): UseUserTicketsReturn {
  const [tickets, setTickets] = useState<UserEvent[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTickets = async () => {
    if (!email) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const upcomingTickets = await UserTicketsService.getUpcomingTickets(email)
      setTickets(upcomingTickets)
    } catch (err) {
      console.error('Error fetching upcoming tickets:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [email])

  return { tickets, loading, error, refetch: fetchTickets }
}

export function usePastTickets(email: string): UseUserTicketsReturn {
  const [tickets, setTickets] = useState<UserEvent[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTickets = async () => {
    if (!email) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const pastTickets = await UserTicketsService.getPastTickets(email)
      setTickets(pastTickets)
    } catch (err) {
      console.error('Error fetching past tickets:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [email])

  return { tickets, loading, error, refetch: fetchTickets }
}
