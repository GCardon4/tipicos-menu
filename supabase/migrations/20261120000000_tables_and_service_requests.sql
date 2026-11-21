-- Mesas con enlace/QR directo y solicitudes de servicio de los clientes.
-- Ejecutar en Supabase > SQL Editor (o con `supabase db push`).

-- ───────────────────────── Tablas ─────────────────────────
create table public.restaurant_tables (
  id         uuid primary key default gen_random_uuid(),
  number     int  not null unique check (number > 0),
  label      text,
  -- Código secreto que va en el QR: evita que alguien adivine /mesa/5 y haga spam.
  code       text not null unique
             default substr(replace(gen_random_uuid()::text, '-', ''), 1, 10),
  active     boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.service_requests (
  id          uuid primary key default gen_random_uuid(),
  table_id    uuid not null references public.restaurant_tables (id) on delete cascade,
  type        text not null check (type in ('waiter', 'bill', 'water', 'napkins')),
  status      text not null default 'pending' check (status in ('pending', 'done')),
  created_at  timestamptz not null default now(),
  attended_at timestamptz
);

-- Una sola solicitud pendiente por mesa y tipo: el cliente no puede saturar el panel.
create unique index service_requests_one_pending
  on public.service_requests (table_id, type) where status = 'pending';
create index service_requests_status_created
  on public.service_requests (status, created_at);

-- ───────────────────────── Admin ─────────────────────────
-- El rol vive en app_metadata (el usuario NO puede modificarlo desde el cliente).
create or replace function public.is_admin()
returns boolean
language sql stable
as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
$$;

alter table public.restaurant_tables enable row level security;
alter table public.service_requests  enable row level security;

create policy "admin gestiona mesas" on public.restaurant_tables
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "admin gestiona solicitudes" on public.service_requests
  for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- Sin políticas para anon: los clientes NO leen ni escriben las tablas directamente.

-- ───────────────── Acceso público controlado (QR) ─────────────────
-- Los clientes solo pueden usar estas dos funciones, validadas por código de mesa.
create or replace function public.get_table_public(p_code text)
returns table (number int, label text)
language sql stable security definer set search_path = ''
as $$
  select t.number, t.label
  from public.restaurant_tables t
  where t.code = p_code and t.active
$$;

create or replace function public.request_service(p_code text, p_type text)
returns text
language plpgsql security definer set search_path = ''
as $$
declare
  v_table uuid;
begin
  select id into v_table from public.restaurant_tables where code = p_code and active;
  if v_table is null then return 'invalid_table'; end if;
  if p_type not in ('waiter', 'bill', 'water', 'napkins') then return 'invalid_type'; end if;

  insert into public.service_requests (table_id, type)
  values (v_table, p_type)
  on conflict (table_id, type) where status = 'pending' do nothing;

  return case when found then 'created' else 'already_pending' end;
end
$$;

revoke all on function public.get_table_public(text)        from public;
revoke all on function public.request_service(text, text)   from public;
grant execute on function public.get_table_public(text)      to anon, authenticated;
grant execute on function public.request_service(text, text) to anon, authenticated;

-- ───────────────────── Tiempo real para el panel ─────────────────────
-- Realtime respeta RLS: solo el admin autenticado recibe los eventos.
alter publication supabase_realtime add table public.service_requests;

-- ───────────────────── Crear el usuario admin ─────────────────────
-- 1) Crea el usuario en Authentication > Users (email + contraseña).
-- 2) Márcalo como admin (reemplaza el correo) y vuelve a iniciar sesión:
--
--   update auth.users
--   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'
--   where email = 'admin@tu-dominio.com';
