-- Esquema preparado para Supabase (PostgreSQL + RLS)
-- Incluye índices orientados a las consultas del panel y del juego.
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
  avatar_image text,
  accent text not null default '#ff6b6b',
  birth_date date,
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
  active boolean not null default true,
  min_age int not null default 3,
  max_age int not null default 12
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

-- Content bank (admin)
create table if not exists public.study_topics (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.users_parents (id) on delete cascade,
  subject_id text not null references public.games (id) on delete cascade,
  title text not null,
  description text not null default '',
  min_age int not null default 3 check (min_age between 3 and 12),
  max_age int not null default 12 check (max_age between 3 and 12),
  reinforce boolean not null default true,
  created_at timestamptz not null default now(),
  check (min_age <= max_age)
);

create table if not exists public.admin_words (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.users_parents (id) on delete cascade,
  word text not null,
  image text,
  clue text,
  distractors text[] not null default '{}',
  min_age int not null default 3,
  max_age int not null default 12,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_passages (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.users_parents (id) on delete cascade,
  title text not null,
  body text not null,
  question text not null,
  options text[] not null default '{}',
  answer text not null,
  min_age int not null default 3,
  max_age int not null default 12,
  created_at timestamptz not null default now()
);

create table if not exists public.avatar_library (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.users_parents (id) on delete cascade,
  label text not null,
  src text not null,
  created_at timestamptz not null default now()
);

-- Meta indexing: consultas frecuentes del panel y del juego
create index if not exists idx_children_parent_id on public.children_profiles (parent_id);
create index if not exists idx_children_birth_date on public.children_profiles (birth_date);
create index if not exists idx_children_updated_at on public.children_profiles (updated_at desc);

create index if not exists idx_game_levels_game_order on public.game_levels (game_id, level_order);
create index if not exists idx_lessons_level_active on public.lessons (level_id, active);
create index if not exists idx_lessons_game_age on public.lessons (game_id, min_age, max_age);

create index if not exists idx_child_game_progress_child on public.child_game_progress (child_id);
create index if not exists idx_child_game_progress_child_game on public.child_game_progress (child_id, game_id);
create index if not exists idx_child_lesson_progress_child on public.child_lesson_progress (child_id);
create index if not exists idx_child_lesson_progress_lesson on public.child_lesson_progress (lesson_id);
create index if not exists idx_child_lesson_progress_unlocked
  on public.child_lesson_progress (child_id, unlocked)
  where unlocked = true;

create index if not exists idx_study_topics_parent_subject on public.study_topics (parent_id, subject_id);
create index if not exists idx_study_topics_age_range on public.study_topics (min_age, max_age);
create index if not exists idx_admin_words_parent_age on public.admin_words (parent_id, min_age, max_age);
create index if not exists idx_admin_passages_parent_age on public.admin_passages (parent_id, min_age, max_age);
create index if not exists idx_avatar_library_parent on public.avatar_library (parent_id, created_at desc);

-- Ejemplo de consulta cubierta por índices:
-- select * from study_topics
-- where parent_id = $1 and subject_id = 'reading' and min_age <= $age and max_age >= $age;

alter table public.children_profiles enable row level security;
alter table public.child_game_progress enable row level security;
alter table public.child_lesson_progress enable row level security;
alter table public.child_achievements enable row level security;
alter table public.study_topics enable row level security;
alter table public.admin_words enable row level security;
alter table public.admin_passages enable row level security;
alter table public.avatar_library enable row level security;

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

create policy "parents_manage_study_topics"
  on public.study_topics for all
  using (parent_id = auth.uid())
  with check (parent_id = auth.uid());

create policy "parents_manage_admin_words"
  on public.admin_words for all
  using (parent_id = auth.uid())
  with check (parent_id = auth.uid());

create policy "parents_manage_admin_passages"
  on public.admin_passages for all
  using (parent_id = auth.uid())
  with check (parent_id = auth.uid());

create policy "parents_manage_avatar_library"
  on public.avatar_library for all
  using (parent_id = auth.uid())
  with check (parent_id = auth.uid());
