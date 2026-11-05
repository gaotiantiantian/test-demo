begin;

alter table public.survey_submissions
  add column if not exists visitor_id uuid,
  add column if not exists reward_granted boolean not null default true;

create index if not exists survey_submissions_reward_eligibility_idx
  on public.survey_submissions (visitor_id, service_id, submitted_at desc)
  where reward_granted = true;

create or replace function public.submit_survey_with_reward_limit(
  p_request_id uuid,
  p_visitor_id uuid,
  p_service_id varchar,
  p_answers jsonb,
  p_reward jsonb,
  p_submission_mode varchar,
  p_submitted_at timestamptz
)
returns setof public.survey_submissions
language plpgsql
as $$
declare
  existing_submission public.survey_submissions%rowtype;
  last_reward_at timestamptz;
  next_eligible_at timestamptz;
  should_grant_reward boolean;
  final_reward jsonb;
begin
  select *
    into existing_submission
    from public.survey_submissions
    where request_id = p_request_id;

  if found then
    return next existing_submission;
    return;
  end if;

  perform pg_advisory_xact_lock(hashtextextended(p_visitor_id::text || ':' || p_service_id, 0));

  select submitted_at
    into last_reward_at
    from public.survey_submissions
    where visitor_id = p_visitor_id
      and service_id = p_service_id
      and reward_granted = true
    order by submitted_at desc
    limit 1;

  should_grant_reward := last_reward_at is null
    or last_reward_at <= p_submitted_at - interval '30 days';
  next_eligible_at := case
    when should_grant_reward then p_submitted_at + interval '30 days'
    else last_reward_at + interval '30 days'
  end;

  final_reward := p_reward
    || jsonb_build_object(
      'granted', should_grant_reward,
      'nextEligibleAt', next_eligible_at
    );

  if not should_grant_reward then
    final_reward := final_reward
      || jsonb_build_object(
        'days', 0,
        'after', final_reward ->> 'before'
      );
  end if;

  insert into public.survey_submissions (
    request_id,
    visitor_id,
    service_id,
    answers,
    reward,
    reward_granted,
    submission_mode,
    submitted_at
  ) values (
    p_request_id,
    p_visitor_id,
    p_service_id,
    p_answers,
    final_reward,
    should_grant_reward,
    p_submission_mode,
    p_submitted_at
  )
  returning * into existing_submission;

  return next existing_submission;
end;
$$;

comment on column public.survey_submissions.visitor_id is '无登录演示版的浏览器访客标识；正式接入账号后应替换为用户 ID';
comment on column public.survey_submissions.reward_granted is '本次提交是否实际发放奖励';
comment on function public.submit_survey_with_reward_limit is '原子写入反馈，并限制同一访客同一服务滚动 30 天内仅奖励一次';

commit;
