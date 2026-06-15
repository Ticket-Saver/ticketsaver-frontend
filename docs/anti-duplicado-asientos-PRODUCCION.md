# Anti-duplicado de asientos — Guía de producción (HiEvents)

> **Para:** el responsable de deploy + backend HiEvents.
> **Qué cubre:** cómo funciona el control anti-duplicado de asientos enumerados, **qué hay que asegurar en el deploy de producción para que funcione**, y cómo verificarlo.
> **Última verificación local:** 2026-06-15 (stack HiEvents en Docker).

---

## 1. Resumen ejecutivo

El sistema garantiza que **un asiento enumerado no se pueda vender dos veces**, incluso con dos compradores simultáneos. La protección vive **íntegramente en el backend de HiEvents** (no en el frontend). El frontend solo reacciona a lo que el backend decide.

Mecanismo en dos tiempos:

1. **Hold al confirmar** — cuando el comprador toca *Checkout*, el front crea una orden (`POST /public/events/:id/order`) que **reserva** los asientos (`status = RESERVED`, con `reserved_until`) **antes** de ir al pago. Si otro se adelantó, la reserva rebota con **HTTP 422** y el comprador sigue en el mapa.
2. **Liberación al vencer** — si la orden no se paga dentro de `order_timeout_in_minutes`, un **comando programado** (`orders:cancel-expired`) la cancela y devuelve el asiento al pool.

> ⚠️ **El punto 2 depende de que el scheduler de Laravel esté corriendo en producción.** Ver [§4](#4--requisito-crítico-de-deploy-el-scheduler-de-laravel). Sin él, los asientos no liberados quedan bloqueados para siempre.

---

## 2. Dónde vive el código (backend HiEvents)

| Archivo | Rol |
|---|---|
| `backend/app/Services/Handlers/Order/CreateOrderHandler.php` | **Núcleo anti-race.** `lockForUpdate()` sobre `ticket_prices` (serializa órdenes concurrentes sobre el mismo precio) + cuenta órdenes `RESERVED` no vencidas **y** `COMPLETED` contra el cupo + bloquea cantidad > 1 en un asiento. |
| `backend/app/Services/Domain/Order/OrderManagementService.php` | Setea `reserved_until = now()->addMinutes($timeOutMinutes)` al crear la orden. |
| `backend/app/Console/Commands/CancelExpiredOrdersCommand.php` | Comando `orders:cancel-expired`: cancela órdenes `RESERVED` con `reserved_until < now()` y libera el asiento. |
| `backend/routes/console.php` | Programa el comando con `->everyMinute()`. **Requiere que el scheduler esté activo** (ver §4). |
| Tabla `event_settings`, columna `order_timeout_in_minutes` | Timeout de reserva **por evento** (default 15, rango 1–120). |

### Las tres defensas dentro de `CreateOrderHandler`

1. **Lock pesimista** (`lockForUpdate`) sobre las filas de `ticket_prices` pedidas → dos requests simultáneas se serializan; la segunda ve el estado ya actualizado por la primera. Esto es lo que mata la *race condition* real de producción.
2. **Conteo de cupo robusto**: `available = initial_quantity_available − max(quantity_sold, órdenes RESERVED-no-vencidas + COMPLETED)`. Usa el máximo entre el contador `quantity_sold` y el conteo real para protegerse de desincronizaciones. Cuenta también las `RESERVED` para que no exista un "punto ciego" mientras alguien está pagando.
3. **Asiento = cantidad 1**: un `ticket_price` ligado a un asiento (`tickets.seat_number` no vacío) no admite `quantity > 1`.

---

## 3. Configuración por evento

- El timeout de reserva es **por evento**, no global: columna `order_timeout_in_minutes` en `event_settings` (default **15**, editable en el panel admin, rango permitido 1–120 — ver `UpdateEventSettingsRequest`).
- Recomendación producción: **10–15 min**. Suficiente para completar el pago sin tener asientos bloqueados de más.

---

## 4. ⚠️ REQUISITO CRÍTICO DE DEPLOY: el scheduler de Laravel

**Este es el punto que hay que accionar en el deploy.**

`orders:cancel-expired` está programado `->everyMinute()` en `routes/console.php`, pero eso **solo se ejecuta si algo corre el scheduler de Laravel cada minuto**. Hoy:

- La imagen **`Dockerfile.all-in-one`** corre vía supervisord **solo** `nginx`, `php-fpm` y `nodejs` (`docker/all-in-one/supervisor/supervisord.conf`). **No incluye el scheduler.**
- Los scripts de deploy EC2 (`deployment/update-production.sh`, `deployment/user-data.sh`) **no instalan ningún cron** para el scheduler.

👉 **Conclusión: con el tooling de deploy actual, `orders:cancel-expired` NUNCA corre en producción.** Resultado: las reservas que no se pagan **no liberan el asiento** → inventario "comido" silenciosamente, asientos que figuran ocupados para siempre.

### Cómo arreglarlo (elegir UNA de las dos opciones)

**Opción A — cron del sistema (la estándar de Laravel):**
```cron
* * * * * cd /ruta/al/backend && php artisan schedule:run >> /dev/null 2>&1
```
(En el deploy EC2 actual, agregar esta línea al crontab del usuario que corre la app — p. ej. `nginx`.)

**Opción B — programa supervisord (recomendado si se usa la imagen all-in-one):**
Agregar a `docker/all-in-one/supervisor/supervisord.conf`:
```ini
[program:scheduler]
command=php /app/backend/artisan schedule:work
autostart=true
autorestart=true
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
```
> `schedule:work` es un proceso de larga vida que internamente dispara los comandos programados cada minuto — ideal para supervisord/contenedores (no necesita cron del SO).

### ¿Hace falta un queue worker?

**No, mientras `QUEUE_CONNECTION=sync`** (config actual del backend). Los jobs y mails corren sincrónicos. ⚠️ Si en el futuro se cambia a un driver de cola real (`redis`, `database`, `sqs`), entonces **sí** habrá que correr además `php artisan queue:work` como proceso/programa supervisord.

### Cómo verificar que el scheduler quedó activo en producción

```bash
# Debe listar 'orders:cancel-expired ... Every minute'
php artisan schedule:list

# Forzar una corrida manual (no debe tirar error):
php artisan orders:cancel-expired
```

---

## 5. Comportamiento del frontend (contexto, no requiere acción)

- **Hold al confirmar**: `src/components/v2/sale/SeatPickerV2.tsx` → al tocar *Checkout* hace `POST .../order` y recién entonces va al pago.
- **Manejo de colisión**: si el backend responde **409/422**, el front muestra *"Uno o más de tus asientos acaban de ser tomados por otra persona…"* y deja al usuario en el mapa.
- **Timer sincronizado al servidor**: el contador de 10 min que ve el usuario se ata a `reserved_until` real de la orden (`useSessionTimer.syncToServerExpiry`), no a un contador local. Si el backend dice que vence en X, el front muestra X.
- **Header requerido**: el front manda `Accept: application/json`. Sin ese header, un error de validación de Laravel devuelve un **302 redirect** en vez del **422 JSON** (importante si alguien prueba la API con `curl` a mano).

---

## 6. Cómo verificar el anti-duplicado en producción (smoke test)

Usar un evento enumerado real. Reemplazar `:id`, `ticket_id`, `price_id` por valores reales (resolver con `POST /public/events/:id/tickets/by-seat-ids {"seat_ids":[...]}`).

```bash
# 1) Reservar un asiento (debe dar 201 RESERVED + reserved_until)
curl -s -X POST "$BASE/public/events/$EV/order" \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  -d '{"tickets":[{"ticket_id":TID,"quantities":[{"price_id":PID,"quantity":1}]}],"session_identifier":"smoke-A"}'

# 2) Pedir el MISMO asiento desde otra sesión (debe dar 422 "sold out")
curl -s -X POST "$BASE/public/events/$EV/order" \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  -d '{"tickets":[{"ticket_id":TID,"quantities":[{"price_id":PID,"quantity":1}]}],"session_identifier":"smoke-B"}'

# 3) Cantidad 2 sobre un asiento (debe dar 422 "maximum ... is 1")
curl -s -X POST "$BASE/public/events/$EV/order" \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  -d '{"tickets":[{"ticket_id":TID,"quantities":[{"price_id":PID,"quantity":2}]}],"session_identifier":"smoke-C"}'
```

**Limpieza del smoke test:** las órdenes `RESERVED` de prueba quedan vivas hasta vencer. Una vez vencido `reserved_until`, el scheduler (o una corrida manual de `php artisan orders:cancel-expired`) las cancela y libera el asiento. Para no esperar el timeout completo se puede adelantar el vencimiento en la DB sobre esas órdenes de prueba y luego correr el comando.

---

## 7. Resultados de la verificación local (2026-06-15)

Stack HiEvents en Docker, evento 6 *"Demo Enumerado – Copernicus Center"* (enumerado), `order_timeout_in_minutes` bajado a 1 min para la prueba y **revertido a 10 al terminar**.

| Caso | Acción | Resultado |
|---|---|---|
| **Colisión mismo asiento** | Orden A reserva A22 → Orden B pide el mismo | **422 "The ticket Asiento A22 is sold out"**; en DB queda **1 sola reserva** |
| **Cantidad > 1 en un asiento** | Orden con `quantity: 2` | **422 "The maximum number of tickets available… is 1"** |
| **Liberación al vencer** | Reservar → forzar `reserved_until` al pasado → correr `orders:cancel-expired` | Orden → **CANCELLED**, asiento vuelve a **AVAILABLE**, el reintento entra (**201**) |
| **Timer fresco** | Cada orden nace con `reserved_until = now + timeout` | OK — el tiempo no se "gasta" navegando |

Pendiente de validar en navegador real (no afecta el backend): compra completa con pago Stripe + emisión + QR, y la auto-remoción del carrito en el front por polling de disponibilidad.

---

## 8. Notas y gotchas

- **Scheduler NO corre en local dev**: el contenedor `backend` de desarrollo corre solo `php artisan serve`. Por eso, en local, `orders:cancel-expired` hay que dispararlo a mano. En **producción** debe correr automáticamente (§4).
- **Email de cancelación sin destinatario**: si una orden `RESERVED` se cancela sin tener comprador asociado (p. ej. órdenes de smoke test creadas sin attendee), el comando loguea `An email must have a "To"… header`. Es inofensivo: **la orden igual se cancela correctamente**. En el flujo real la orden siempre lleva email del comprador.
- **Columna de sesión**: en la tabla `orders` la columna es `session_id` (no `session_identifier`, que es el nombre del campo en el payload de la API).
- **Acceso a la DB (dev):** `docker exec development-pgsql-1 psql -U username -d backend`. Credenciales en `backend/.env` (`DB_DATABASE=backend`, `DB_USERNAME=username`, `DB_PASSWORD=password`).
