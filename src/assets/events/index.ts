/**
 * Módulo de carga de datos locales de eventos y venues
 * Este archivo facilita el import de JSON en Vite
 */

// Import directo de JSON - Vite lo maneja correctamente
import eventsData from './events.json'
import venuesData from './venues.json'

export const localEvents = eventsData
export const localVenues = venuesData

// Para debug en desarrollo
if (import.meta.env.DEV) {
  console.log('📦 Datos locales cargados:', {
    eventos: Object.keys(localEvents).length,
    venues: Object.keys(localVenues).length
  })
}
