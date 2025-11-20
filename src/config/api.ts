/**
 * Configuración del API
 * Permite cambiar la URL base del API entre desarrollo local y producción
 */

// const API_BASE_URL = ''
// URL base del API - usa el proxy de Netlify para evitar problemas de CORS
// En producción, usa el proxy-api de Netlify
// Puede ser sobrescrita por variables de entorno para desarrollo local
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/proxy-api'

// Configuración completa del API
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  ENDPOINTS: {
    // Endpoints principales
    API: '/api/',
    EVENTS: '/api/events/',
    PUBLIC_EVENTS: '/api/public/events/',
    SETTINGS: '/api/events/',
    LOCK_SEAT: '/api/lockSeat/',
    USER_TICKETS: '/api/public/user/tickets',

    // Endpoints específicos
    getEventSettings: (venue: string) => `/api/events/${venue}/settings/`,
    getPublicEvent: (venue: string) => `/api/public/events/${venue}/`,
    getPublicEventImages: (venue: string) => `/api/public/events/${venue}/`,
    getEventImages: (venue: string) => `/api/events/${venue}/images/`,
    getSeatsAvailability: (eventId: string, group: string) =>
      `/api/public/events/${eventId}/seats/availability/group?group=${group}`
  }
}

// Función helper para construir URLs completas
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`
}

// URLs pre-construidas para uso común
export const API_URLS = {
  API: buildApiUrl(API_CONFIG.ENDPOINTS.API),
  EVENTS: buildApiUrl(API_CONFIG.ENDPOINTS.EVENTS),
  PUBLIC_EVENTS: buildApiUrl(API_CONFIG.ENDPOINTS.PUBLIC_EVENTS),
  LOCK_SEAT: buildApiUrl(API_CONFIG.ENDPOINTS.LOCK_SEAT),
  USER_TICKETS: buildApiUrl(API_CONFIG.ENDPOINTS.USER_TICKETS),

  // Funciones para URLs dinámicas
  getEventSettings: (venue: string) => buildApiUrl(API_CONFIG.ENDPOINTS.getEventSettings(venue)),
  getPublicEvent: (venue: string) => buildApiUrl(API_CONFIG.ENDPOINTS.getPublicEvent(venue)),
  getPublicEventImages: (venue: string) =>
    buildApiUrl(API_CONFIG.ENDPOINTS.getPublicEventImages(venue)),
  getEventImages: (venue: string) => buildApiUrl(API_CONFIG.ENDPOINTS.getEventImages(venue)),
  getSeatsAvailability: (eventId: string, group: string) =>
    buildApiUrl(API_CONFIG.ENDPOINTS.getSeatsAvailability(eventId, group))
}

// Configuración para desarrollo local
// export const DEV_CONFIG = {
//   // URL para desarrollo local (cuando VITE_API_BASE_URL no está definida)
//   LOCAL_API_URL: 'http://localhost:3001', // Ajusta el puerto según tu configuración local

//   // Función para obtener la URL correcta según el entorno
//   getApiUrl: () => {
//     if (import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL) {
//       return DEV_CONFIG.LOCAL_API_URL
//     }
//     return API_CONFIG.BASE_URL
//   }
// }

// Exportar la configuración por defecto
export default API_CONFIG
