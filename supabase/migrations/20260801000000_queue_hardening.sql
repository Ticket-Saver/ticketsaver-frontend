-- Hardening de la cola virtual: cierra el salto de cola vía UPDATE directo,
-- corrige el conteo total (RLS solo dejaba ver filas propias), sube la
-- tolerancia de expiración y elimina la carrera admitted/token en el batch.

-- El cliente ya no hace UPDATE directo sobre queue_entries: con la policy
-- anterior cualquier usuario podía marcarse status='admitted' a sí mismo y
-- saltarse la fila. A partir de ahora toda escritura pasa por funciones
-- security definer (queue_heartbeat, queue_leave, finalize_admission).
drop policy if exists "update own entries" on queue_entries;

-- Refresca el heartbeat de la propia fila mientras sigue en 'waiting'.
create or replace function queue_heartbeat(p_entry_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
    update queue_entries
    set last_heartbeat_at = now()
    where id = p_entry_id
      and user_id = auth.uid()
      and status = 'waiting'
$$;

-- Abandona voluntariamente la propia fila. El filtro status = 'waiting'
-- evita que un usuario ya admitido "se salga" y pierda su admission_token.
create or replace function queue_leave(p_entry_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
    update queue_entries
    set status = 'abandoned'
    where id = p_entry_id
      and user_id = auth.uid()
      and status = 'waiting'
$$;

-- Total de gente esperando un evento. Antes el front lo contaba client-side,
-- pero RLS solo deja ver las filas propias, así que el total siempre daba ~1.
create or replace function get_queue_total(p_event_id bigint)
returns integer
language sql
security definer
set search_path = public
as $$
    select count(*)::integer
    from queue_entries
    where event_id = p_event_id
      and status = 'waiting'
$$;

-- Abandona filas sin heartbeat reciente. Umbral subido de 30s a 90s: 30s era
-- menor que la tolerancia real de un heartbeat de 10s con red lenta o
-- pestaña en background, y expulsaba usuarios legítimos.
create or replace function expire_stale_queue_entries()
returns void
language sql
security definer
set search_path = public
as $$
    update queue_entries
    set status = 'abandoned'
    where status = 'waiting'
      and last_heartbeat_at < now() - interval '90 seconds'
$$;

-- Reserva (no admite) las N filas 'waiting' más antiguas de un evento.
-- Cambio de semántica: ya NO marca status='admitted' aquí. Solo actualiza
-- admitted_at para reservar el cupo y devuelve las filas reservadas; la edge
-- function firma el admission_token de cada una y recién ahí llama a
-- finalize_admission, que marca status='admitted' junto con el token en un
-- único UPDATE atómico. Antes la fila pasaba a 'admitted' sin token todavía,
-- el cliente lo veía por Realtime, redirigía sin token y el backend
-- respondía 403.
-- "for update skip locked" evita que dos ticks concurrentes reclamen la
-- misma fila. La condición admitted_at < now() - interval '60 seconds'
-- permite re-reclamar una reserva huérfana si la edge function murió entre
-- reservar y finalizar (finalize_admission nunca llegó a ejecutarse).
create or replace function admit_next_batch(p_event_id bigint, p_batch_size integer)
returns setof queue_entries
language plpgsql
security definer
set search_path = public
as $$
begin
    return query
    with claimed as (
        select id from queue_entries
        where event_id = p_event_id
          and status = 'waiting'
          and (admitted_at is null or admitted_at < now() - interval '60 seconds')
        order by joined_at
        limit p_batch_size
        for update skip locked
    )
    update queue_entries q
    set admitted_at = now()
    from claimed c
    where q.id = c.id
    returning q.*;
end;
$$;

-- Cierra la reserva: pasa a 'admitted' y graba el token en un solo UPDATE
-- atómico, así nunca hay una ventana con status='admitted' y token nulo.
create or replace function finalize_admission(p_entry_id uuid, p_token text)
returns void
language sql
security definer
set search_path = public
as $$
    update queue_entries
    set status = 'admitted', admission_token = p_token
    where id = p_entry_id
      and status = 'waiting'
$$;

-- Grants: en Postgres las funciones nacen con EXECUTE para PUBLIC, así que
-- sin estos revoke cualquier usuario autenticado podía llamar admit_next_batch
-- o finalize_admission vía PostgREST y auto-admitirse.
revoke execute on function admit_next_batch(bigint, integer) from public, anon, authenticated;
revoke execute on function finalize_admission(uuid, text) from public, anon, authenticated;
revoke execute on function expire_stale_queue_entries() from public, anon, authenticated;

-- El revoke de PUBLIC también le quita el permiso implícito a service_role
-- (no es superusuario), que es la identidad con la que la Edge Function
-- admission-tick llama a estas dos. Sin este grant la cola deja de admitir.
grant execute on function admit_next_batch(bigint, integer) to service_role;
grant execute on function finalize_admission(uuid, text) to service_role;

grant execute on function queue_heartbeat(uuid), queue_leave(uuid), get_queue_total(bigint) to authenticated;
