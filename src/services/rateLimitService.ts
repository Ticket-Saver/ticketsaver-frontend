/**
 * Servicio de monitoreo y gestión de Rate Limit de GitHub
 * Extrae información de los headers y previene exceder el límite
 */

interface RateLimitInfo {
  limit: number
  remaining: number
  used: number
  reset: number // timestamp
  resetDate: Date
  resource: string
  percentageUsed: number
  timeUntilReset: number // milisegundos
}

interface RateLimitWarning {
  level: 'info' | 'warning' | 'critical' | 'blocked'
  message: string
  shouldBlock: boolean
  retryAfter?: number
}

class RateLimitService {
  private currentLimit: RateLimitInfo | null = null
  private readonly WARNING_THRESHOLD = 0.8 // 80% del límite
  private readonly CRITICAL_THRESHOLD = 0.95 // 95% del límite
  private readonly BUFFER_REQUESTS = 50 // Guardar 50 requests de seguridad
  private readonly isDevelopment = import.meta.env.DEV // Solo logs en desarrollo

  /**
   * Log interno solo en modo desarrollo
   */
  private log(message: string, ...args: any[]): void {
    if (this.isDevelopment) {
      console.log(message, ...args)
    }
  }

  /**
   * Warning log solo en modo desarrollo
   */
  private logWarn(message: string, ...args: any[]): void {
    if (this.isDevelopment) {
      console.warn(message, ...args)
    }
  }

  /**
   * Error log solo en modo desarrollo (pero siempre lanza el error)
   */
  private logError(message: string, ...args: any[]): void {
    if (this.isDevelopment) {
      console.error(message, ...args)
    }
  }

  /**
   * Extrae información de rate limit de los headers de respuesta
   */
  extractRateLimitFromHeaders(headers: Headers): RateLimitInfo | null {
    const limit = headers.get('x-ratelimit-limit')
    const remaining = headers.get('x-ratelimit-remaining')
    const used = headers.get('x-ratelimit-used')
    const reset = headers.get('x-ratelimit-reset')
    const resource = headers.get('x-ratelimit-resource')

    if (!limit || !remaining || !reset) {
      return null
    }

    const limitNum = parseInt(limit, 10)
    const remainingNum = parseInt(remaining, 10)
    const usedNum = parseInt(used || '0', 10)
    const resetNum = parseInt(reset, 10)

    const resetDate = new Date(resetNum * 1000)
    const percentageUsed = (usedNum / limitNum) * 100
    const timeUntilReset = resetDate.getTime() - Date.now()

    const info: RateLimitInfo = {
      limit: limitNum,
      remaining: remainingNum,
      used: usedNum,
      reset: resetNum,
      resetDate,
      resource: resource || 'unknown',
      percentageUsed,
      timeUntilReset
    }

    // Actualizar el límite actual
    this.currentLimit = info

    // Guardar en localStorage para persistencia
    this.saveToLocalStorage(info)

    return info
  }

  /**
   * Verifica si se debe permitir una nueva request
   */
  checkRateLimit(): RateLimitWarning {
    if (!this.currentLimit) {
      // Si no tenemos info, cargar de localStorage
      this.currentLimit = this.loadFromLocalStorage()
    }

    if (!this.currentLimit) {
      return {
        level: 'info',
        message: 'No hay información de rate limit disponible',
        shouldBlock: false
      }
    }

    const { remaining, percentageUsed, resetDate, timeUntilReset } = this.currentLimit

    // Si ya pasó el tiempo de reset, limpiar
    if (timeUntilReset <= 0) {
      this.clearRateLimit()
      return {
        level: 'info',
        message: 'Rate limit reseteado',
        shouldBlock: false
      }
    }

    // BLOQUEADO: Sin requests disponibles
    if (remaining <= 0) {
      const minutesUntilReset = Math.ceil(timeUntilReset / 60000)
      return {
        level: 'blocked',
        message: `🚫 RATE LIMIT EXCEDIDO. Reset en ${minutesUntilReset} minutos (${resetDate.toLocaleTimeString()})`,
        shouldBlock: true,
        retryAfter: timeUntilReset
      }
    }

    // CRÍTICO: Menos del 5% disponible
    if (percentageUsed >= this.CRITICAL_THRESHOLD * 100 || remaining < this.BUFFER_REQUESTS) {
      return {
        level: 'critical',
        message: `⚠️ CRÍTICO: Solo ${remaining} requests disponibles (${(100 - percentageUsed).toFixed(1)}%)`,
        shouldBlock: false
      }
    }

    // WARNING: Más del 80% usado
    if (percentageUsed >= this.WARNING_THRESHOLD * 100) {
      return {
        level: 'warning',
        message: `⚡ ADVERTENCIA: ${remaining} requests disponibles (${(100 - percentageUsed).toFixed(1)}%)`,
        shouldBlock: false
      }
    }

    // OK
    return {
      level: 'info',
      message: `✅ OK: ${remaining} requests disponibles`,
      shouldBlock: false
    }
  }

  /**
   * Obtiene información actual del rate limit
   */
  getCurrentLimit(): RateLimitInfo | null {
    if (!this.currentLimit) {
      this.currentLimit = this.loadFromLocalStorage()
    }
    return this.currentLimit
  }

  /**
   * Muestra un resumen del rate limit en consola (solo en desarrollo)
   */
  logRateLimitStatus(): void {
    if (!this.isDevelopment) return // No mostrar en producción

    const info = this.getCurrentLimit()
    if (!info) {
      this.log('📊 No hay información de rate limit disponible')
      return
    }

    const warning = this.checkRateLimit()
    const minutesUntilReset = Math.ceil(info.timeUntilReset / 60000)

    console.group('📊 GitHub API Rate Limit Status')
    console.log(`Límite total: ${info.limit} requests/hora`)
    console.log(`Usado: ${info.used} (${info.percentageUsed.toFixed(1)}%)`)
    console.log(`Disponible: ${info.remaining}`)
    console.log(`Reset: ${info.resetDate.toLocaleString()} (en ${minutesUntilReset} min)`)
    console.log(`Estado: ${warning.message}`)

    // Barra visual
    const barLength = 30
    const usedBars = Math.round((info.percentageUsed / 100) * barLength)
    const remainingBars = barLength - usedBars
    const bar = '█'.repeat(usedBars) + '░'.repeat(remainingBars)

    let barColor = '\x1b[32m' // Verde
    if (warning.level === 'warning') barColor = '\x1b[33m' // Amarillo
    if (warning.level === 'critical') barColor = '\x1b[31m' // Rojo
    if (warning.level === 'blocked') barColor = '\x1b[41m' // Rojo fondo

    console.log(`Progreso: ${barColor}${bar}\x1b[0m ${info.percentageUsed.toFixed(1)}%`)
    console.groupEnd()
  }

  /**
   * Wrapper de fetch que monitorea automáticamente el rate limit
   */
  async fetchWithRateLimit(url: string, options?: RequestInit): Promise<Response> {
    // Verificar rate limit antes de hacer la request
    const warning = this.checkRateLimit()

    if (warning.shouldBlock) {
      throw new Error(warning.message)
    }

    // Mostrar advertencia si está cerca del límite (solo en desarrollo)
    if (warning.level === 'critical' || warning.level === 'warning') {
      this.logWarn(warning.message)
    }

    // Hacer la request
    const response = await fetch(url, options)

    // Extraer y actualizar información de rate limit
    this.extractRateLimitFromHeaders(response.headers)

    // Verificar el nuevo estado (solo en desarrollo)
    const newWarning = this.checkRateLimit()
    if (newWarning.level === 'critical' || newWarning.level === 'blocked') {
      this.logError(newWarning.message)
    }

    return response
  }

  /**
   * Limpia la información de rate limit
   */
  clearRateLimit(): void {
    this.currentLimit = null
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('github_rate_limit')
    }
  }

  /**
   * Guarda en localStorage
   */
  private saveToLocalStorage(info: RateLimitInfo): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }

    try {
      localStorage.setItem('github_rate_limit', JSON.stringify(info))
    } catch (error) {
      this.logWarn('No se pudo guardar rate limit en localStorage:', error)
    }
  }

  /**
   * Carga de localStorage
   */
  private loadFromLocalStorage(): RateLimitInfo | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null
    }

    try {
      const stored = localStorage.getItem('github_rate_limit')
      if (!stored) return null

      const info = JSON.parse(stored) as RateLimitInfo

      // Recalcular timeUntilReset
      info.resetDate = new Date(info.reset * 1000)
      info.timeUntilReset = info.resetDate.getTime() - Date.now()

      return info
    } catch (error) {
      this.logWarn('Error al cargar rate limit de localStorage:', error)
      return null
    }
  }

  /**
   * Calcula cuánto tiempo esperar antes de la próxima request
   */
  getRecommendedDelay(): number {
    const info = this.getCurrentLimit()
    if (!info) return 0

    const warning = this.checkRateLimit()

    // Si está bloqueado, retornar el tiempo hasta el reset
    if (warning.shouldBlock) {
      return info.timeUntilReset
    }

    // Si está en crítico, añadir delay entre requests
    if (warning.level === 'critical') {
      return 2000 // 2 segundos
    }

    if (warning.level === 'warning') {
      return 1000 // 1 segundo
    }

    return 0 // No delay necesario
  }
}

// Exportar instancia singleton
export const rateLimitService = new RateLimitService()

// Exportar tipos
export type { RateLimitInfo, RateLimitWarning }
