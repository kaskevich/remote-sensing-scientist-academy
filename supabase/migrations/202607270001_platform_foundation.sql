-- Remote Sensing Scientist Academy: authenticated platform foundation.
-- Apply with `supabase db push` or paste into the Supabase SQL editor.

create extension if not exists pgcrypto;

do $$ begin
  create type public.academy_role as enum ('learner', 'instructor', 'admin');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.submission_status as enum ('not_reviewed', 'needs_revision', 'reviewed', 'approved');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.resource_visibility as enum ('public', 'authenticated', 'draft');
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text not null default 'Academy learner',
  role public.academy_role not null default 'learner',
  local_migration_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.enrollments (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.profiles(id) on delete cascade,
  instructor_id uuid references public.profiles(id) on delete set null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (learner_id, instructor_id)
);

create table if not exists public.lesson_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null check (length(lesson_id) between 1 and 160),
  completed boolean not null default false,
  is_current boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create unique index if not exists lesson_progress_one_current_per_user
  on public.lesson_progress(user_id) where is_current;

create table if not exists public.lesson_notes (
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null check (length(lesson_id) between 1 and 160),
  note text not null default '',
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null check (length(lesson_id) between 1 and 160),
  written_result text not null default '',
  status public.submission_status not null default 'not_reviewed',
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create table if not exists public.submission_files (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  storage_path text not null unique,
  file_name text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 52428800),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  check (lower(file_name) ~ '[.](png|jpe?g|webp|geojson|tiff?|csv|pdf|ipynb|html|zip)$'),
  check (mime_type in (
    'image/png','image/jpeg','image/webp','image/tiff','image/geotiff','application/geotiff',
    'application/geo+json','application/json','text/csv','application/csv','application/vnd.ms-excel',
    'application/pdf','text/html','application/zip','application/x-zip-compressed',
    'application/octet-stream','text/plain'
  ))
);

create table if not exists public.submission_comments (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (length(body) between 1 and 10000),
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  deleted_at timestamptz
);

create table if not exists public.lesson_discussions (
  id uuid primary key default gen_random_uuid(),
  lesson_id text not null unique check (length(lesson_id) between 1 and 160),
  title text not null,
  enabled boolean not null default false,
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.discussion_comments (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.lesson_discussions(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  author_display_name text not null default 'Academy member',
  body text not null check (length(body) between 0 and 10000),
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  deleted_at timestamptz
);

create table if not exists public.instructor_feedback (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  instructor_id uuid not null references public.profiles(id),
  status public.submission_status not null,
  body text not null check (length(body) between 1 and 20000),
  rubric_score jsonb,
  revision_number integer not null check (revision_number > 0),
  created_at timestamptz not null default now(),
  unique (submission_id, revision_number)
);

create table if not exists public.resource_files (
  id uuid primary key default gen_random_uuid(),
  module_id text,
  lesson_id text,
  title text not null,
  description text not null default '',
  storage_path text not null unique,
  file_name text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 52428800),
  license_source text not null default '',
  visibility public.resource_visibility not null default 'authenticated',
  ordering integer not null default 0,
  uploaded_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (module_id is not null or lesson_id is not null),
  check (lower(file_name) ~ '[.](png|jpe?g|webp|svg|pdf|csv|geojson|json|ipynb|zip|tiff?|py|md|txt|html)$'),
  check (mime_type in (
    'image/png','image/jpeg','image/webp','image/svg+xml','image/tiff','image/geotiff','application/geotiff',
    'application/geo+json','application/json','text/csv','application/csv','application/vnd.ms-excel',
    'application/pdf','text/html','application/zip','application/x-zip-compressed',
    'application/octet-stream','text/plain','text/markdown','text/x-python','application/x-python-code'
  ))
);

create index if not exists enrollments_learner_idx on public.enrollments(learner_id) where active;
create index if not exists enrollments_instructor_idx on public.enrollments(instructor_id) where active;
create index if not exists submissions_user_idx on public.submissions(user_id, updated_at desc);
create index if not exists submissions_status_idx on public.submissions(status, updated_at desc);
create index if not exists submission_comments_submission_idx on public.submission_comments(submission_id, created_at);
create index if not exists discussion_comments_thread_idx on public.discussion_comments(thread_id, created_at);
create index if not exists feedback_submission_idx on public.instructor_feedback(submission_id, revision_number desc);
create index if not exists resource_files_lesson_idx on public.resource_files(lesson_id, ordering);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
drop trigger if exists submissions_set_updated_at on public.submissions;
create trigger submissions_set_updated_at before update on public.submissions
for each row execute function public.set_updated_at();
drop trigger if exists discussions_set_updated_at on public.lesson_discussions;
create trigger discussions_set_updated_at before update on public.lesson_discussions
for each row execute function public.set_updated_at();
drop trigger if exists resources_set_updated_at on public.resource_files;
create trigger resources_set_updated_at before update on public.resource_files
for each row execute function public.set_updated_at();

create or replace function public.handle_new_academy_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, role)
  values (
    new.id,
    new.email,
    coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(coalesce(new.email, ''), '@', 1), 'Academy learner'),
    'learner'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_academy on auth.users;
create trigger on_auth_user_created_academy
after insert on auth.users
for each row execute function public.handle_new_academy_user();

create or replace function public.current_academy_role()
returns public.academy_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = (select auth.uid());
$$;

create or replace function public.is_academy_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_academy_role() in ('instructor', 'admin'), false);
$$;

create or replace function public.is_academy_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_academy_role() = 'admin', false);
$$;

create or replace function public.instructor_can_access_learner(target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    (select auth.uid()) = target_user_id
    or public.is_academy_admin()
    or exists (
      select 1 from public.enrollments
      where learner_id = target_user_id
        and instructor_id = (select auth.uid())
        and active
    );
$$;

create or replace function public.can_access_submission(target_submission_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.submissions
    where id = target_submission_id
      and public.instructor_can_access_learner(user_id)
  );
$$;

create or replace function public.can_access_discussion(target_thread_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.lesson_discussions
    where id = target_thread_id and (enabled or public.is_academy_staff())
  );
$$;

create or replace function public.can_read_resource_path(target_path text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.resource_files
    where storage_path = target_path
      and (
        visibility = 'public'
        or (visibility = 'authenticated' and (select auth.uid()) is not null)
        or public.is_academy_staff()
      )
  );
$$;

create or replace function public.can_staff_read_submission_path(target_path text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.submission_files
    where storage_path = target_path
      and public.instructor_can_access_learner(user_id)
  );
$$;

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select auth.uid()) is null then
    return new;
  end if;
  if new.id <> old.id then
    raise exception 'Profile ownership cannot be changed';
  end if;
  if new.role <> old.role and not public.is_academy_admin() then
    raise exception 'Only admins can change Academy roles';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_role_trigger on public.profiles;
create trigger protect_profile_role_trigger before update on public.profiles
for each row execute function public.protect_profile_role();

create or replace function public.protect_submission_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select auth.uid()) is null then return new; end if;
  if (select auth.uid()) = old.user_id then
    if new.user_id <> old.user_id or new.lesson_id <> old.lesson_id then
      raise exception 'Submission ownership cannot be changed';
    end if;
    if new.status <> old.status and new.status <> 'not_reviewed' then
      raise exception 'Learners cannot assign review outcomes';
    end if;
    return new;
  end if;
  if public.instructor_can_access_learner(old.user_id) then
    if new.user_id <> old.user_id
      or new.lesson_id <> old.lesson_id
      or new.written_result <> old.written_result
      or new.submitted_at is distinct from old.submitted_at then
      raise exception 'Instructors cannot change learner-authored submission content';
    end if;
    return new;
  end if;
  raise exception 'Submission access denied';
end;
$$;

drop trigger if exists protect_submission_update_trigger on public.submissions;
create trigger protect_submission_update_trigger before update on public.submissions
for each row execute function public.protect_submission_update();

create or replace function public.set_discussion_author_name()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.author_display_name = coalesce(
    (select display_name from public.profiles where id = new.author_id),
    'Academy member'
  );
  return new;
end;
$$;

drop trigger if exists set_discussion_author_name_trigger on public.discussion_comments;
create trigger set_discussion_author_name_trigger before insert on public.discussion_comments
for each row execute function public.set_discussion_author_name();

alter table public.profiles enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.lesson_notes enable row level security;
alter table public.submissions enable row level security;
alter table public.submission_files enable row level security;
alter table public.submission_comments enable row level security;
alter table public.lesson_discussions enable row level security;
alter table public.discussion_comments enable row level security;
alter table public.instructor_feedback enable row level security;
alter table public.resource_files enable row level security;

drop policy if exists "profiles select own or assigned" on public.profiles;
create policy "profiles select own or assigned" on public.profiles for select to authenticated
using (
  id = (select auth.uid())
  or public.is_academy_admin()
  or exists (
    select 1 from public.enrollments
    where learner_id = profiles.id and instructor_id = (select auth.uid()) and active
  )
);
drop policy if exists "profiles insert own learner" on public.profiles;
create policy "profiles insert own learner" on public.profiles for insert to authenticated
with check (id = (select auth.uid()) and role = 'learner');
drop policy if exists "profiles update own or admin" on public.profiles;
create policy "profiles update own or admin" on public.profiles for update to authenticated
using (id = (select auth.uid()) or public.is_academy_admin())
with check (id = (select auth.uid()) or public.is_academy_admin());

drop policy if exists "enrollments participant read" on public.enrollments;
create policy "enrollments participant read" on public.enrollments for select to authenticated
using (learner_id = (select auth.uid()) or instructor_id = (select auth.uid()) or public.is_academy_admin());
drop policy if exists "enrollments admin manage" on public.enrollments;
create policy "enrollments admin manage" on public.enrollments for all to authenticated
using (public.is_academy_admin()) with check (public.is_academy_admin());

drop policy if exists "progress learner manage" on public.lesson_progress;
create policy "progress learner manage" on public.lesson_progress for all to authenticated
using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists "progress staff read assigned" on public.lesson_progress;
create policy "progress staff read assigned" on public.lesson_progress for select to authenticated
using (public.instructor_can_access_learner(user_id));

drop policy if exists "notes strictly private" on public.lesson_notes;
create policy "notes strictly private" on public.lesson_notes for all to authenticated
using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

drop policy if exists "submissions learner manage" on public.submissions;
create policy "submissions learner manage" on public.submissions for all to authenticated
using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
drop policy if exists "submissions staff read" on public.submissions;
create policy "submissions staff read" on public.submissions for select to authenticated
using (public.instructor_can_access_learner(user_id));
drop policy if exists "submissions staff review" on public.submissions;
create policy "submissions staff review" on public.submissions for update to authenticated
using (public.instructor_can_access_learner(user_id))
with check (public.instructor_can_access_learner(user_id));

drop policy if exists "submission files learner manage" on public.submission_files;
create policy "submission files learner manage" on public.submission_files for all to authenticated
using (user_id = (select auth.uid())) with check (
  user_id = (select auth.uid())
  and exists (
    select 1 from public.submissions
    where id = submission_id and submissions.user_id = (select auth.uid())
  )
);
drop policy if exists "submission files staff read" on public.submission_files;
create policy "submission files staff read" on public.submission_files for select to authenticated
using (public.instructor_can_access_learner(user_id));

drop policy if exists "submission conversation participants read" on public.submission_comments;
create policy "submission conversation participants read" on public.submission_comments for select to authenticated
using (public.can_access_submission(submission_id));
drop policy if exists "submission conversation participants add" on public.submission_comments;
create policy "submission conversation participants add" on public.submission_comments for insert to authenticated
with check (author_id = (select auth.uid()) and public.can_access_submission(submission_id));
drop policy if exists "submission comments own or staff update" on public.submission_comments;
create policy "submission comments own or staff update" on public.submission_comments for update to authenticated
using (author_id = (select auth.uid()) or (public.is_academy_staff() and public.can_access_submission(submission_id)))
with check (author_id = (select auth.uid()) or (public.is_academy_staff() and public.can_access_submission(submission_id)));
drop policy if exists "submission comments own delete" on public.submission_comments;
create policy "submission comments own delete" on public.submission_comments for delete to authenticated
using (author_id = (select auth.uid()));

drop policy if exists "enabled discussions read" on public.lesson_discussions;
create policy "enabled discussions read" on public.lesson_discussions for select to authenticated
using (enabled or public.is_academy_staff());
drop policy if exists "staff manage discussions" on public.lesson_discussions;
create policy "staff manage discussions" on public.lesson_discussions for all to authenticated
using (public.is_academy_staff()) with check (public.is_academy_staff());

drop policy if exists "discussion comments member read" on public.discussion_comments;
create policy "discussion comments member read" on public.discussion_comments for select to authenticated
using (public.can_access_discussion(thread_id));
drop policy if exists "discussion comments member add" on public.discussion_comments;
create policy "discussion comments member add" on public.discussion_comments for insert to authenticated
with check (author_id = (select auth.uid()) and public.can_access_discussion(thread_id));
drop policy if exists "discussion comments own or moderated update" on public.discussion_comments;
create policy "discussion comments own or moderated update" on public.discussion_comments for update to authenticated
using (author_id = (select auth.uid()) or (public.is_academy_staff() and public.can_access_discussion(thread_id)))
with check (author_id = (select auth.uid()) or (public.is_academy_staff() and public.can_access_discussion(thread_id)));
drop policy if exists "discussion comments own delete" on public.discussion_comments;
create policy "discussion comments own delete" on public.discussion_comments for delete to authenticated
using (author_id = (select auth.uid()));

drop policy if exists "feedback learner and assigned staff read" on public.instructor_feedback;
create policy "feedback learner and assigned staff read" on public.instructor_feedback for select to authenticated
using (public.can_access_submission(submission_id));
drop policy if exists "feedback staff manage" on public.instructor_feedback;
create policy "feedback staff manage" on public.instructor_feedback for all to authenticated
using (public.is_academy_staff() and public.can_access_submission(submission_id))
with check (
  public.is_academy_staff()
  and public.can_access_submission(submission_id)
  and (instructor_id = (select auth.uid()) or public.is_academy_admin())
);

drop policy if exists "resources visible audience read" on public.resource_files;
drop policy if exists "resources public read" on public.resource_files;
create policy "resources public read" on public.resource_files for select to anon
using (visibility = 'public');
drop policy if exists "resources authenticated audience read" on public.resource_files;
create policy "resources authenticated audience read" on public.resource_files for select to authenticated
using (
  visibility = 'public'
  or visibility = 'authenticated'
  or public.is_academy_staff()
);
drop policy if exists "resources staff manage" on public.resource_files;
create policy "resources staff manage" on public.resource_files for all to authenticated
using (public.is_academy_staff())
with check (
  public.is_academy_staff()
  and (uploaded_by = (select auth.uid()) or public.is_academy_admin())
);

grant usage on schema public to anon, authenticated;
revoke all on table
  public.profiles,
  public.enrollments,
  public.lesson_progress,
  public.lesson_notes,
  public.submissions,
  public.submission_files,
  public.submission_comments,
  public.lesson_discussions,
  public.discussion_comments,
  public.instructor_feedback,
  public.resource_files
from anon;
grant select on public.resource_files to anon;
grant select, insert, update, delete on table
  public.profiles,
  public.enrollments,
  public.lesson_progress,
  public.lesson_notes,
  public.submissions,
  public.submission_files,
  public.submission_comments,
  public.lesson_discussions,
  public.discussion_comments,
  public.instructor_feedback,
  public.resource_files
to authenticated;

revoke all on function public.set_updated_at() from public;
revoke all on function public.handle_new_academy_user() from public;
revoke all on function public.current_academy_role() from public;
revoke all on function public.is_academy_staff() from public;
revoke all on function public.is_academy_admin() from public;
revoke all on function public.instructor_can_access_learner(uuid) from public;
revoke all on function public.can_access_submission(uuid) from public;
revoke all on function public.can_access_discussion(uuid) from public;
revoke all on function public.can_read_resource_path(text) from public;
revoke all on function public.can_staff_read_submission_path(text) from public;
revoke all on function public.protect_profile_role() from public;
revoke all on function public.protect_submission_update() from public;
revoke all on function public.set_discussion_author_name() from public;
grant execute on function public.current_academy_role() to authenticated;
grant execute on function public.is_academy_staff() to authenticated;
grant execute on function public.is_academy_admin() to authenticated;
grant execute on function public.instructor_can_access_learner(uuid) to authenticated;
grant execute on function public.can_access_submission(uuid) to authenticated;
grant execute on function public.can_access_discussion(uuid) to authenticated;
grant execute on function public.can_read_resource_path(text) to anon, authenticated;
grant execute on function public.can_staff_read_submission_path(text) to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'learner-submissions',
  'learner-submissions',
  false,
  52428800,
  array[
    'image/png','image/jpeg','image/webp','image/tiff','image/geotiff','application/geotiff',
    'application/geo+json','application/json','text/csv','application/csv','application/vnd.ms-excel','application/pdf',
    'text/html','application/zip','application/x-zip-compressed','application/octet-stream','text/plain'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'lesson-resources',
  'lesson-resources',
  false,
  52428800,
  array[
    'image/png','image/jpeg','image/webp','image/svg+xml','image/tiff','image/geotiff','application/geotiff',
    'application/geo+json','application/json','text/csv','application/csv','application/vnd.ms-excel','application/pdf',
    'text/html','application/zip','application/x-zip-compressed','application/octet-stream','text/plain',
    'text/markdown','text/x-python','application/x-python-code'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "learners upload own submission files" on storage.objects;
create policy "learners upload own submission files" on storage.objects for insert to authenticated
with check (
  bucket_id = 'learner-submissions'
  and (storage.foldername(name))[1] = (select auth.uid())::text
  and lower(name) ~ '[.](png|jpe?g|webp|geojson|tiff?|csv|pdf|ipynb|html|zip)$'
);
drop policy if exists "submission owners and assigned staff read" on storage.objects;
create policy "submission owners and assigned staff read" on storage.objects for select to authenticated
using (
  bucket_id = 'learner-submissions'
  and (
    (storage.foldername(name))[1] = (select auth.uid())::text
    or public.can_staff_read_submission_path(name)
  )
);
drop policy if exists "learners update own submission files" on storage.objects;
create policy "learners update own submission files" on storage.objects for update to authenticated
using (bucket_id = 'learner-submissions' and (storage.foldername(name))[1] = (select auth.uid())::text)
with check (bucket_id = 'learner-submissions' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists "learners delete own submission files" on storage.objects;
create policy "learners delete own submission files" on storage.objects for delete to authenticated
using (bucket_id = 'learner-submissions' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "resource audience reads objects" on storage.objects;
create policy "resource audience reads objects" on storage.objects for select to anon, authenticated
using (bucket_id = 'lesson-resources' and public.can_read_resource_path(name));
drop policy if exists "staff upload resource objects" on storage.objects;
create policy "staff upload resource objects" on storage.objects for insert to authenticated
with check (
  bucket_id = 'lesson-resources'
  and public.is_academy_staff()
  and lower(name) ~ '[.](png|jpe?g|webp|svg|pdf|csv|geojson|json|ipynb|zip|tiff?|py|md|txt|html)$'
);
drop policy if exists "staff select new resource objects" on storage.objects;
create policy "staff select new resource objects" on storage.objects for select to authenticated
using (bucket_id = 'lesson-resources' and public.is_academy_staff());
drop policy if exists "staff update resource objects" on storage.objects;
create policy "staff update resource objects" on storage.objects for update to authenticated
using (bucket_id = 'lesson-resources' and public.is_academy_staff())
with check (bucket_id = 'lesson-resources' and public.is_academy_staff());
drop policy if exists "staff delete resource objects" on storage.objects;
create policy "staff delete resource objects" on storage.objects for delete to authenticated
using (bucket_id = 'lesson-resources' and public.is_academy_staff());
