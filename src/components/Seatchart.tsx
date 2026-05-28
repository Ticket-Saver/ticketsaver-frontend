import React, { forwardRef, useEffect, useMemo, useRef } from 'react'
import SeatchartJS, { Options, CartChangeEvent } from 'seatchart'

interface SeatchartProps {
  options: Options
  onSeatClick: (e: CartChangeEvent) => void
  /**
   * Cuando se provee, reemplaza el `cssClass` de cada `seatType` en
   * `options.map.seatTypes` por la entrada correspondiente del map. La
   * clave puede ser el `cssClass` original (ej. "Blue", "evip") o la key
   * del seatType. Permite intercambiar el theming legacy del index.css
   * por las clases CSS-module del v2 sin tocar la librería.
   */
  themeClassMap?: Record<string, string>
  /** Override del className del contenedor. */
  className?: string
}

function setForwardedRef<T>(ref: React.ForwardedRef<T>, value: T) {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref) {
    ref.current = value
  }
}

const applyThemeClassMap = (
  options: Options,
  themeClassMap?: Record<string, string>
): Options => {
  if (!themeClassMap) return options
  const seatTypes = (options.map as any)?.seatTypes as
    | Record<string, { cssClass?: string } & Record<string, unknown>>
    | undefined
  if (!seatTypes) return options
  const remapped: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(seatTypes)) {
    const original = value as { cssClass?: string } & Record<string, unknown>
    const lookup =
      (original.cssClass && themeClassMap[original.cssClass]) ||
      themeClassMap[key]
    remapped[key] = lookup ? { ...original, cssClass: lookup } : original
  }
  return {
    ...options,
    map: {
      ...(options.map as Record<string, unknown>),
      seatTypes: remapped
    }
  } as Options
}

const Seatchart = forwardRef<SeatchartJS | undefined, SeatchartProps>(
  ({ options, onSeatClick, themeClassMap, className }, ref) => {
    const seatchartRef = useRef<SeatchartJS>()
    const elementRef = useRef<HTMLDivElement>(null)

    const themedOptions = useMemo(
      () => applyThemeClassMap(options, themeClassMap),
      [options, themeClassMap]
    )

    useEffect(() => {
      if (elementRef.current && !seatchartRef.current) {
        seatchartRef.current = new SeatchartJS(elementRef.current, themedOptions)
        seatchartRef.current.addEventListener('cartchange', onSeatClick)
        setForwardedRef(ref, seatchartRef.current)

        return () => {
          seatchartRef.current = undefined
          setForwardedRef(ref, undefined)
        }
      }
    }, [themedOptions])

    return (
      <div
        className={
          className ??
          'relative overflow-x-auto w-full max-w-full h-[500px] w-[600px] x-sm:w-full x-sm:px-6 lg:mb-0'
        }
        ref={elementRef}
      />
    )
  }
)

Seatchart.displayName = 'Seatchart'
export default Seatchart
