import type { ReactNode } from 'react'
import Header from '../components/v2/Header'
import Footer from '../components/v2/Footer'
import CartDrawer from '../components/v2/cart/CartDrawer'
import BackgroundLayer from '../components/ui/BackgroundLayer'
import { cn } from '../types/ui'
import type { MeshPalette } from '../components/ui/MeshBackground'
import type { PillState } from '../types/ui'

interface LayoutV2Props {
  children: ReactNode
  /** Oculta el Footer (e.g., flujos de compra con CTA pegado). */
  hideFooter?: boolean
  /**
   * @deprecated MobileTabBar fue removida del Layout. La prop se mantiene
   * para no romper callers existentes — es no-op.
   */
  hideMobileTabBar?: boolean
  /** Oculta el Header (para pantallas que necesitan el viewport completo, p. ej. Queue). */
  hideHeader?: boolean
  /** Seed del mesh — varía por sección de la app para que no parezca repetido. */
  meshSeed?: number
  /** Paleta del mesh. Default 'violet' (dark). */
  meshPalette?: MeshPalette
  /** Pausa el mesh (útil cuando hay modales / drawers abiertos). */
  meshPaused?: boolean
  /** Cover blureado encima del mesh — para banners full-bleed en B3. */
  coverImage?: string
  /** Clase opcional para el <main>. */
  mainClassName?: string
  /** Override del eventLabel para CountdownPill (sólo para /_layout-check). */
  forcedSessionLabel?: string
  /** Mock del CountdownPill para verificación. */
  mockCountdown?: { state: PillState; label: string }
}

export default function LayoutV2({
  children,
  hideFooter = false,
  hideHeader = false,
  meshSeed = 0,
  meshPalette = 'charcoal',
  meshPaused = false,
  coverImage,
  mainClassName,
  forcedSessionLabel,
  mockCountdown
}: LayoutV2Props) {
  return (
    <div className='relative min-h-screen text-white font-body antialiased'>
      <BackgroundLayer
        seed={meshSeed}
        palette={meshPalette}
        paused={meshPaused}
        coverImage={coverImage}
      />

      {!hideHeader && (
        <Header forcedSessionLabel={forcedSessionLabel} mockCountdown={mockCountdown} />
      )}

      <main className={cn('relative', mainClassName)}>{children}</main>

      {!hideFooter && <Footer />}

      <CartDrawer />
    </div>
  )
}
