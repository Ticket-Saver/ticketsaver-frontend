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
| **6.1 · Roles & precio** | Verificar reportes (HECHOS). **Decidir** si se quiere precio por rol en la UI del panel; si sí, hook de display. | Front admin + reportes ya existían | ✅ hecho |
| **6.2 · category** | Columna `category` en eventos → form admin + EventResourcePublic + listado → v2 usa categoría real (saca `inferCategory`). | Sí (migración aditiva) | ✅ hecho |
| **6.3 · Auditoría de inputs** | Checklist completo: cada input que el v2 muestra (vibe, gallery, sale_start, support, etc.) se carga y se consume. Cerrar gaps menores. | Mixto | ✅ hecho (incl. alineación Figma: sin datos inventados) |
| **6.4 · Panel de Home (ADMIN)** | Tabla `account_home_config` (destacados, carruseles, orden de secciones) + endpoints + **panel admin nuevo solo‑ADMIN** + v2 Home consume config real (saca heurísticas de hero/carruseles). | Sí (tabla + UI admin) | ✅ hecho (shell + backend + admin UI + v2) |
| **6.5 · Multi‑fecha** | `series_id` + switch "multifecha" en creación → clonado por fecha (reutiliza `DuplicateEventService`) + v2 agrupa por `series_id` + scope de asiento por `event_id` (verificado). | Sí (migración + clone) | ⏳ EN CURSO (plan fino abajo) |

**Orden recomendado:** 6.1 (cerrar/decidir) → 6.2 → 6.3 → 6.4 → 6.5.

### Integración en el admin (referencia)
- Front admin: React + Mantine + react‑query + axios, rutas lazy (`frontend/src/router.tsx`).
- Config a nivel cuenta: `frontend/src/components/routes/account/ManageAccount/` (tabs). Hay un tab placeholder `/account/event-defaults` y el patrón de `AccountSettings` para clonar.
- El panel de Home iría como tab/sección nueva de cuenta, gateado por `useIsCurrentUserAdmin()`.
- API: `*.client.ts` (axios) + `queries/useGet*` + `mutations/useUpdate*`.
- Creación/edición de evento: `frontend/src/components/modals/CreateEventModal/` + `routes/event/Settings/Sections/`. Back: `Http/Request/Event/*`, `Services/Handlers/Event/DTO/*`, `DomainObjects/EventDomainObject*`, `Resources/Event/*`.

### Decisión abierta
- **Precio por rol en la UI del panel del evento**: ¿se quiere además de los reportes? (Admin=bruto / Organizador=neto en pantalla.) **RESUELTO 2026-06-16:** el cliente lo quiere → implementado (hook `useRolePrice` en SortableTicket: admin ve bruto, organizador neto).

---

## ✅ Estado / dónde quedamos (2026-06-16)

**Fase 6: 6.1 → 6.4 HECHAS. Falta solo 6.5 (multi-fecha).**

Lo construido y verificado:
- **6.1 Precio por rol** — `useRolePrice` (admin=bruto / organizador=neto) en la tabla de tickets del panel. (Reportes neto/bruto ya existían en HiEvents — no se tocaron.)
- **6.2 `category`** — columna en HiEvents (back: migración + DTO/Request/Resource/Model/Handlers/DomainObject; forms admin crear+editar) y el v2 la consume (sin `inferCategory`).
- **Roles — crear evento solo ADMIN** — `CreateEventAction`/`DuplicateEventAction` con `minimumAllowedRole(ADMIN)` (organizer → 403) + UI oculta crear para no-admin. (Visibilidad organizador = sus eventos: ya existía en `GetManageEventsAction`.)
- **6.3 Inputs + alineación Figma** — el detalle del v2 muestra organizador, hora-fin, dirección completa, contacto/web y **campos custom** (attributes públicos) como pills en "Good to know" (editor `EventAttributesEditor` en crear+editar). Se quitaron datos inventados (slug-as-venue, subtítulo duplicado, "· Tour", disponibilidad fake en cards).
- **6.4 Panel de Home** — sección **Admin TicketSaver** (`/admin`, solo ADMIN, acceso header+avatar, sidebar extensible con Home/Usuarios/Reventas) + backend `account_home_config` (GET/PUT admin + GET público) + admin UI (picker de destacados + editor de carruseles) + el v2 consume `/public/home-config` (hero + carruseles curados, fallback al automático). Verificado end-to-end por captura.

**Commits:**
- `ticketsaver-frontend` (rama `Ticket-Saver-NewFront`, PUSHEADO): hasta `d26c786`.
- `hievents` (rama `seats-lazy-performance`, **commits LOCALES** — coordinar con el colega antes de pushear; main es de él): category back+forms+6.1+roles (`ffdcd5f`), editor attributes 6.3 (`3679116`), shell Admin TS 6.4 (commit), backend home-config 6.4 (commit), admin UI home 6.4 (commit).

---

## 🎫 6.5 Multi-fecha — PLAN FINO (análisis del 2026-06-17)

### Decisiones tomadas (2026-06-17)
1. **Switch en la creación** del evento (no acción separada). El switch declara las fechas de la serie al crear.
2. **Fechas independientes**: tras clonar, cada fecha es un evento autónomo. Editar una NO toca a las demás (igual que el duplicado actual). Sin sincronización entre fechas.
3. **`series_id` = `event_id` del evento plantilla** (el primero de la serie). Todos los eventos de la serie (incluido el plantilla) comparten ese `series_id`.

### Hallazgo crítico — timing de clonado vs. asientos
`DuplicateEventService` **copia los asientos que YA existen** en el evento origen (clona los `tickets` con `position/seat_number/section/row` reasignando `event_id`). Pero un evento **enumerado recién creado NO tiene asientos**: se generan después con `ActivateMapSectionAction` (lee `storage/venue-maps/{map}/seats.json`). Flujo real del enumerado: `crear → activar secciones (genera asientos) → precios`.

→ **No se puede clonar en el instante de crear un enumerado** (saldrían clones vacíos). Solución de diseño (flujo único, sin ramas por tipo en la UX):
- El **switch en creación** captura las fechas + asigna `series_id` al plantilla.
- La **materialización (clonado efectivo)** se confirma en **getting-started** con un botón "Generar las N fechas de la serie", ya con las fechas pre-cargadas del paso de creación. Para el admin, conceptualmente "lo declaró al crear"; técnicamente clona cuando el plantilla ya tiene asientos + precios.
- Reutiliza `DuplicateEventService` tal cual (no se toca su lógica de clonado).

### Asientos entre fechas — VERIFICADO seguro
Índice único real: `tickets_event_section_row_position_seat_price_unique ON (event_id, section, row, position, seat_number, price_range)`. `event_id` es parte de la clave → "K-7" del evento 10 ≠ "K-7" del evento 11. Anti-duplicado de compra (`attendees_unique_active_seat` por `ticket_id` + trigger `is_seated`) aislado por evento. El v2 ya manda `seatId` + `eventId` numérico a `/public/events/{eventId}/order`. **El flujo de compra NO necesita cambios.**

### Checklist — Backend HiEvents (rama `seats-lazy-performance`)
- [ ] Migración `add_series_id_to_events_table` (nullable, self-FK a `events`). Patrón = `2026_06_15_000000_add_category_to_events_table.php`.
- [ ] `Event` model: `series_id` en `getFillableFields()` + cast. `EventDomainObjectAbstract`: constante + propiedad. `EventDomainObject`: getter/setter.
- [ ] `CreateEventService`: tras crear el plantilla, `series_id = id` propio (self-stamp).
- [ ] Endpoint "generar serie": recibe `event_id` plantilla + `dates[]` → loop sobre `DuplicateEventService::duplicateEvent()` con `series_id` común (= `series_id` del plantilla), status DRAFT. Devuelve los eventos creados.
- [ ] Exponer `series_id` en `EventResourcePublic` (y `EventResource` admin).
- [ ] `EventRules`/`CreateEventRequest`: validar `dates[]` opcional (array de start/end ISO) cuando viene el switch.

### Checklist — Front admin HiEvents (`frontend/`)
- [ ] `types.ts`: `series_id?: number` en `Event`; payload de "generar serie".
- [ ] `CreateEventModal`: switch "Evento multi-fecha" → editor de fechas (replica patrón `EventAttributesEditor` + `DateTimePicker`). Primera fecha = plantilla. Guarda las fechas para getting-started.
- [ ] Getting-started: botón "Generar las N fechas de la serie" (visible si el evento es plantilla con fechas pendientes y ya tiene asientos+precios). Llama al endpoint nuevo (`event.client.ts` + `useGenerateSeriesDates` mutation).
- [ ] (Opcional) Settings del evento: badge "parte de una serie" + link a las hermanas.

### Checklist — Front v2 (`ticketsaver-frontend`)
- [ ] `series_id?: number` en `HiEventPublic` (`types/hievents.ts`) y en `UIEvent` (`types/uiEvent.ts`).
- [ ] `hiEventsAdapter.ts` (`hiEventToUIEvent`): mapear `series_id`.
- [ ] `multiDateAdapter.ts`: agrupar por `series_id` en vez de `normalizeArtistKey(title)`. Fallback a título si `series_id` null (compat). `getDatesForArtist` filtra por la serie del evento actual.
- [ ] `MultiDateSelector` + `EventDetailV2`: sin cambios de UI (ya consumen `UIEvent[]`), solo cambia la fuente del agrupamiento.
- [ ] Verificar que al cambiar de fecha la navegación usa `eventId` numérico (ya es así vía `detailHref`).

### Orden de ejecución sugerido
1. Backend: migración + domain/model + resource (expone `series_id`).
2. Backend: endpoint generar-serie (reutiliza DuplicateEventService).
3. Front admin: switch creación + editor fechas + botón getting-started.
4. Front v2: `series_id` en tipos + agrupar por serie.
5. Verificación end-to-end (crear serie de 2-3 fechas enumeradas, comprar en 2 fechas distintas, confirmar asientos aislados).

**Notas de entorno:** Avast intercepta el SSL → para pushear hay que desactivarlo. `frontend-csr` (admin, Docker) no detecta cambios por bind-mount → reiniciar el contenedor para que vite los sirva. Datos de prueba dejados: evento 6 con 2 attributes públicos + config de Home (featured [6,1] + 1 carrusel) para ver la curaduría.

### ✅ Estado de ejecución 6.5 (2026-06-17 — código escrito, falta verificar en Docker)

Implementado (sin commitear todavía):

**Backend HiEvents** (rama `seats-lazy-performance`):
- Migración `2026_06_17_000000_add_series_id_to_events_table.php` → `series_id` (nullable, index) + `series_pending_dates` (json nullable). Sin FK estricta a propósito (fechas independientes: borrar el plantilla no debe cascadear).
- `Event` model (fillable+cast), `EventDomainObjectAbstract` (consts/props/toArray/getters-setters) → `series_id` + `series_pending_dates`.
- Creación: `CreateEventDTO` + `CreateEventHandler` + `CreateEventService.handleEventCreate` persisten `series_pending_dates` (y se aprovechó para persistir `daily_sales_report_emails`, que el create no guardaba). `EventRules.eventRules()` valida `series_pending_dates.*`.
- Endpoint generar serie: `GenerateEventSeriesAction` + `GenerateEventSeriesRequest` + `GenerateEventSeriesHandler` + `GenerateEventSeriesDTO`. Ruta `POST /events/{id}/generate-series` (solo ADMIN). Self-stampa `series_id = id` del plantilla, limpia `series_pending_dates` y clona una vez por fecha vía `DuplicateEventService`.
- **Fix aditivo en `DuplicateEventService.cloneExistingEvent`:** ahora copia `tipoticket`, `category`, `map`, `location_details`, `daily_sales_report_emails` y hereda `series_id` (antes NO los copiaba → el duplicado perdía el mapa/tipo; era un bug latente). `duplicateEvent` acepta `?int $seriesId`.
- Resources: `series_id` en `EventResourcePublic`; `series_id` + `series_pending_dates` en `EventResource`.

**Front admin** (`hievents/frontend`):
- `types.ts`: `SeriesDate`, `GenerateSeriesPayload`, `Event.series_id`/`series_pending_dates`.
- `CreateEventModal`: switch "Evento multi-fecha" + `SeriesDatesEditor` (componente nuevo, replica el patrón de `EventAttributesEditor`). Solo manda fechas si el switch está activo y tienen inicio.
- `event.client.ts` `generateSeries()` + `useGenerateEventSeries` mutation.
- `GettingStarted`: card "📅 Generar fechas de la serie" si hay `series_pending_dates`; botón deshabilitado hasta que haya tickets/asientos (clave para enumerados).

**Front v2** (`ticketsaver-frontend`):
- `series_id` en `HiEventPublic`, `seriesId` en `UIEvent`, mapeado en `hiEventToUIEvent`.
- `multiDateAdapter`: agrupa por `seriesId` (fallback título). Nuevo `getDatesForEvent(events, event)` series-aware; `EventDetailV2` lo usa.
- **Typecheck v2 (`tsc --noEmit`): OK, sin errores.**

**PENDIENTE de verificar (Docker estaba apagado):**
1. `php -l` de los archivos backend + `php artisan migrate` (correr en el contenedor backend).
2. Typecheck/lint del admin (`hievents/frontend`) en Docker (no hay `node_modules` local).
3. Reiniciar `frontend-csr` para que vite sirva los cambios.
4. E2E: crear serie de 2-3 fechas enumeradas → generar en getting-started → comprar mismo asiento en 2 fechas distintas → confirmar que NO colisiona (event_id distinto).

---

## 🪑 Generador de asientos — fix + optimización + blindaje (2026-06-17)

### Síntoma
Un evento enumerado nuevo con `map=chicago_alucines` generaba **0 asientos** al tocar "generar asientos" en el admin.

### Causa raíz (verificada en el contenedor)
El admin, por cada sección, llama `POST /tickets/activate-section`. `ActivateMapSectionAction` lee **`storage/app/venue-maps/{map}/seats.json`**, pero ese directorio **no existía en el backend** (solo había `public/venue-maps/*.svg` + `*.ranges.json`). → `404 "Map definition not found"` por sección → el front lo tragaba y mostraba "Partial Success: 0". Roto para **cualquier** mapa, no solo Chicago. Los eventos viejos (3/4/6) tenían asientos de cargas previas con otro método.

### Solución (decidido: backend autónomo + desbloqueo+blindaje+optimización)
**Fase 0 — backend autónomo:**
- Fuente versionada `backend/resources/venue-maps/{map}/seats.json` (copiada de los assets del front).
- Comando `php artisan venue-maps:sync` (`VenueMapsSyncCommand`) copia esos JSON a `storage/app/venue-maps/` (idempotente). Correr en deploy/post-install. El backend deja de depender del front en runtime.

**Fase 1 — blindaje:**
- `activate-section` ahora es **atómico** (la inserción va en una transacción; si algo falla, rollback → 0 huérfanos).
- Idempotencia: sigue usando `TicketDuplicateChecker` (filtra por `event_id`+código) → re-ejecutar no duplica (devuelve `skipped`).
- Front (`tickets.tsx` `handleBulkCreate`): si no se creó nada y hubo errores → notificación **roja** (antes "Partial Success" amarillo que pasaba desapercibido); solo marca el evento "con tickets" si se creó ≥1.

**Fase 2 — optimización (núcleo, resultado idéntico):**
- Nuevo `BulkSeatCreationService`: dos `insert()` en lote (tickets + ticket_prices) en una transacción, cargando el evento una vez. Reemplaza el alta 1×1 (1 transacción + 1 `findById` por asiento).
- `ActivateMapSectionAction` usa el servicio en vez del loop `CreateTicketHandler`.
- **Rendimiento: 1876 asientos en ~780 ms** (antes ~20 min).
- **Verificación de equivalencia:** mismo input por motor viejo vs nuevo → **idéntico en 27 columnas/asiento, 0 diferencias**.

**Fase 3 — multi-fecha Chicago E2E (verificado):**
- ev19 (Chicago) → 1876 asientos → generar serie (2 fechas) → clones 20/21 con 1876 c/u, `tipoticket=enumerado`, `map=chicago_alucines`, `series_id=19`.
- **Aislamiento:** Balcony/A1 = ticket_id 4407/6283/8159 (distintos); 5628 tickets = 5628 ids únicos.
- **HTTP real:** `activate-section` por HTTP+JWT → creación (count 474) e idempotencia (skipped 474) OK.
- Serie 19/20/21 dejada en LIVE para verla en el v2.

### Archivos
- `backend/app/Console/Commands/VenueMapsSyncCommand.php` (nuevo)
- `backend/resources/venue-maps/{map1,map2,chicago_alucines,san_jose}/seats.json` (nuevo, versionado)
- `backend/app/Services/Domain/Ticket/BulkSeatCreationService.php` (nuevo)
- `backend/app/Http/Actions/Tickets/ActivateMapSectionAction.php` (usa el servicio, atómico)
- `frontend/src/components/routes/event/tickets.tsx` (errores visibles)

### Pendiente / notas
- En deploy hay que correr `php artisan venue-maps:sync` (documentar en el runbook del colega).
- `map1` (Ritz) en su `seats.json` **no trae `section`** → el flujo por secciones no le aplica; sus eventos se cargaron por otra vía. Si se quiere unificar, habría que darle `section` o un flujo "sin secciones". Fuera del alcance de este fix.
- `BulkCreateTicketsAction` (POST `/tickets/bulk`) se dejó intacto (el front usa `activate-section`); se puede migrar al mismo servicio en otra pasada.
