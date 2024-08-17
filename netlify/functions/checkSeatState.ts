import { Handler, HandlerEvent } from "@netlify/functions";
import { supabase } from '../utils/supabaseClient'
interface DataDict {
  client_info: string
  ticket_tag: string
  charge_id: string
  event_label: string
  ticket_token: string,
  password: string
}

const scanPassword = process.env.SCAN_PASSWORD;
export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST' || !event.body) {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  const data: DataDict = JSON.parse(event.body)

  if (data.password !== scanPassword) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' })
    }
  }

  //check in supabase if ticket exists user ticket_token
  const { data: ticket, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('ticket_token', data.ticket_token)
    .single()

  //if ticket does not exist, insert ticket_token and the scan date into tickets table
  if (ticket === null) {
    const { data: newTicket, error } = await supabase
      .from('tickets')
      .insert([
        { ticket_token: data.ticket_token, scan_date: new Date() }
      ])
    // if ticket is not here, is valid, user can enter the event
    return {
      statusCode: 200,
      body: JSON.stringify(
        { message: "Ticket is valid, user can enter the event" }
      ),
    };
  }
  //if ticket exists, user has already entered the event and cannot enter again
  return {
    statusCode: 403,
    body: JSON.stringify(
      { message: "Ticket already scanned" }
    ),
  };
};