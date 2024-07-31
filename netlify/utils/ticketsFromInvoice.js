import { parse } from 'path'

const TicketsFromInvoices = async (invoices) => {
  return invoices.data.flatMap((invoice) => {
    const { metadata } = invoice

    return invoice.lines.data.map((line) => ({
      price: (line.amount / 100).toFixed(2),
      description: line.description, //Ticket H2; P1 ;Zone Mezzanine Green right -> description.split(;) P1 no necesario
      eventName: metadata.eventName || '', // Las Leonas
      eventId: metadata.eventId || '',
      venue: metadata.venue || '', // California Theatre
      venueId: metadata.venueId, // californiatheatre_ca
      date: metadata.date, // 2024-10-18
      location: metadata.location // San Jose, CA
    }))
  })
}

const TicketsByEvent = (tickets) => {
  //devuelve las descripciones(asiento y zona) y la demás info agrupadas en un array con identificador el eventID
  return tickets.reduce((acc, ticket) => {
    const { eventId, description, ...info } = ticket

    if (eventId != '') {
      if (!acc[eventId]) {
        acc[eventId] = []
      }

      const newDescription = parseDescription(description)
      const newTicket = { ...newDescription, ...info }

      if (newDescription != null) {
        acc[eventId].push(newTicket)
      }
    }
    return acc
  }, {})
}

const DescriptionsByEvent = (tickets) => {
  return tickets.reduce((acc, ticket) => {
    const { eventId, description } = ticket
    if (eventId != '') {
      if (!acc[eventId]) {
        acc[eventId] = []
      }

      const parsedDescription = parseDescription(description)

      if (parsedDescription) {
        acc[eventId].push(parsedDescription)
      }
    }
    return acc
  }, {})
}

export { TicketsFromInvoices, TicketsByEvent, DescriptionsByEvent }

const parseDescription = (description) => {
  const parts = description.split(';').map((part) => part.trim()) //Ticket: G19; P2; Zone: Orchestra Section 1 Aqua'

  // Crear un objeto con los campos específicos
  const parsedObject = {}
  parts.forEach((part) => {
    const [key, value] = part.split(':').map((str) => str.trim()) //Ticket y Zone están definidos  mediante :
    if (key && value) {
      parsedObject[key] = value
    }
  })

  return Object.keys(parsedObject).length > 0 ? parsedObject : null
}
