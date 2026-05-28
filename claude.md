 Plan de Migración — TicketSaver v2.0 (Shader Wallpapers Redesign)

 Context

 El proyecto TicketSaver tiene un rediseño completo desarrollado por "Claude Diseño" en la carpeta Shader wallpapers/. El rediseño cubre las 17 pantallas de la plataforma con un nuevo sistema visual (paleta púrpura, glassmorphism, mesh gradient WebGL animado, tipografía Space Grotesk + Inter, covers SVG
 procedurales) y agrega 13 mejoras funcionales solicitadas por el cliente más funcionalidades adicionales (queue, multi-fecha por artista, NFT tickets, Apple Wallet).

 Problema actual: el proyecto vive en Tailwind + DaisyUI con tema synthwave hardcoded, layouts mínimos, varias páginas son stubs (settings, profile, dashboard tabs), no hay drawer de carrito, banner full-bleed, validación de contigüidad, zoom en mapa de asientos, ni queue.

 Objetivo: migrar progresivamente la app al nuevo sistema visual y funcional, manteniendo en producción durante todo el proceso. Cada bloque se ejecuta en una sesión independiente para preservar contexto y calidad.

 Restricción del usuario: "no quiero que lo hagamos todo junto ya que si no perderás contexto y el resultado no será el óptimo". Cada bloque debe ser autónomo, con fronteras claras de entrada/salida.

 ---
 Decisiones tomadas (validadas con el usuario)

 1. Estilos: Híbrido Tailwind + CSS Modules. Tailwind para layout y utilidades; CSS Modules en src/styles/effects/ para glassmorphism, gradients complejos y animaciones.
 2. Tema: Solo dark inicialmente. Toda la arquitectura usa custom properties que permiten introducir light en una fase posterior sin repintar componentes.
 3. Prioridad: Flujo de compra primero tras la fundación (Home → Detalle → Mapa+Asientos → Carrito+Checkout → Ticket).
 4. Reventa de tickets: EXCLUIDA del alcance actual. Se planifica/cotiza por separado.

 ---
 Estrategia transversal

 Coexistencia v1/v2 (in-place)

 Las rutas se reemplazan in-place a medida que avanzan los bloques. Internamente, los componentes nuevos viven en src/pages/v2/, src/components/v2/ y src/layouts/LayoutV2.tsx. Cuando una ruta se migra, su <Route> apunta al nuevo componente. No hay /v2/ en la URL para el usuario final.

 DaisyUI: se elimina al final

 Mantenemos daisyui instalado hasta el Bloque 9. Esto evita romper componentes legacy (Header actual, dashboard sidebar, dropdowns) mientras se migra. El cleanup completo (eliminar dependencia, data-theme='synthwave', layouts y páginas legacy) se hace como parte del Bloque 9.

 Tokens de diseño (Bloque 0)

 Se extienden en tailwind.config.js:
 - colors.brand: ink #0E0820, hi #D4A8F0, mid #B57BE8, lo #8A5BC7
 - colors.accent: pink #FF5E9E, mint #7DFFB0, coral #FFB1C8
 - colors.surface.glass: rgba con /5, /8, /12, /18
 - fontFamily.display: Space Grotesk; fontFamily.sans: Inter (sobrescribe Montserrat actual)
 - borderRadius, boxShadow, backdropBlur, animation, keyframes con nombres semánticos

 CSS Modules (Bloque 0)

 - src/styles/effects/glass.module.css
 - src/styles/effects/gradients.module.css
 - src/styles/effects/pill.module.css
 - src/styles/effects/seatmap.module.css (recibe clases de asientos hoy en index.css en el Bloque 4)
 - src/styles/effects/bottomsheet.module.css
 - src/styles/effects/queue.module.css

 UI primitives (Bloque 0)

 Carpeta src/components/ui/: Button, Pill, GlassCard, Drawer, BottomSheet, Sidebar, Avatar, IconButton, Chip, Modal, Toast, MeshBackground, EventCover, CountdownPill, BackgroundLayer, SectionTitle.

 Adapter de datos

 src/services/eventAdapter.ts transforma los Event del EventsContext (schema GitHub) a una interfaz UIEvent que añade los campos del rediseño:
 - cover ← hash determinista del event_label → paleta (nebula, inferno, etc.)
 - priceFrom ← Math.min sobre zonePriceList.prices[].priceFinal/100
 - vibe ← primera frase de descripción
 - tags, availability, hero ← computados con heurísticas / flags
 Desacopla la UI nueva del schema actual de GitHub.

 WebGL Shader

 ts-mesh-dark.js se porta a src/lib/mesh/tsMesh.ts (clase TS tipada) + src/components/ui/MeshBackground.tsx (componente React). Pausa fuera de viewport (IntersectionObserver), respeta prefers-reduced-motion, fallback a gradient CSS si no hay WebGL.

 Reutilización de lógica existente (NO se reescribe)

 - src/hooks/useSessionTimer.ts — timer 10 min
 - src/services/sessionCleanupService.ts — lock/release de asientos
 - src/services/cacheService.ts — caché dual memoria+localStorage
 - src/services/fallbackDataService.ts — datos offline
 - src/components/Seatchart.tsx — wrapper Seatchart JS (recibe prop nueva themeClassMap en B4)
 - src/components/CheckoutStripe.tsx — Stripe Embedded (solo reskin del wrapper en B5)
 - src/components/mintWagmi/* — Wagmi/Web3 (solo reskin de botones en B8)
 - EventsProvider, VenuesProvider — providers de datos

 ---
 Bloques de migración

 Bloque 0 — Fundación del Sistema de Diseño · M (1-2 sesiones)

 Objetivo: Establecer tokens Tailwind, fonts, CSS modules base, port del shader WebGL y UI primitives. Capa transversal.

 CREAR:
 - src/styles/tokens.css
 - src/styles/effects/glass.module.css
 - src/styles/effects/gradients.module.css
 - src/styles/effects/pill.module.css
 - src/lib/mesh/tsMesh.ts (port TS del shader)
 - src/lib/covers/palettes.ts (paletas nebula, inferno, etc.)
 - src/lib/covers/coverHash.ts (label → paleta determinista)
 - src/components/ui/MeshBackground.tsx
 - src/components/ui/{Button,Pill,GlassCard,Chip,IconButton}.tsx
 - src/components/ui/index.ts
 - src/types/ui.ts

 MODIFICAR:
 - tailwind.config.js — añadir tokens. NO retirar DaisyUI.
 - src/index.css — @import Space Grotesk + Inter; mantener Montserrat. Importar tokens.css. NO mover estilos de asientos aún.
 - index.html — preconnect fonts.

 Verificación: ruta temporal /_design-check que renderiza cada primitive + MeshBackground. Comprobar WebGL fluido, fallback reduced-motion, paleta púrpura, console limpia.

 ---
 Bloque 1 — Layout Global v2 + Pill Timer · M (1-2 sesiones)

 Objetivo: Layout v2 con Header/Footer nuevos, MeshBackground global, CountdownPill visible cuando hay sesión activa.

 Funcionalidades: i (Footer 4 cols + newsletter + badges), k (background mesh global), l (pill 3 estados).

 CREAR:
 - src/layouts/LayoutV2.tsx
 - src/components/v2/Header.tsx
 - src/components/v2/Footer.tsx
 - src/components/v2/MobileTabBar.tsx
 - src/components/ui/CountdownPill.tsx (conecta useSessionTimer)
 - src/components/ui/BackgroundLayer.tsx (mesh + cover blureado opcional)
 - src/router/cartContext.tsx (provider esqueleto, lógica completa en B5)

 MODIFICAR:
 - src/router/Router.tsx — añadir <CartProvider> debajo de los providers existentes.

 Verificación: ruta temporal /_layout-check con LayoutV2. Header sticky glass, Footer 4 cols, MeshBackground animado, MobileTabBar <768px, CountdownPill visible cuando se simula sesión.

 ---
 Bloque 2 — Home + Listado de Eventos · L (2 sesiones)

 Objetivo: Migrar / y /events. Implementar eventAdapter y EventCover procedural.

 Referencia visual: Shader wallpapers/ts-home.jsx (336 líneas), ts-cover.jsx, ts-desktop-shop.jsx (parte Home).

 CREAR:
 - src/services/eventAdapter.ts
 - src/types/uiEvent.ts
 - src/hooks/useUIEvents.ts (wrapper de useEvents + adapter)
 - src/components/v2/EventCardV2.tsx
 - src/components/v2/EventCover.tsx (SVG procedural)
 - src/components/v2/EventCarousel.tsx
 - src/components/v2/CategoryChips.tsx
 - src/components/v2/HeroEvent.tsx
 - src/pages/v2/HomeV2.tsx
 - src/pages/v2/EventsV2.tsx

 MODIFICAR:
 - src/router/Router.tsx — / y /events apuntan a V2 envueltos en LayoutV2.

 Verificación: / muestra greeting + hero + categorías + carruseles con covers procedurales. /events grid filtrable. Click navega a /event/... (sigue legacy hasta B3). Mismo evento GitHub muestra cover consistente entre cargas.

 ---
 Bloque 3 — Detalle de Evento + Multi-fecha · M (1-2 sesiones)

 Objetivo: Migrar /event/:name/.... Banner full-bleed, selector multi-fecha, galería, mapa Google, sticky CTA.

 Funcionalidades: b (banner full-bleed), multi-fecha por artista.

 Referencia visual: Shader wallpapers/ts-event-detail.jsx (463 líneas).

 CREAR:
 - src/pages/v2/EventDetailV2.tsx
 - src/components/v2/eventDetail/{Banner,MultiDateSelector,ArtistRow,TagList,Gallery,VenueMap,StickyCTA}.tsx
 - src/services/multiDateAdapter.ts (agrupa eventos por artista)

 MODIFICAR:
 - src/router/Router.tsx — /event/:name/:venue/:date/:label/:delete? → EventDetailV2.
 - src/services/eventAdapter.ts — getDatesForArtist(artistName).

 Verificación: banner con cover blureado + gradient inferior, multi-fecha cambia precio/venue/status, deeplink actualizado, sticky CTA con priceFrom correcto. Si una sola fecha, selector oculto.

 ---
 Bloque 4 — Venue Picker + Seat Picker · L (2 sesiones)

 Objetivo: Migrar /sale/... a flujo de dos pasos. Zoom/pan, validación de contigüidad, refuerzo visual anti-colisión.

 Funcionalidades: c (contigüidad), d (zoom pinch/wheel + pan), g (título mapa + jerarquía), m (anti-colisión visual).

 Referencia visual: Shader wallpapers/ts-purchase-flow.jsx (1071 líneas — VenuePickerStep + SeatGridStep).

 CREAR:
 - src/pages/v2/SaleV2.tsx
 - src/components/v2/sale/{VenuePicker,SeatGrid,SeatLegend,StepHeader,ZoomPanContainer}.tsx
 - src/hooks/useSeatContiguity.ts
 - src/hooks/useZoomPan.ts
 - src/services/seatRaceAudit.ts (logs cliente para colisiones lockSeat)
 - src/styles/effects/seatmap.module.css

 MODIFICAR:
 - src/router/Router.tsx — /sale/... → SaleV2.
 - src/index.css — eliminar clases de asientos (movidas a CSS module).
 - src/components/Seatchart.tsx — añadir prop themeClassMap?: Record<string, string>.

 Sub-división si es grande: 4a (VenuePicker + zoom/pan), 4b (SeatGrid + contigüidad + races).

 Verificación: pinch/wheel zoom, drag pan, click sección → grid, máximo 10 asientos, warning si dejan aislado, lockSeat backend funciona, timer arranca al primer asiento, dos pestañas → toast (no alert()).

 ---
 Bloque 5 — Carrito Drawer + Bottom Sheet + Sidebar + Checkout · L (2+ sesiones)

 Objetivo: Carrito flotante con stepper + resumen vivo + timer integrado. Bottom sheet mobile, sidebar desktop, checkout reskinned.

 Funcionalidades: a (drawer flotante), e (bottom sheet mobile), f (sidebar desktop), m (anti-colisión UI completa).

 Referencia visual: Shader wallpapers/ts-screens.jsx (CartDrawer + QuickViewSheet).

 CREAR:
 - src/components/v2/cart/{CartDrawer,CartTrigger,SummaryBottomSheet,SummarySidebar,CartItem}.tsx
 - src/components/v2/checkout/CheckoutV2.tsx
 - src/components/ui/{Drawer,BottomSheet,Toast}.tsx
 - src/styles/effects/bottomsheet.module.css

 MODIFICAR:
 - src/router/cartContext.tsx — implementar lógica completa (add/remove/clear/total + integración timer).
 - src/pages/v2/SaleV2.tsx — montar BottomSheet (mobile) y Sidebar (desktop).
 - src/pages/checkout/index.tsx — apuntar a CheckoutV2.
 - src/components/CheckoutStripe.tsx — leer del cartContext además del localStorage.
 - src/layouts/LayoutV2.tsx — montar <CartDrawer/> como portal.

 Sub-división: 5a (Drawer + Sidebar), 5b (BottomSheet + Checkout reskin).

 Verificación: 3 asientos → contador trigger, drawer con items/total/timer, stepper funciona, BottomSheet swipe up, Sidebar >1024px, "Proceed to checkout" → Stripe funcional, expiración timer → toast + clear + redirect.

 ---
 Bloque 6 — Ticket Recibido + Mis Tickets + NFT + Apple Wallet · L (2 sesiones)

 Objetivo: Pantalla post-compra con ticket animado, NFT preview, Apple Wallet, share imagen. Mis Tickets con 3 tabs.

 Funcionalidades: Ticket coleccionable NFT, Apple Wallet (.pkpass), share imagen, dashboard grid unificado.

 Referencia visual: Shader wallpapers/ts-purchase-flow.jsx (TicketReceived + MyTickets), ts-desktop-info.jsx (DesktopMyTickets).

 CREAR:
 - src/pages/v2/TicketReceivedV2.tsx
 - src/components/v2/ticket/{TicketCard,NFTPreview,AppleWalletButton,ShareSheet,TicketGrid}.tsx
 - src/pages/v2/MyTicketsV2.tsx
 - src/pages/v2/dashboardTabs/{UpcomingV2,PastV2,CollectiblesV2}.tsx
 - src/services/walletPassService.ts (detrás de flag APPLE_WALLET_ENABLED)
 - src/services/ticketShareService.ts (canvas → PNG → Web Share API)

 MODIFICAR:
 - src/router/Router.tsx — /return → TicketReceivedV2; /dashboard/tickets/* → V2 + LayoutV2.
 - src/pages/ReturnPage.tsx — proxy a TicketReceivedV2.

 Sub-división: 6a (Ticket Recibido + NFT/Wallet), 6b (Mis Tickets 3 tabs).

 Verificación: post-checkout → animación ticket + QR escaneable, Apple Wallet (en iOS abre Wallet, en otros fallback), share PNG funcional. Grid de tickets propios filtrable upcoming/past/collectibles.

 ---
 Bloque 7 — Sala de Espera Virtual (Queue) · M (1-2 sesiones)

 Objetivo: Pantalla interstitial entre detalle y sale para eventos high-demand. Estados far/close/next/released, polling Supabase, tips rotator.

 Referencia visual: Shader wallpapers/ts-queue.jsx (282 líneas).

 CREAR:
 - src/pages/v2/QueueV2.tsx
 - src/components/v2/queue/{QueueStream,QueueProgress,TipRotator,QueueState}.tsx
 - src/services/queueService.ts (cliente Supabase + polling con backoff)
 - src/hooks/useQueuePosition.ts
 - src/styles/effects/queue.module.css

 MODIFICAR:
 - src/router/Router.tsx — ruta /queue/:label con LayoutV2.
 - src/components/supabaseClient.ts — activar cliente (hoy es placeholder).
 - src/components/v2/eventDetail/StickyCTA.tsx (de B3) — si event.requiresQueue, redirige a /queue/:label.

 Verificación: estado far con posición simulada, polling avanza, estado next pulse intenso, released redirige automáticamente a /sale/..., tips rotan cada 3.2s.

 ---
 Bloque 8 — Web3 Wallet + Perfil + Configuración + Ayuda · M (1-2 sesiones)

 Objetivo: Migrar las páginas de /dashboard/* restantes.

 CREAR:
 - src/pages/v2/{Web3V2,MyProfileV2,MySettingsV2,YouNeedHelpV2}.tsx
 - src/components/v2/profile/ProfileHeader.tsx
 - src/components/v2/web3/{WalletConnect,NFTGrid}.tsx
 - src/components/v2/settings/SettingsList.tsx
 - src/components/v2/help/HelpCategories.tsx

 MODIFICAR:
 - src/router/Router.tsx — /dashboard/* con LayoutV2 en vez de LayoutHeader.
 - src/components/dashboard/{Sidebar,Tabs}.tsx — reskinear.
 - src/components/ConnectButton.tsx, src/components/mintWagmi/* — reskin con <Button variant="glass">.

 Verificación: /dashboard/web3 connect Wagmi + grid NFTs, perfil edita datos Auth0, settings con opciones placeholder, help con categorías. Todas las pantallas en dark + mesh.

 ---
 Bloque 9 — Páginas Institucionales + Cleanup DaisyUI · L (2+ sesiones)

 Objetivo: Migrar About, Contact, FAQs, Terms, Privacy, PCI. Eliminar DaisyUI completamente.

 Funcionalidades: h (formulario contacto operativo), j (About completa con stats/principios/equipo), FAQs con ToC + mini-encuesta.

 Referencia visual: Shader wallpapers/ts-info-pages.jsx, ts-legal-pages.jsx, ts-desktop-info.jsx.

 CREAR:
 - src/pages/v2/{AboutV2,ContactV2,FaqsV2,TermsV2,PrivacyV2,PCIV2}.tsx
 - src/components/v2/info/{TeamGrid,PrinciplesList,StatsRow,ContactForm}.tsx
 - src/components/v2/legal/{TableOfContents,LegalSection,MiniSurvey}.tsx
 - src/services/{contactFormService,feedbackService}.ts
 - netlify/functions/contact.ts (si no existe en netlify/)

 MODIFICAR (cleanup):
 - src/router/Router.tsx — /about, /footer/contact, /faqs, /footer/terms&conditions, /footer/PrivayPolicy, /footer/PCICompliance → V2 + LayoutV2.
 - tailwind.config.js — eliminar daisyui de plugins, eliminar daisyui.themes.
 - package.json — quitar daisyui dependency (y bootstrap-icons si no se usa).
 - src/index.css — cleanup final.

 ELIMINAR (cleanup final):
 - src/layouts/LayoutHeaderFooter.tsx, LayoutHeader.tsx
 - src/components/{Header,Footer,Hero,FeaturedEvents,CoverCarousel,EventCard,EventList}.tsx
 - src/pages/{HomeUnlogin,EventPage,EventSalePage,SalePage,TicketEventSale,TicketEventSaleNoSeats,AboutPage,Contact,FaqsPage,Terms&conditionsPage,PrivayPolicyPage,PciCompliancePage,MyProfile,MySettings,MyTickets,Web3,YouNeedHelp}.tsx

 Verificación: todas las rutas funcionan con LayoutV2, yarn build sin DaisyUI más pequeño, búsqueda global data-theme='synthwave' → 0 resultados, ContactForm envía email real, FAQs filtra + encuesta, Terms ToC scrollspy funcional, Lighthouse AA contrast.

 ---
 Orden óptimo y alternativas

 Orden recomendado: 0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9.

 MVP visible más rápido (alternativa): 0 → 1 → 2 → 5 (skeleton drawer con mock) → 3 → 4 → resto. Permite mostrar Home + carrito flotante temprano.

 Si About/Contact son críticos por marketing: insertar 9a — About + Contact antes del B7. El cleanup DaisyUI se queda al final.

 ---
 Riesgos y mitigaciones

 ┌───────────────────────────────────────────────────────────────────────┬───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
 │                                Riesgo                                 │                                                    Mitigación                                                     │
 ├───────────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ Coexistencia DaisyUI + Tailwind colisión de clases (btn, card, badge) │ Primitives UI con clases namespaceadas (tsv-btn). Header v2 no usa clases DaisyUI.                                │
 ├───────────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ Seatchart JS DOM-imperativo, poco amigable a React                    │ Abstracción ya existe en src/components/Seatchart.tsx. B4 inyecta themeClassMap, no toca lógica core.             │
 ├───────────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ WebGL drena batería mobile                                            │ MeshBackground pausa con IntersectionObserver, respeta prefers-reduced-motion, escucha visibilitychange.          │
 ├───────────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ Adapter rompe si cambia schema GitHub                                 │ eventAdapter con tipado estricto + fallback a events.json local.                                                  │
 ├───────────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ Apple Wallet requiere certificado Apple                               │ Botón detrás de feature flag APPLE_WALLET_ENABLED. En off muestra "coming soon".                                  │
 ├───────────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ Race conditions lockSeat                                              │ seatRaceAudit.ts re-fetcha estado y muestra Toast en cada error 409.                                              │
 ├───────────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ cartContext diverge del localStorage                                  │ Single source of truth: cartContext hidrata del localStorage al montar, escribe en cada acción.                   │
 ├───────────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ Light mode futuro — hardcodear dark                                   │ CSS Modules usan custom properties (var(--brand-ink)). Introducir light = añadir tokens, no repintar componentes. │
 ├───────────────────────────────────────────────────────────────────────┼───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
 │ Rutas mixed (legacy + v2) confunden                                   │ Reemplazo in-place: el usuario no ve /v1/.                                                                        │
 └───────────────────────────────────────────────────────────────────────┴───────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

 ---
 Archivos críticos transversales

 - tailwind.config.js (B0, B9)
 - src/index.css (B0, B4, B9)
 - src/router/Router.tsx (TODOS los bloques)
 - src/layouts/LayoutHeaderFooter.tsx (B9 eliminar)
 - src/services/eventAdapter.ts (B2 crear, B3+ consumir)
 - src/router/cartContext.tsx (B1 esqueleto, B5 completo)
 - Shader wallpapers/ts-mesh-dark.js (B0 port)
 - Shader wallpapers/ts-events.js (referencia, no portar — usar GitHub data)

 ---
 Cómo arrancar cada bloque en una sesión nueva

 Cuando empieces una sesión para un bloque específico:

 1. Abre este archivo y lee la sección del bloque.
 2. Lee los archivos del rediseño referenciados (Shader wallpapers/ts-*.jsx) para entender el layout/composición.
 3. Lee los archivos src/ que vas a modificar para entender el estado actual.
 4. Confirma con el usuario si hay sub-división (ej. B4 → 4a/4b) o si va completo.
 5. Ejecuta el bloque. Verifica con los criterios de la sección "Verificación".
 6. Marca el bloque como completado en este archivo (checkbox al lado del nombre).

 Tracker de progreso

 - [x] Bloque 0 — Fundación Design System
 - [x] Bloque 1 — Layout Global v2 + Pill Timer
 - [x] Bloque 2 — Home + Listado de Eventos
 - [x] Bloque 3 — Detalle Evento + Multi-fecha
 - [x] Bloque 4 — Venue + Seat Picker (4a [x] · 4b [x])
 - [x] Bloque 5 — Carrito + BottomSheet + Sidebar + Checkout (5a [x] · 5b [x])
 - [x] Bloque 6 — Ticket Recibido + Mis Tickets (6a [x] · 6b [x])
 - [x] Bloque 7 — Queue
 - [x] Bloque 8 — Web3 + Perfil + Settings + Help
 - [x] Bloque 9 — Institucionales + Cleanup DaisyUI (9a institucionales [x] · cleanup DaisyUI [x])

 Total estimado: 15-21 sesiones independientes.

 ---
 Fuera del alcance (cotizar/planear aparte)

 - Reventa de tickets (sección 2 del brief del cliente): listing desde Mis Tickets, tab Reventas en evento, comisión configurable, panel admin, transferencia QR, validaciones anti-fraude. Requiere cambios de backend + Stripe flow + panel administrativo.
 - Light mode: arquitectura preparada (custom properties), pero se introduce en fase posterior.
 - Payout automático al vendedor / Stripe Connect / KYC / subastas: explícitamente fuera del alcance del cliente.