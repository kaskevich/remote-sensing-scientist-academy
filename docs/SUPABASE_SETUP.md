# Supabase setup

The Academy remains a static Next.js export on GitHub Pages. Supabase provides
browser-accessible authentication, Postgres data, and private file storage. No
Next.js API routes or service-role browser credentials are required.

## 1. Create the project

1. Create a Supabase project.
2. In **Project Settings → API**, copy the project URL and publishable key. An
   older project may label the browser-safe key as the `anon` key.
3. Never copy a service-role key into this repository, GitHub Pages, or a
   `NEXT_PUBLIC_` environment variable. It bypasses Row Level Security.

## 2. Apply the schema and security policies

Apply [`supabase/migrations/202607270001_platform_foundation.sql`](../supabase/migrations/202607270001_platform_foundation.sql)
using either:

```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

or paste the migration into the Supabase SQL editor and run it once.

The migration creates:

- profiles and learner/instructor/admin roles;
- enrollments;
- progress and strictly private notes;
- submissions, private submission comments, and revision feedback;
- optional shared lesson discussions;
- instructor resource metadata;
- private `learner-submissions` and `lesson-resources` Storage buckets;
- RLS policies for every exposed Academy table and both Storage workflows.

The bucket limit is 50 MB per file. If it changes, update the migration's bucket
and table constraints together with `NEXT_PUBLIC_MAX_UPLOAD_MB`.

## 3. Configure email magic links

In **Authentication → URL Configuration** set:

- Site URL: `https://kaskevich.github.io/remote-sensing-scientist-academy/`
- Additional redirect URL: `http://localhost:3000/**`
- Additional redirect URL: `https://kaskevich.github.io/remote-sensing-scientist-academy/**`

Keep email authentication enabled. The app calls `signInWithOtp` with the
current Academy URL, so the magic link returns to the same static page.

## 4. Configure local environment variables

Copy `.env.example` to `.env.local` and add the browser-safe values:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
NEXT_PUBLIC_MAX_UPLOAD_MB=50
```

Restart `npm run dev` after changing environment variables. With no values, the
Academy intentionally remains in guest/browser-only mode.

## 5. Configure GitHub Pages

In the GitHub repository settings add:

- repository variable `NEXT_PUBLIC_SUPABASE_URL`;
- repository secret `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

The Pages workflow passes these into the static build. Although a publishable
key is designed for browser use, keeping it in a GitHub secret avoids accidental
copying into logs or documentation. RLS—not key secrecy—is the data boundary.

## 6. Create the first admin and enroll learners

Sign in once so the profile trigger creates the user profile. Then run this in
the SQL editor using the actual account email:

```sql
update public.profiles
set role = 'admin'
where email = 'YOUR_EMAIL';
```

Admins can change later roles in the Academy admin area. To assign a learner to
an instructor:

```sql
insert into public.enrollments (learner_id, instructor_id)
select learner.id, instructor.id
from public.profiles learner
cross join public.profiles instructor
where learner.email = 'LEARNER_EMAIL'
  and instructor.email = 'INSTRUCTOR_EMAIL';
```

## 7. Verify security

With the Supabase CLI and local stack running:

```bash
supabase db reset
supabase test db
```

The pgTAP test in `supabase/tests/database/rls.test.sql` checks ownership and
instructor-enrollment boundaries. The regular unit suite also checks that every
exposed table has RLS and that private-note and user-scoped Storage policies are
present.

## Access model

- Learners manage only their own progress, notes, submissions, and files.
- Private lesson notes are not readable by instructors or other learners.
- Assigned instructors can read learner submissions and private submission
  conversations, add comments, and create revision feedback.
- Signed-in members can use only discussions that staff have enabled.
- Learners can edit/delete their own discussion comments; staff can moderate.
- Admins manage roles and Academy records, but private learner notes remain
  readable only by their owner.
- Storage downloads are authorized through RLS. The browser never receives a
  service-role key.
