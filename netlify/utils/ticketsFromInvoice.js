const TicketsFromInvoices = async (invoices) => {
  return invoices.data.flatMap((invoice) => {
    const { metadata } = invoice

    return invoice.lines.data.map((line) => ({
      price: (line.amount / 100).toFixed(2),
      description: line.description || '', //Ticket H2; P1 ;Zone Mezzanine Green right
      eventName: metadata.eventName || '', // Las Leonas
      venue: metadata.venue || '', // California Theatre
      venueId: `${metadata.venueId}`, // californiatheatre_ca
      date: `${metadata.date}`, // 2024-10-18
      location: `${metadata.location}` // San Jose, CA
    }))
  })
}

export { TicketsFromInvoices }
