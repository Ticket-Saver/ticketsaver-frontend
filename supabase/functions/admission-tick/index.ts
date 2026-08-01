// admission-tick: invocada por pg_cron cada 8s.
// 1. Pregunta a hiEvents/Laravel qué eventos tienen cola activa ahora + su admission_rate_per_minute.
// 2. Por cada uno reserva el siguiente lote (admit_next_batch), firma el token de turno de cada
//    fila reservada y cierra la admisión con finalize_admission (status + token en un solo UPDATE).
import { createClient } from 'npm:@supabase/supabase-js@2'
import { create as createJwt, getNumericDate } from 'https://deno.land/x/djwt@v3.0.2/mod.ts'

const HIEVENTS_API_URL = Deno.env.get('HIEVENTS_API_URL')!
const QUEUE_TOKEN_SECRET = Deno.env.get('QUEUE_TOKEN_SECRET')!
const TICK_INTERVAL_SECONDS = 8
// La reserva de asientos dura más que 8 min: el token expiraba en medio del checkout
// y CompleteOrder devolvía 403 QUEUE_TOKEN_EXPIRED. Se sube a 20 min.
const TOKEN_TTL_SECONDS = 20 * 60

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

async function signToken(eventId: number, userId: string, entryId: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(QUEUE_TOKEN_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  return createJwt(
    { alg: 'HS256', typ: 'JWT' },
    { event_id: eventId, user_id: userId, entry_id: entryId, exp: getNumericDate(TOKEN_TTL_SECONDS) },
    key,
  )
}

Deno.serve(async (req) => {
  if (req.headers.get('Authorization') !== `Bearer ${QUEUE_TOKEN_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  let activeQueues: Array<{ event_id: number; admission_rate_per_minute: number }> | undefined
  try {
    const activeRes = await fetch(`${HIEVENTS_API_URL}/public/queue-settings/active`, {
      headers: {
        Authorization: `Bearer ${QUEUE_TOKEN_SECRET}`,
        'ngrok-skip-browser-warning': 'true',
      },
    })
    if (!activeRes.ok) {
      const body = await activeRes.text()
      console.error(`[admission-tick] hiEvents ${activeRes.status}: ${body.slice(0, 200)}`)
      return new Response(`hiEvents ${activeRes.status}: ${body.slice(0, 200)}`, { status: 502 })
    }
    ;({ data: activeQueues } = await activeRes.json())
  } catch (e) {
    // Error de red al llamar a hiEvents: no hay nada que procesar, se corta acá.
    console.error('[admission-tick] fetch a hiEvents falló:', e)
    return new Response(`hiEvents fetch error: ${e}`, { status: 502 })
  }

  let events = 0
  let admittedCount = 0
  let failed = 0

  for (const queue of activeQueues ?? []) {
    events++
    try {
      const batchSize = Math.max(1, Math.round(queue.admission_rate_per_minute * (TICK_INTERVAL_SECONDS / 60)))

      // admit_next_batch ya no marca 'admitted': solo reserva las filas (admitted_at) y las devuelve.
      const { data: admitted, error } = await supabase.rpc('admit_next_batch', {
        p_event_id: queue.event_id,
        p_batch_size: batchSize,
      })

      if (error) throw error

      if (!admitted || admitted.length === 0) {
        console.warn(
          `[admission-tick] event ${queue.event_id}: cola activa, batchSize=${batchSize}, 0 filas reservadas`,
        )
        continue
      }

      for (const entry of admitted) {
        const token = await signToken(queue.event_id, entry.user_id, entry.id)
        // finalize_admission marca status='admitted' + admission_token en un único UPDATE atómico.
        // Antes se hacía un update directo a queue_entries que dejaba la fila 'admitted' sin token:
        // el cliente lo veía por Realtime y redirigía sin token → 403.
        const { error: finalizeError } = await supabase.rpc('finalize_admission', {
          p_entry_id: entry.id,
          p_token: token,
        })
        if (finalizeError) {
          console.error(`[admission-tick] finalize_admission falló para entry ${entry.id}:`, finalizeError)
          continue
        }
        admittedCount++
      }
    } catch (e) {
      // Un evento roto no puede abortar ni ensuciar el procesamiento de los demás.
      console.error(`[admission-tick] event ${queue.event_id} falló:`, e)
      failed++
    }
  }

  return new Response(JSON.stringify({ events, admitted: admittedCount, failed }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
