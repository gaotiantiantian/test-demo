begin;

create table if not exists public.survey_submissions (
  request_id uuid primary key,
  service_id varchar(64) not null,
  answers jsonb not null,
  reward jsonb not null,
  submission_mode varchar(16) not null default 'demo',
  submitted_at timestamptz not null default now(),
  constraint survey_submissions_mode_check
    check (submission_mode in ('demo', 'production'))
);

create index if not exists survey_submissions_submitted_at_idx
  on public.survey_submissions (submitted_at desc);

alter table public.survey_submissions enable row level security;

comment on table public.survey_submissions is '问卷提交记录';
comment on column public.survey_submissions.request_id is '前端生成的幂等请求标识';
comment on column public.survey_submissions.submission_mode is 'demo 为演示数据，production 为正式数据';

commit;
