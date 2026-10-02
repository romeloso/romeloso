-- Esquema preparado para Supabase (PostgreSQL + RLS)
-- No se aplica automáticamente en el MVP local.

create extension if not exists "pgcrypto";

create table if not exists public.users_parents (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.children_profiles (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.users_parents (id) on delete cascade,
  slug text not null,
  name text not null,
  avatar text not null default '🦊',
  accent text not null default '#ff6b6b',
  level int not null default 1,
  xp int not null default 0,
  points int not null default 0,
  coins int not null default 0,
  streak_days int not null default 0,
  last_played_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (parent_id, slug)
);

create table if not exists public.games (
  id text primary key,
  slug text not null unique,
  title text not null,
  description text not null default '',
  icon text not null default '🎮',
  status text not null check (status in ('available', 'coming_soon', 'locked')),
  accent text not null default '#0f9b8e',
  created_at timestamptz not null default now()
);

create table if not exists public.game_levels (
  id text primary key,
  game_id text not null references public.games (id) on delete cascade,
  level_order int not null,
  title text not null,
  subtitle text not null default '',
  icon text not null default '⭐',
  unique (game_id, level_order)
);

create table if not exists public.lessons (
  id text primary key,
  game_id text not null references public.games (id) on delete cascade,
  level_id text not null references public.game_levels (id) on delete cascade,
  title text not null,
  content jsonb not null default '[]'::jsonb,
  active boolean not null default true
);

create table if not exists public.child_game_progress (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children_profiles (id) on delete cascade,
  game_id text not null references public.games (id) on delete cascade,
  unlocked_level_ids text[] not null default '{}',
  stats jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (child_id, game_id)
);

create table if not exists public.child_lesson_progress (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children_profiles (id) on delete cascade,
  lesson_id text not null references public.lessons (id) on delete cascade,
  stars int not null default 0,
  best_accuracy numeric(5,4) not null default 0,
  completions int not null default 0,
  unlocked boolean not null default false,
  last_played_at timestamptz,
  unique (child_id, lesson_id)
);

create table if not exists public.achievements (
  id text primary key,
  title text not null,
  description text not null,
  icon text not null,
  game_id text
);

create table if not exists public.child_achievements (
  child_id uuid not null references public.children_profiles (id) on delete cascade,
  achievement_id text not null references public.achievements (id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  primary key (child_id, achievement_id)
);

alter table public.children_profiles enable row level security;
alter table public.child_game_progress enable row level security;
alter table public.child_lesson_progress enable row level security;
alter table public.child_achievements enable row level security;

create policy "parents_manage_own_children"
  on public.children_profiles
  for all
  using (parent_id = auth.uid())
  with check (parent_id = auth.uid());

create policy "parents_manage_child_game_progress"
  on public.child_game_progress
  for all
  using (
    exists (
      select 1 from public.children_profiles c
      where c.id = child_id and c.parent_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.children_profiles c
      where c.id = child_id and c.parent_id = auth.uid()
    )
  );

create policy "parents_manage_child_lesson_progress"
  on public.child_lesson_progress
  for all
  using (
    exists (
      select 1 from public.children_profiles c
      where c.id = child_id and c.parent_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.children_profiles c
      where c.id = child_id and c.parent_id = auth.uid()
    )
  );

create policy "parents_manage_child_achievements"
  on public.child_achievements
  for all
  using (
    exists (
      select 1 from public.children_profiles c
      where c.id = child_id and c.parent_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.children_profiles c
      where c.id = child_id and c.parent_id = auth.uid()
    )
  );
