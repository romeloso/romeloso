-- Esquema de Sorova Games en PostgreSQL (Railway).
-- El documento completo vive en app_state. Las demás tablas proyectan
-- perfiles, progreso y material para consultarlos desde el panel de datos.

create table if not exists public.app_state (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.children_profiles (
  id text primary key,
  name text not null,
  birth_date date,
  school_grade smallint,
  level int not null default 1,
  xp int not null default 0,
  points int not null default 0,
  coins int not null default 0,
  streak_days int not null default 0,
  last_played_date date,
  avatar text,
  avatar_image text,
  accent text,
  achievements text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists public.child_progress (
  child_id text primary key references public.children_profiles (id) on delete cascade,
  progress jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.study_topics (
  id text primary key,
  subject_id text not null,
  title text not null,
  description text not null default '',
  min_age int not null default 3,
  max_age int not null default 12,
  min_grade int not null default 0,
  max_grade int not null default 6,
  reinforce boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_words (
  id text primary key,
  word text not null,
  image text,
  clue text,
  distractors text[] not null default '{}',
  min_age int not null default 3,
  max_age int not null default 12,
  min_grade int not null default 0,
  max_grade int not null default 6,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_passages (
  id text primary key,
  title text not null,
  body text not null,
  question text not null,
  options text[] not null default '{}',
  answer text not null,
  min_age int not null default 3,
  max_age int not null default 12,
  min_grade int not null default 0,
  max_grade int not null default 6,
  created_at timestamptz not null default now()
);

create table if not exists public.avatar_library (
  id text primary key,
  label text not null,
  src text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_study_topics_subject on public.study_topics (subject_id);
create index if not exists idx_children_updated_at on public.children_profiles (updated_at desc);
