import { useCallback, useEffect, useRef, useState } from 'react'

export interface ZoomPanState {
  scale: number
  tx: number
  ty: number
}

export interface UseZoomPanOptions {
  minScale?: number
  maxScale?: number
  initialScale?: number
  /** Incremento por click en zoomIn/zoomOut. Default 0.2. */
  step?: number
  /**
   * Si es true, la rueda hace pan vertical (default browser). Por defecto
   * la rueda hace zoom (consistente con apps de mapas).
   */
  wheelPans?: boolean
}

export interface UseZoomPanResult {
  /** Bind a un `<div>` que contiene el contenido transformable. */
  containerRef: React.MutableRefObject<HTMLDivElement | null>
  state: ZoomPanState
  reset: () => void
  zoomIn: () => void
  zoomOut: () => void
  setScale: (scale: number, pivot?: { x: number; y: number }) => void
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

/**
 * Hook que provee zoom (wheel + pinch) y pan (drag mouse + touch) sobre
 * un contenedor. El consumer aplica el transform a la capa interna.
 *
 * El pivot del zoom es el cursor (wheel) o el midpoint de los dos dedos
 * (pinch), de modo que el punto bajo el cursor / midpoint no se mueve.
 */
export function useZoomPan(opts: UseZoomPanOptions = {}): UseZoomPanResult {
  const { minScale = 0.5, maxScale = 4, initialScale = 1, step = 0.2, wheelPans = false } = opts

  const containerRef = useRef<HTMLDivElement | null>(null)
  const [state, setState] = useState<ZoomPanState>({
    scale: initialScale,
    tx: 0,
    ty: 0
  })
  const stateRef = useRef(state)
  stateRef.current = state

  const panRef = useRef<{
    startX: number
    startY: number
    startTx: number
    startTy: number
    touchId?: number
  } | null>(null)

  const pinchRef = useRef<{
    initialDist: number
    initialScale: number
    initialTx: number
    initialTy: number
    pivotX: number
    pivotY: number
  } | null>(null)

  const setStateClamped = useCallback(
    (next: Partial<ZoomPanState>) => {
      setState((s) => ({
        scale: next.scale !== undefined ? clamp(next.scale, minScale, maxScale) : s.scale,
        tx: next.tx !== undefined ? next.tx : s.tx,
        ty: next.ty !== undefined ? next.ty : s.ty
      }))
    },
    [minScale, maxScale]
  )

  const setScale = useCallback(
    (scale: number, pivot?: { x: number; y: number }) => {
      const el = containerRef.current
      const s = stateRef.current
      const newScale = clamp(scale, minScale, maxScale)
      if (!el || !pivot) {
        setStateClamped({ scale: newScale })
        return
      }
      const rect = el.getBoundingClientRect()
      const cx = pivot.x - rect.left - rect.width / 2
      const cy = pivot.y - rect.top - rect.height / 2
      const factor = newScale / s.scale
      const newTx = (s.tx - cx) * factor + cx
      const newTy = (s.ty - cy) * factor + cy
      setState({ scale: newScale, tx: newTx, ty: newTy })
    },
    [minScale, maxScale, setStateClamped]
  )

  const reset = useCallback(() => setState({ scale: initialScale, tx: 0, ty: 0 }), [initialScale])

  const zoomIn = useCallback(() => {
    const s = stateRef.current
    setStateClamped({ scale: s.scale + step })
  }, [step, setStateClamped])

  const zoomOut = useCallback(() => {
    const s = stateRef.current
    setStateClamped({ scale: s.scale - step })
  }, [step, setStateClamped])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const zoomAt = (clientX: number, clientY: number, factor: number) => {
      const rect = el.getBoundingClientRect()
      const cx = clientX - rect.left - rect.width / 2
      const cy = clientY - rect.top - rect.height / 2
      const s = stateRef.current
      const newScale = clamp(s.scale * factor, minScale, maxScale)
      const realFactor = newScale / s.scale
      const newTx = (s.tx - cx) * realFactor + cx
      const newTy = (s.ty - cy) * realFactor + cy
      setState({ scale: newScale, tx: newTx, ty: newTy })
    }

    const onWheel = (e: WheelEvent) => {
      if (wheelPans) {
        e.preventDefault()
        const s = stateRef.current
        setState({ ...s, tx: s.tx - e.deltaX, ty: s.ty - e.deltaY })
        return
      }
      e.preventDefault()
      // deltaY < 0 → zoom in (scroll up); > 0 → zoom out
      const factor = e.deltaY < 0 ? 1.12 : 0.9
      zoomAt(e.clientX, e.clientY, factor)
    }

    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return
      const target = e.target as HTMLElement | null
      // No iniciamos pan si el click es en un elemento interactivo
      if (target?.closest('button, a, input, select, [data-no-pan]')) return
      panRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startTx: stateRef.current.tx,
        startTy: stateRef.current.ty
      }
      el.style.cursor = 'grabbing'
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!panRef.current) return
      e.preventDefault()
      const p = panRef.current
      setState((s) => ({
        ...s,
        tx: p.startTx + (e.clientX - p.startX),
        ty: p.startTy + (e.clientY - p.startY)
      }))
    }

    const onMouseUp = () => {
      panRef.current = null
      el.style.cursor = ''
    }

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const t = e.touches[0]
        panRef.current = {
          startX: t.clientX,
          startY: t.clientY,
          startTx: stateRef.current.tx,
          startTy: stateRef.current.ty,
          touchId: t.identifier
        }
        pinchRef.current = null
      } else if (e.touches.length === 2) {
        const [t1, t2] = [e.touches[0], e.touches[1]]
        const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY)
        pinchRef.current = {
          initialDist: dist,
          initialScale: stateRef.current.scale,
          initialTx: stateRef.current.tx,
          initialTy: stateRef.current.ty,
          pivotX: (t1.clientX + t2.clientX) / 2,
          pivotY: (t1.clientY + t2.clientY) / 2
        }
        panRef.current = null
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && pinchRef.current) {
        e.preventDefault()
        const [t1, t2] = [e.touches[0], e.touches[1]]
        const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY)
        const p = pinchRef.current
        const ratio = dist / p.initialDist
        const newScale = clamp(p.initialScale * ratio, minScale, maxScale)
        const factor = newScale / p.initialScale
        const rect = el.getBoundingClientRect()
        const cx = p.pivotX - rect.left - rect.width / 2
        const cy = p.pivotY - rect.top - rect.height / 2
        const newTx = (p.initialTx - cx) * factor + cx
        const newTy = (p.initialTy - cy) * factor + cy
        setState({ scale: newScale, tx: newTx, ty: newTy })
      } else if (e.touches.length === 1 && panRef.current) {
        const t = e.touches[0]
        if (t.identifier !== panRef.current.touchId) return
        e.preventDefault()
        const p = panRef.current
        setState((s) => ({
          ...s,
          tx: p.startTx + (t.clientX - p.startX),
          ty: p.startTy + (t.clientY - p.startY)
        }))
      }
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) pinchRef.current = null
      if (e.touches.length === 0) panRef.current = null
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    el.addEventListener('touchstart', onTouchStart, { passive: false })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd)
    el.addEventListener('touchcancel', onTouchEnd)

    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [minScale, maxScale, wheelPans])

  return { containerRef, state, reset, zoomIn, zoomOut, setScale }
}
