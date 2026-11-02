create extension if not exists pgcrypto;

create table if not exists public.survey_submissions (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null unique,
  service_id text not null,
  answers jsonb not null,
  reward jsonb not null,
  submission_mode text not null default 'demo' check (submission_mode in ('demo', 'production')),
  submitted_at timestamptz not null default now(),
  constraint survey_answers_are_array check (jsonb_typeof(answers) = 'array'),
  constraint survey_reward_is_object check (jsonb_typeof(reward) = 'object')
);

create index if not exists survey_submissions_submitted_at_idx
  on public.survey_submissions (submitted_at desc);

alter table public.survey_submissions enable row level security;

revoke all on table public.survey_submissions from anon, authenticated;

comment on table public.survey_submissions is
  '问卷演示闭环数据。submission_mode=demo 不代表真实权益已经发放。';
