
const TicketsFromInvoices = async (invoices) => {
    return invoices.data.flatMap(invoice => {

      const { eventName } = invoice.metadata.eventName || '';

      return invoice.lines.data.map(line => ({
        description: line.description || '',
        eventName: eventName
      }));
    });
  }
  
export { TicketsFromInvoices }