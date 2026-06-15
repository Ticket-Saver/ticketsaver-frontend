# Fase 6 — Admin / HiEvents: análisis exhaustivo + roadmap

> Fase que toca **HiEvents** (repo `../hievents`, back + front del admin). Todo se hace
> **aditivo y reversible**, sin tocar emisión/QR/mapas/asientos (núcleo intocable).
> Lo construimos nosotros directo en `hievents`; se le comenta al colega después; dejar todo documentado.
> Verificado contra el repo HiEvents el 2026‑06‑15.

## Los 4 frentes
1. **Campos del evento** — poder cargar TODOS los datos que el v2 necesita (hoy varios se infieren por heurística).
2. **Panel de Home/curaduría** — apartado **nuevo, exclusivo del perfil ADMIN**, a nivel cuenta, para editar carruseles/listados/destacados del sitio público. HiEvents no tiene nada de esto.
3. **Roles** — Admin vs Organizador. (Ver hallazgo: gran parte YA existe.)
4. **Multi‑fecha** por artista.

---

## Decisiones cerradas (2026‑06‑15)
1. **`category`** = columna dedicada en HiEvents (mejor para filtrar/ordenar). **`featured`** lo maneja el panel de Home (no flag por evento).
2. **Panel de Home** = apartado totalmente nuevo, **solo perfil ADMIN**, a nivel cuenta.
3. **Bruto/neto en reportes ya está hecho — NO duplicar** (ver abajo).
4. Construimos todo nosotros en `hievents` (back+front), sin esperar al colega; documentar todo.

---

## ⚠️ Lo que YA EXISTE en HiEvents (NO reconstruir)

### Roles
2 roles: **ADMIN** y **ORGANIZER** (tabla `account_users.role`). Back: `IsAuthorizedService::validateUserRole()` / `minimumAllowedRole()`. Front admin: `useIsCurrentUserAdmin()`. Hoy el rol en el front **solo** se usa para mostrar tabs de cuenta (Users, Payment), nunca cerca del precio.

### Bruto/neto en REPORTES (hecho, back + front)
- **Reporte diario** (`SendDailySalesReportsCommand` + `DailySalesReportMail`): a organizadores **"with base prices only"** = NETO. Destinatarios: `event.daily_sales_report_emails`.
- **Reporte custom** (`SendCustomSalesReportAction` + `CustomSalesReportMail`; front `useSendCustomSalesReport`): flag **`include_taxes_and_fees`** → BRUTO o NETO; rol mínimo ORGANIZER.
- Neto = `price`; bruto = `price_including_taxes_and_fees` (la API ya devuelve ambos).

**Pendiente (a decidir):** la **UI del panel del evento** NO diferencia precio por rol (dashboard muestra bruto, tabla de tickets muestra neto, igual para todos). Si el cliente lo quiere también en pantalla, sería lo único a agregar; si los reportes alcanzan, el frente 3 queda cerrado.

---

## 📋 Mapa exhaustivo de inputs de un evento

### Ya existen en HiEvents (creación/edición)
- **Básico:** title*, description (HTML), description_preview, slug, status (DRAFT/LIVE/PAUSED/ARCHIVED), organizer_id*.
- **Fechas:** start_date*, end_date, ticket_sales_start_date, timezone*, currency*.
- **Ubicación:** location_details (venue_name, address_1/2, city, state_or_region, zip, country), is_online_event + online_event_connection_details, maps_url, website_url.
- **Imágenes:** EVENT_THUMBNAIL, EVENT_BANNER, EVENT_COVER, EVENT_GALLERY (múltiple).
- **Settings:** order_timeout_in_minutes, require_attendee_details, pre/post_checkout_message, ticket_page_message, continue_button_text, support_email, email_footer_message, notify_organizer_of_new_orders, **price_display_mode (INCLUSIVE/EXCLUSIVE)**, allow_search_engine_indexing, hide_getting_started_page, show_share_buttons, show_seats_availability.
- **Branding homepage del evento:** homepage_background_type/color, primary/secondary colors (+text).
- **SEO:** seo_title, seo_description, seo_keywords.
- **Impuestos:** taxes_and_fees (pivot a nivel cuenta) + price_display_mode.
- **Tickets:** tipoticket (general/enumerado), map, tickets[]/prices.
- **Custom:** `attributes[]` (name, value, **is_public**) ← públicos se exponen.
- **Otros:** daily_sales_report_emails, questions, promo_codes, capacity_assignments, check_in_lists.

(* = requerido en creación)

### Gaps que el v2 necesita y faltan
| Campo v2 | Hoy en v2 | Falta en HiEvents | Plan |
|---|---|---|---|
| **category** | `inferCategory` (keywords del título) | sin campo | columna dedicada + exponer en EventResourcePublic + form admin |
| **featured/hero** | computado (primeros N) | sin flag | lo maneja el **panel de Home** (lista de destacados) |
| **availability** (listado) | heurística por hash | el detalle ya trae real; el listado no | exponer disponibilidad en el listado o aceptar la del detalle |
| **series_id** (multifecha) | agrupa por título normalizado (frágil) | sin agrupación | columna `series_id` + clonado por fecha |
| **vibe** | usa `description_preview` ✅ | ya existe | confirmar consumo |

---

## 🗺️ Sub‑hitos (orden por riesgo)

| Sub‑hito | Alcance | Toca back HiEvents | Estado / riesgo |
|---|---|---|---|
| **6.1 · Roles & precio** | Verificar reportes (HECHOS). **Decidir** si se quiere precio por rol en la UI del panel; si sí, hook de display. | Solo front admin (si aplica) | 🟢 mayormente hecho |
| **6.2 · category** | Columna `category` en eventos → form admin + EventResourcePublic + listado → v2 usa categoría real (saca `inferCategory`). | Sí (migración aditiva) | 🟡 medio |
| **6.3 · Auditoría de inputs** | Checklist completo: cada input que el v2 muestra (vibe, gallery, sale_start, support, etc.) se carga y se consume. Cerrar gaps menores. | Mixto | 🟡 medio |
| **6.4 · Panel de Home (ADMIN)** | Tabla `account_home_config` (destacados, carruseles, orden de secciones) + endpoints + **panel admin nuevo solo‑ADMIN** + v2 Home consume config real (saca heurísticas de hero/carruseles). | Sí (tabla + UI admin) | 🔴 alto |
| **6.5 · Multi‑fecha** | `series_id` + switch "multifecha" en creación → clonado por fecha en back + v2 agrupa por `series_id` + verificar scope de asiento por `event_id`. | Sí (migración + clone) | 🔴 alto |

**Orden recomendado:** 6.1 (cerrar/decidir) → 6.2 → 6.3 → 6.4 → 6.5.

### Integración en el admin (referencia)
- Front admin: React + Mantine + react‑query + axios, rutas lazy (`frontend/src/router.tsx`).
- Config a nivel cuenta: `frontend/src/components/routes/account/ManageAccount/` (tabs). Hay un tab placeholder `/account/event-defaults` y el patrón de `AccountSettings` para clonar.
- El panel de Home iría como tab/sección nueva de cuenta, gateado por `useIsCurrentUserAdmin()`.
- API: `*.client.ts` (axios) + `queries/useGet*` + `mutations/useUpdate*`.
- Creación/edición de evento: `frontend/src/components/modals/CreateEventModal/` + `routes/event/Settings/Sections/`. Back: `Http/Request/Event/*`, `Services/Handlers/Event/DTO/*`, `DomainObjects/EventDomainObject*`, `Resources/Event/*`.

### Decisión abierta
- **Precio por rol en la UI del panel del evento**: ¿se quiere además de los reportes? (Admin=bruto / Organizador=neto en pantalla.) Si no, el frente "roles/precio" queda cerrado con los reportes existentes.
