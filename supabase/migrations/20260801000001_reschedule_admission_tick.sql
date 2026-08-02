-- Re-agenda el cron 'admission-tick': la migración 20260709000001 dejó los
-- placeholders <project-ref> y <QUEUE_TOKEN_SECRET> literales en el cuerpo.
-- Si se aplicó tal cual, el job existe pero apunta a un host inválido y
-- nunca admite a nadie.
--
-- ============================================================
-- ANTES DE EJECUTAR ESTA MIGRACIÓN:
--   1. Reemplazá <project-ref> por el ref real del proyecto Supabase.
--   2. Reemplazá <QUEUE_TOKEN_SECRET> por el valor real (debe coincidir
--      con la env var QUEUE_TOKEN_SECRET del edge function admission-tick).
-- DESPUÉS DE EJECUTARLA, verificá:
--   select jobname, schedule, active from cron.job;
--   select status_code, content from net._http_response order by created desc limit 5;
-- ============================================================

-- Elimina el job anterior si existe, para poder re-crearlo sin duplicar.
select cron.unschedule('admission-tick')
where exists (select 1 from cron.job where jobname = 'admission-tick');

select cron.schedule(
    'admission-tick',
    '8 seconds',
    $$
    select net.http_post(
        url := 'https://cprilzgbvvucfrdtmppl.supabase.co/functions/v1/admission-tick',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer <QUEUE_TOKEN_SECRET>'
        )
    )
    $$
);

-- El cron 'expire-stale-queue-entries' (cada 15s) NO se toca acá: sigue
-- llamando a expire_stale_queue_entries() por nombre, y esa función ya fue
-- reemplazada (create or replace) en 20260801000000_queue_hardening.sql con
-- el nuevo umbral de 90 segundos. No hace falta re-agendarlo.
