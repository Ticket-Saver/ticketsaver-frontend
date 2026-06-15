# TicketSaver v2 — Roadmap por fases

Hoja de ruta estructural de la migración del front v2 + conexión a HiEvents. Es la
**fuente de verdad** de las fases. Detalle visual del rediseño en `CLAUDE.md` (bloques 0–9);
plan de datos en la memoria del proyecto (`plan_conexion_hievents`).

> Identidad: el front v2 es el **sitio público** (compradores). **HiEvents** (repo aparte,
> `../hievents`) es el panel admin + backend de datos/pago/emisión. El núcleo
> mapas/asientos/emisión/QR es **intocable**: se adapta/replica, nunca se rediseña.

## Estado de las fases

| Fase | Qué es | Estado |
|---|---|---|
| **1 — Fundación** | Sistema de diseño + conexión a HiEvents (datos reales, adapter, contexts) | ✅ Hecho |
| **2 — Catálogo** | Home + listado de eventos + detalle de evento | ✅ Hecho |
| **3 — Mapa + asientos** | SVG real de HiEvents, zoom/pan, contigüidad, anti‑colisión (hold + realtime) | ✅ Hecho y validado |
| **4 — Pago** | Checkout HiEvents → Stripe (cuenta única TicketSaver, sin Connect) → emisión → QR | ✅ Hecho y probado |
| **5 — Post‑compra** | Mis Tickets con datos reales + ticketera/QR público + dashboard | ✅ Hecho y verificado |
| **6 — Admin / HiEvents** | Campos del evento (category, featured, multifecha) + panel de Home (admin) + roles/precio + multifecha | 🔵 En curso |
| **7 — Extras** | Sala de espera (queue) real + Apple/Google Wallet passes + login custom | ⏳ Pendiente |
| *Addon* | Reventa de tickets | ⛔ Fuera de alcance (se cotiza aparte) |

## Notas de alcance
- **NFT / Web3: ELIMINADO del proyecto** (decisión del cliente, 2026‑06‑15). No es Fase 7 ni nada — se quita. Apple/Google **Wallet passes** sí siguen (no son Web3). Ver memoria `nft_web3_obsoleto`.
- **Auth0 → login custom**: hoy se usa Auth0; se reemplazará por un login custom (Fase 7). Marcado en el código donde aplica (ver `useUserTickets`).
- **Light mode**: arquitectura preparada (custom properties), se introduce en fase posterior.

## Detalle por fase
- **Fase 6** → `docs/FASE-6-analisis-y-roadmap.md` (análisis exhaustivo + sub‑hitos).
