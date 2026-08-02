-- Sala de espera virtual: estado de la cola (event_queue_settings vive en hiEvents/Postgres).
create extension if not exists pg_cron;
create extension if not exists pg_net;

create type queue_entry_status as enum ('waiting', 'admitted', 'abandoned');

create table queue_entries (
    id uuid primary key default gen_random_uuid(),
    event_id bigint not null,
    user_id uuid not null references auth.users(id),
    status queue_entry_status not null default 'waiting',
    joined_at timestamptz not null default now(),
    admitted_at timestamptz,
    last_heartbeat_at timestamptz not null default now(),
    admission_token text
);

create index queue_entries_position_idx on queue_entries (event_id, status, joined_at);
create index queue_entries_user_idx on queue_entries (user_id);

alter table queue_entries enable row level security;

create policy "select own entries"
    on queue_entries for select
    using (user_id = auth.uid());

create policy "insert own entries"
    on queue_entries for insert
    with check (user_id = auth.uid());

create policy "update own entries"
    on queue_entries for update
    using (user_id = auth.uid());

-- Posición FIFO dentro de la fila 'waiting' del evento (1 = primero).
create or replace function get_queue_position(p_event_id bigint, p_entry_id uuid)
returns integer
language sql
security definer
set search_path = public
as $$
    select count(*)::integer + 1
    from queue_entries
    where event_id = p_event_id
      and status = 'waiting'
      and joined_at < (select joined_at from queue_entries where id = p_entry_id)
$$;

-- Abandona filas sin heartbeat reciente (cerró pestaña / se fue).
create or replace function expire_stale_queue_entries()
returns void
language sql
security definer
set search_path = public
as $$
    update queue_entries
    set status = 'abandoned'
    where status = 'waiting'
      and last_heartbeat_at < now() - interval '30 seconds'
$$;

-- Admite las N filas 'waiting' más antiguas de un evento (N = admission_rate_per_minute * minutos_del_intervalo).
create or replace function admit_next_batch(p_event_id bigint, p_batch_size integer)
returns setof queue_entries
language plpgsql
security definer
set search_path = public
as $$
begin
    return query
    update queue_entries
    set status = 'admitted', admitted_at = now()
    where id in (
        select id from queue_entries
        where event_id = p_event_id
          and status = 'waiting'
        order by joined_at
        limit p_batch_size
    )
    returning *;
end;
$$;

select cron.schedule('expire-stale-queue-entries', '15 seconds', 'select expire_stale_queue_entries()');

-- Realtime: el frontend se suscribe a su propia fila para enterarse del paso a
-- 'admitted' (redirige al seat picker). Sin esto el UPDATE nunca se empuja.
alter publication supabase_realtime add table queue_entries;
alter table queue_entries replica identity full;
