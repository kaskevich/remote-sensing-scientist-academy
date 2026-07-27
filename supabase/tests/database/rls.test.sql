begin;
create extension if not exists pgtap with schema extensions;
select plan(8);

insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at)
values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'learner-one@example.test', '', now(), now(), now()),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'learner-two@example.test', '', now(), now(), now()),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'instructor@example.test', '', now(), now(), now()),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin@example.test', '', now(), now(), now());

update public.profiles set role = 'instructor' where id = '10000000-0000-0000-0000-000000000003';
update public.profiles set role = 'admin' where id = '10000000-0000-0000-0000-000000000004';
insert into public.enrollments (learner_id, instructor_id)
values ('10000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003');

set local role authenticated;
select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000001', true);
select lives_ok(
  $$insert into public.lesson_progress (user_id, lesson_id, completed) values ('10000000-0000-0000-0000-000000000001', 'lesson-01', true)$$,
  'learner can write own progress'
);
select throws_ok(
  $$insert into public.lesson_progress (user_id, lesson_id, completed) values ('10000000-0000-0000-0000-000000000002', 'lesson-01', true)$$,
  '42501',
  'new row violates row-level security policy for table "lesson_progress"',
  'learner cannot write another learner progress'
);
select lives_ok(
  $$insert into public.lesson_notes (user_id, lesson_id, note) values ('10000000-0000-0000-0000-000000000001', 'lesson-01', 'private note')$$,
  'learner can write own private note'
);
select results_eq(
  $$select count(*)::bigint from public.lesson_notes where user_id = '10000000-0000-0000-0000-000000000002'$$,
  $$values (0::bigint)$$,
  'learner cannot read another learner notes'
);
select lives_ok(
  $$insert into public.submissions (id, user_id, lesson_id, written_result) values ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'lesson-01', 'result')$$,
  'learner can create own submission'
);

select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000002', true);
select results_eq(
  $$select count(*)::bigint from public.submissions where id = '20000000-0000-0000-0000-000000000001'$$,
  $$values (0::bigint)$$,
  'another learner cannot read the submission'
);
select results_eq(
  $$select count(*)::bigint from public.lesson_notes where user_id = '10000000-0000-0000-0000-000000000001'$$,
  $$values (0::bigint)$$,
  'another learner cannot read private notes'
);

select set_config('request.jwt.claim.sub', '10000000-0000-0000-0000-000000000003', true);
select results_eq(
  $$select count(*)::bigint from public.submissions where id = '20000000-0000-0000-0000-000000000001'$$,
  $$values (1::bigint)$$,
  'assigned instructor can read learner submission'
);

select * from finish();
rollback;
