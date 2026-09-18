create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  available_time text,
  difficulty text,
  target_completion text,
  ai_plan jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_id uuid references public.goals(id) on delete cascade,
  title text not null,
  description text,
  duration_min integer not null default 30,
  position integer not null default 0,
  status text not null default 'todo' check (status in ('todo','active','done','stuck')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.proofs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete set null,
  task_title text,
  notes text,
  file_name text,
  file_path text,
  ai_review text,
  created_at timestamptz not null default now()
);

create table if not exists public.focus_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete set null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  seconds integer not null default 0
);

create table if not exists public.devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'Solvy Focus Buddy',
  protocol text not null default 'serial-115200',
  last_seen_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.goals enable row level security;
alter table public.tasks enable row level security;
alter table public.proofs enable row level security;
alter table public.focus_sessions enable row level security;
alter table public.devices enable row level security;

create policy "profiles own" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "goals own" on public.goals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "tasks own" on public.tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "proofs own" on public.proofs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "sessions own" on public.focus_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "devices own" on public.devices for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles(id, display_name)
  values(new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Storage bucket for proof files.
insert into storage.buckets (id, name, public)
values ('proofs', 'proofs', false)
on conflict (id) do nothing;

create policy "proof files insert own folder"
on storage.objects for insert to authenticated
with check (bucket_id = 'proofs' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "proof files read own folder"
on storage.objects for select to authenticated
using (bucket_id = 'proofs' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "proof files delete own folder"
on storage.objects for delete to authenticated
using (bucket_id = 'proofs' and (storage.foldername(name))[1] = auth.uid()::text);
