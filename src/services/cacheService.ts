/**
 * Sistema de caché con almacenamiento en memoria y localStorage
 * Para reducir llamadas a la API de GitHub y evitar rate limits
 */

import { rateLimitService } from './rateLimitService'

interface CacheItem<T> {
  data: T
  timestamp: number
  expiresAt: number
}

interface CacheConfig {
  ttl?: number // Time to live en milisegundos (default: 5 minutos)
  useLocalStorage?: boolean // Usar localStorage para persistencia entre sesiones
  maxMemoryItems?: number // Máximo de items en memoria (default: 100)
}

class CacheService {
  private memoryCache: Map<string, CacheItem<any>> = new Map()
  private readonly DEFAULT_TTL = 5 * 60 * 1000 // 5 minutos
  private readonly MAX_MEMORY_ITEMS = 100
  private readonly STORAGE_PREFIX = 'github_cache_'
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
   * Error log (siempre se muestra)
   */
  private logError(message: string, error?: any): void {
    if (this.isDevelopment) {
      console.error(message, error)
    }
  }

  /**
   * Obtiene un valor del caché
   * Primero busca en memoria, luego en localStorage si está habilitado
   */
  get<T>(key: string, config?: CacheConfig): T | null {
    // Intentar obtener de memoria primero
    const memoryItem = this.memoryCache.get(key)
    if (memoryItem && this.isValid(memoryItem)) {
      return memoryItem.data as T
    }

    // Si no está en memoria, intentar localStorage
    if (config?.useLocalStorage !== false) {
      const storageItem = this.getFromLocalStorage<T>(key)
      if (storageItem && this.isValid(storageItem)) {
        // Guardar en memoria para acceso más rápido
        this.memoryCache.set(key, storageItem)
        return storageItem.data
      }
    }

    return null
  }

  /**
   * Guarda un valor en el caché
   */
  set<T>(key: string, data: T, config?: CacheConfig): void {
    const ttl = config?.ttl || this.DEFAULT_TTL
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl
    }

    // Guardar en memoria
    this.memoryCache.set(key, cacheItem)
    this.cleanupMemoryCache()

    // Guardar en localStorage si está habilitado
    if (config?.useLocalStorage !== false) {
      this.saveToLocalStorage(key, cacheItem)
    }
  }

  /**
   * Fetch con caché automático
   */
  async fetchWithCache<T>(
    url: string,
    fetchOptions?: RequestInit,
    cacheConfig?: CacheConfig
  ): Promise<T> {
    const cacheKey = this.generateCacheKey(url, fetchOptions)

    // Intentar obtener del caché
    const cachedData = this.get<T>(cacheKey, cacheConfig)
    if (cachedData !== null) {
      this.log(`📦 Cache HIT: ${url}`)
      return cachedData
    }

    this.log(`🌐 Cache MISS - Fetching: ${url}`)

    // Si no está en caché, hacer fetch con monitoreo de rate limit
    try {
      const response = await rateLimitService.fetchWithRateLimit(url, fetchOptions)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Guardar en caché
      this.set(cacheKey, data, cacheConfig)

      return data
    } catch (error) {
      this.logError('Error en fetchWithCache:', error)
      throw error
    }
  }

  /**
   * Fetch especial para imágenes (retorna Blob)
   */
  async fetchImageWithCache(
    url: string,
    fetchOptions?: RequestInit,
    cacheConfig?: CacheConfig
  ): Promise<string> {
    const cacheKey = this.generateCacheKey(url, fetchOptions)

    // Intentar obtener del caché
    const cachedUrl = this.get<string>(cacheKey, cacheConfig)
    if (cachedUrl !== null) {
      this.log(`📦 Cache HIT (imagen): ${url}`)
      return cachedUrl
    }

    this.log(`🌐 Cache MISS - Fetching imagen: ${url}`)

    // Si no está en caché, hacer fetch con monitoreo de rate limit
    try {
      const response = await rateLimitService.fetchWithRateLimit(url, fetchOptions)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const blob = await response.blob()
      const imageUrl = URL.createObjectURL(blob)

      // Guardar en caché (solo en memoria para imágenes)
      this.set(cacheKey, imageUrl, { ...cacheConfig, useLocalStorage: false })

      return imageUrl
    } catch (error) {
      this.logError('Error en fetchImageWithCache:', error)
      throw error
    }
  }

  /**
   * Fetch para texto plano
   */
  async fetchTextWithCache(
    url: string,
    fetchOptions?: RequestInit,
    cacheConfig?: CacheConfig
  ): Promise<string> {
    const cacheKey = this.generateCacheKey(url, fetchOptions)

    // Intentar obtener del caché
    const cachedText = this.get<string>(cacheKey, cacheConfig)
    if (cachedText !== null) {
      this.log(`📦 Cache HIT (texto): ${url}`)
      return cachedText
    }

    this.log(`🌐 Cache MISS - Fetching texto: ${url}`)

    // Si no está en caché, hacer fetch con monitoreo de rate limit
    try {
      const response = await rateLimitService.fetchWithRateLimit(url, fetchOptions)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const text = await response.text()

      // Guardar en caché
      this.set(cacheKey, text, cacheConfig)

      return text
    } catch (error) {
      this.logError('Error en fetchTextWithCache:', error)
      throw error
    }
  }

  /**
   * Limpia el caché completo
   */
  clear(): void {
    this.memoryCache.clear()
    this.clearLocalStorage()
    this.log('🧹 Caché limpiado completamente')
  }

  /**
   * Limpia items expirados
   */
  clearExpired(): void {
    // Limpiar memoria
    for (const [key, item] of this.memoryCache.entries()) {
      if (!this.isValid(item)) {
        this.memoryCache.delete(key)
      }
    }

    // Limpiar localStorage
    this.clearExpiredFromLocalStorage()

    this.log('🧹 Items expirados eliminados')
  }

  /**
   * Invalida una entrada específica del caché
   */
  invalidate(key: string): void {
    this.memoryCache.delete(key)
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.STORAGE_PREFIX + key)
    }
  }

  /**
   * Verifica si un item del caché es válido
   */
  private isValid(item: CacheItem<any>): boolean {
    return Date.now() < item.expiresAt
  }

  /**
   * Genera una clave de caché basada en URL y opciones
   */
  private generateCacheKey(url: string, options?: RequestInit): string {
    const optionsStr = options ? JSON.stringify(options) : ''
    return `${url}${optionsStr}`
  }

  /**
   * Obtiene un item de localStorage
   */
  private getFromLocalStorage<T>(key: string): CacheItem<T> | null {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null
    }

    try {
      const item = localStorage.getItem(this.STORAGE_PREFIX + key)
      if (!item) return null

      return JSON.parse(item) as CacheItem<T>
    } catch (error) {
      console.error('Error al leer de localStorage:', error)
      return null
    }
  }

  /**
   * Guarda un item en localStorage
   */
  private saveToLocalStorage<T>(key: string, item: CacheItem<T>): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }

    try {
      localStorage.setItem(this.STORAGE_PREFIX + key, JSON.stringify(item))
    } catch (error) {
      // Puede fallar si se excede el límite de almacenamiento
      console.warn('No se pudo guardar en localStorage:', error)
      this.clearOldestFromLocalStorage()
    }
  }

  /**
   * Limpia items del caché en memoria si excede el límite
   */
  private cleanupMemoryCache(): void {
    if (this.memoryCache.size > this.MAX_MEMORY_ITEMS) {
      // Eliminar el item más antiguo
      const oldestKey = this.memoryCache.keys().next().value
      if (oldestKey) {
        this.memoryCache.delete(oldestKey)
      }
    }
  }

  /**
   * Limpia todo el localStorage del caché
   */
  private clearLocalStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }

    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(this.STORAGE_PREFIX)) {
        keysToRemove.push(key)
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key))
  }

  /**
   * Limpia items expirados de localStorage
   */
  private clearExpiredFromLocalStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }

    const keysToRemove: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(this.STORAGE_PREFIX)) {
        try {
          const item = JSON.parse(localStorage.getItem(key) || '')
          if (!this.isValid(item)) {
            keysToRemove.push(key)
          }
        } catch (error) {
          // Si hay error al parsear, eliminar el item
          keysToRemove.push(key)
        }
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key))
  }

  /**
   * Elimina el item más antiguo de localStorage
   */
  private clearOldestFromLocalStorage(): void {
    if (typeof window === 'undefined' || !window.localStorage) {
      return
    }

    let oldestKey: string | null = null
    let oldestTimestamp = Date.now()

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(this.STORAGE_PREFIX)) {
        try {
          const item = JSON.parse(localStorage.getItem(key) || '')
          if (item.timestamp < oldestTimestamp) {
            oldestTimestamp = item.timestamp
            oldestKey = key
          }
        } catch (error) {
          // Ignorar errores
        }
      }
    }

    if (oldestKey) {
      localStorage.removeItem(oldestKey)
    }
  }

  /**
   * Obtiene estadísticas del caché
   */
  getStats() {
    return {
      memoryItems: this.memoryCache.size,
      localStorageItems: this.getLocalStorageItemCount()
    }
  }

  /**
   * Cuenta items en localStorage
   */
  private getLocalStorageItemCount(): number {
    if (typeof window === 'undefined' || !window.localStorage) {
      return 0
    }

    let count = 0
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(this.STORAGE_PREFIX)) {
        count++
      }
    }
    return count
  }
}

// Exportar una instancia singleton
export const cacheService = new CacheService()

// Exportar tipos para uso en otros archivos
export type { CacheConfig }
