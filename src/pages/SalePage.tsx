import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import Header from '../components/Header'
import Footer from '../components/Footer'
import TicketSelectionSeat from './TicketEventSale'
import TicketSelectionNoSeat from './TicketEventSaleNoSeats'
const { venue } = useParams()
const [venues, setVenue] = useState<any>(null)
const githubApiUrl = `${import.meta.env.VITE_GITHUB_API_URL as string}/venues.json`
const token = import.meta.env.VITE_GITHUB_TOKEN

useEffect(() => {
  const fetchVenues = async () => {
    const storedVenues = localStorage.getItem('Venues')
    localStorage.removeItem('Venues')

    if (storedVenues) {
      setVenue(JSON.parse(storedVenues))
    } else {
      try {
        const response = await fetch(githubApiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3.raw'
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        const matchingVenue = data[venue!]
        setVenue(matchingVenue)
      } catch (error) {
        console.error('Error fetching data: ', error)
      }
    }
  }
  fetchVenues()
}, [venue, githubApiUrl, token])

export default function SalePage() {
  return (
    <>
      <Header />({venues.seatmap ? TicketSelectionSeat : TicketSelectionNoSeat}) <Footer />
    </>
  )
}
