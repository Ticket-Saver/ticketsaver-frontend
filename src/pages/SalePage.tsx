import { useParams } from 'react-router-dom'

export default function SalePage() {
  const { eventId } = useParams()

  return (
    <div>
      <h1>Sale Page</h1>
      <p>Event ID: {eventId}</p>
    </div>
  )
}
