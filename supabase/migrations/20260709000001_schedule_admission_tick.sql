-- Dispara la Edge Function admission-tick cada 8s: ella consulta hiEvents por
-- eventos con cola activa + admission_rate_per_minute, y por cada uno llama
-- admit_next_batch() y emite el token de turno.
--
-- URL y secret van hardcodeados aquí porque en Supabase managed no hay
-- permiso para ALTER DATABASE ... SET (no eres superuser). El secret debe
-- coincidir con la env var QUEUE_TOKEN_SECRET del edge function.
-- Reemplaza <project-ref> y <QUEUE_TOKEN_SECRET> antes de ejecutar.
select cron.schedule(
    'admission-tick',
    '8 seconds',
    $$
    select net.http_post(
        url := 'https://<project-ref>.supabase.co/functions/v1/admission-tick',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer <QUEUE_TOKEN_SECRET>'
        )
    )
    $$
);
