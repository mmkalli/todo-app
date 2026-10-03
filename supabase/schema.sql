-- Run this once in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run.

-- Profiles ---------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Profiles: read own" on public.profiles;
create policy "Profiles: read own" on public.profiles
  for select to authenticated using (id = (select auth.uid()));

drop policy if exists "Profiles: update own" on public.profiles;
create policy "Profiles: update own" on public.profiles
  for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- Create a profile row automatically for every new signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Todos ------------------------------------------------------------------
create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 500),
  notes text check (char_length(notes) <= 5000),
  due_date date,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists todos_user_idx on public.todos (user_id, completed, due_date);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists todos_set_updated_at on public.todos;
create trigger todos_set_updated_at
  before update on public.todos
  for each row execute function public.set_updated_at();

-- Row-level security: every user can only touch their own todos.
alter table public.todos enable row level security;

drop policy if exists "Todos: select own" on public.todos;
create policy "Todos: select own" on public.todos
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists "Todos: insert own" on public.todos;
create policy "Todos: insert own" on public.todos
  for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists "Todos: update own" on public.todos;
create policy "Todos: update own" on public.todos
  for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy if exists "Todos: delete own" on public.todos;
create policy "Todos: delete own" on public.todos
  for delete to authenticated using (user_id = (select auth.uid()));
