-- Diagnóstico de Ativos Digitais — estrutura inicial
-- Rodar uma vez no Supabase: SQL Editor > New query > colar tudo > Run.

-- ---------------------------------------------------------------------------
-- Acesso restrito ao domínio @eduardometinger.com
-- ---------------------------------------------------------------------------

-- Bloqueia, no próprio banco, qualquer cadastro com e-mail fora do domínio.
create or replace function public.enforce_email_domain()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.email is null or split_part(lower(new.email), '@', 2) <> 'eduardometinger.com' then
    raise exception 'Cadastro permitido apenas para e-mails @eduardometinger.com';
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_email_domain on auth.users;
create trigger enforce_email_domain
  before insert or update of email on auth.users
  for each row execute function public.enforce_email_domain();

-- Usado pelas políticas de segurança: só usuários logados do domínio.
create or replace function public.is_allowed_user()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce(split_part(lower(auth.jwt() ->> 'email'), '@', 2) = 'eduardometinger.com', false)
$$;

-- ---------------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------------

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  segment text,
  city text,
  website text,
  instagram text,
  google_business text,
  whatsapp text,
  bm_admin text,
  objective text,
  notes text,
  status text not null default 'em_andamento'
    check (status in ('em_andamento', 'concluido', 'arquivado')),
  created_by uuid references auth.users (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Um registro por item marcado do checklist (as chaves vêm de src/lib/checklist.ts).
create table if not exists public.checklist_progress (
  client_id uuid not null references public.clients (id) on delete cascade,
  item_key text not null,
  checked boolean not null default false,
  updated_by uuid references auth.users (id) on delete set null default auth.uid(),
  updated_at timestamptz not null default now(),
  primary key (client_id, item_key)
);

-- Nota, status e observações de cada etapa do diagnóstico.
create table if not exists public.section_reviews (
  client_id uuid not null references public.clients (id) on delete cascade,
  section_key text not null,
  score smallint check (score between 0 and 10),
  status text not null default 'pendente'
    check (status in ('pendente', 'avaliado', 'parcial', 'nao_avaliado')),
  notes text,
  updated_by uuid references auth.users (id) on delete set null default auth.uid(),
  updated_at timestamptz not null default now(),
  primary key (client_id, section_key)
);

create index if not exists clients_created_at_idx on public.clients (created_at desc);

-- ---------------------------------------------------------------------------
-- Segurança (Row Level Security): só a equipe do domínio lê e escreve.
-- ---------------------------------------------------------------------------

alter table public.clients enable row level security;
alter table public.checklist_progress enable row level security;
alter table public.section_reviews enable row level security;

drop policy if exists "equipe acessa clientes" on public.clients;
create policy "equipe acessa clientes" on public.clients
  for all to authenticated
  using (public.is_allowed_user())
  with check (public.is_allowed_user());

drop policy if exists "equipe acessa checklist" on public.checklist_progress;
create policy "equipe acessa checklist" on public.checklist_progress
  for all to authenticated
  using (public.is_allowed_user())
  with check (public.is_allowed_user());

drop policy if exists "equipe acessa avaliacoes" on public.section_reviews;
create policy "equipe acessa avaliacoes" on public.section_reviews
  for all to authenticated
  using (public.is_allowed_user())
  with check (public.is_allowed_user());
