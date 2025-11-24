/**
 * Servicio de Fallback para datos locales
 * Utiliza archivos en src/assets/events como respaldo cuando GitHub falla
 */

interface FallbackConfig {
  useLocal?: boolean // Forzar uso de datos locales
  showWarning?: boolean // Mostrar advertencia cuando se use fallback
}

class FallbackDataService {
  private readonly isDevelopment = import.meta.env.DEV
  private localEvents: any = null
  private localVenues: any = null

  /**
   * Log de advertencia
   */
  private warn(message: string): void {
    if (this.isDevelopment) {
      console.warn(`⚠️ FALLBACK: ${message}`)
    }
  }

  /**
   * Carga eventos locales desde el archivo
   */
  private async loadLocalEvents(): Promise<any> {
    if (this.localEvents) return this.localEvents

    try {
      const response = await fetch('/src/assets/events/events.json')
      this.localEvents = await response.json()
      return this.localEvents
    } catch (error) {
      this.warn('No se pudieron cargar eventos locales')
      return {}
    }
  }

  /**
   * Carga venues locales desde el archivo
   */
  private async loadLocalVenues(): Promise<any> {
    if (this.localVenues) return this.localVenues

    try {
      const response = await fetch('/src/assets/events/venues.json')
      this.localVenues = await response.json()
      return this.localVenues
    } catch (error) {
      this.warn('No se pudieron cargar venues locales')
      return {}
    }
  }

  /**
   * Obtiene eventos desde archivos locales
   */
  async getLocalEvents(): Promise<any> {
    return await this.loadLocalEvents()
  }

  /**
   * Obtiene venues desde archivos locales
   */
  async getLocalVenues(): Promise<any> {
    return await this.loadLocalVenues()
  }

  /**
   * Obtiene la ruta de una imagen local
   */
  getLocalImagePath(eventLabel: string): string {
    // Construir ruta relativa a la imagen local
    try {
      // Usar import dinámico para imágenes
      const imagePath = new URL(`../assets/events/${eventLabel}/banner.png`, import.meta.url).href
      return imagePath
    } catch (error) {
      this.warn(`No se encontró imagen local para ${eventLabel}`)
      // Retornar imagen de placeholder o vacía
      return ''
    }
  }

  /**
   * Obtiene descripción desde archivo local
   */
  async getLocalDescription(eventLabel: string): Promise<string> {
    try {
      const response = await fetch(
        new URL(`../assets/events/${eventLabel}/description.txt`, import.meta.url).href
      )
      if (!response.ok) {
        throw new Error('Archivo no encontrado')
      }
      return await response.text()
    } catch (error) {
      this.warn(`No se encontró descripción local para ${eventLabel}`)
      return 'Descripción no disponible'
    }
  }

  /**
   * Obtiene zone_price desde archivo local
   */
  async getLocalZonePrice(eventLabel: string): Promise<any> {
    try {
      const response = await fetch(
        new URL(`../assets/events/${eventLabel}/zone_price.json`, import.meta.url).href
      )
      if (!response.ok) {
        throw new Error('Archivo no encontrado')
      }
      return await response.json()
    } catch (error) {
      this.warn(`No se encontró zone_price local para ${eventLabel}`)
      return null
    }
  }

  /**
   * Wrapper de fetch con fallback automático
   */
  async fetchWithFallback<T>(
    fetcher: () => Promise<T>,
    fallbackData: T,
    config?: FallbackConfig
  ): Promise<T> {
    // Si está configurado para usar solo datos locales
    if (config?.useLocal) {
      if (config?.showWarning !== false) {
        this.warn('Usando datos locales (modo forzado)')
      }
      return fallbackData
    }

    try {
      // Intentar obtener datos remotos
      return await fetcher()
    } catch (error) {
      // Si falla, usar datos locales
      if (config?.showWarning !== false) {
        this.warn('Error al obtener datos remotos, usando fallback local')
      }
      return fallbackData
    }
  }

  /**
   * Verifica si un evento tiene datos locales disponibles
   */
  async hasLocalEventData(eventLabel: string): Promise<boolean> {
    const events = await this.loadLocalEvents()
    return eventLabel in events
  }

  /**
   * Verifica si un venue tiene datos locales disponibles
   */
  async hasLocalVenueData(venueLabel: string): Promise<boolean> {
    const venues = await this.loadLocalVenues()
    return venueLabel in venues
  }

  /**
   * Obtiene un evento específico (local o remoto)
   */
  async getEvent(eventLabel: string, remoteFetcher?: () => Promise<any>): Promise<any> {
    const events = await this.loadLocalEvents()
    if (remoteFetcher) {
      return this.fetchWithFallback(remoteFetcher, events[eventLabel], { showWarning: true })
    }
    return events[eventLabel]
  }

  /**
   * Obtiene un venue específico (local o remoto)
   */
  async getVenue(venueLabel: string, remoteFetcher?: () => Promise<any>): Promise<any> {
    const venues = await this.loadLocalVenues()
    if (remoteFetcher) {
      return this.fetchWithFallback(remoteFetcher, venues[venueLabel], { showWarning: true })
    }
    return venues[venueLabel]
  }

  /**
   * Obtiene todos los eventos disponibles localmente
   */
  async getAvailableLocalEvents(): Promise<string[]> {
    const events = await this.loadLocalEvents()
    return Object.keys(events)
  }

  /**
   * Obtiene todos los venues disponibles localmente
   */
  async getAvailableLocalVenues(): Promise<string[]> {
    const venues = await this.loadLocalVenues()
    return Object.keys(venues)
  }

  /**
   * Modo de emergencia: fuerza el uso de todos los datos locales
   */
  enableEmergencyMode(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('fallback_emergency_mode', 'true')
      console.warn('🚨 MODO EMERGENCIA ACTIVADO: Usando solo datos locales')
    }
  }

  /**
   * Desactiva el modo de emergencia
   */
  disableEmergencyMode(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('fallback_emergency_mode')
      console.log('✅ Modo emergencia desactivado')
    }
  }

  /**
   * Verifica si el modo de emergencia está activo
   */
  isEmergencyMode(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('fallback_emergency_mode') === 'true'
    }
    return false
  }
}

// Exportar instancia singleton
export const fallbackDataService = new FallbackDataService()

// Exportar tipos
export type { FallbackConfig }
